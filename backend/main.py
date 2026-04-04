
import os
import shutil
import tempfile
import statistics
import re
import asyncio
import logging
import io
from pathlib import Path
from typing import List, Dict, Any, Optional

import httpx
import PyPDF2
import git
from fastapi import FastAPI, HTTPException, UploadFile, File, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from dotenv import load_dotenv

# Analysis Engines
from radon.complexity import cc_visit
from radon.metrics import mi_visit
from radon.raw import analyze as raw_analyze
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from sqlalchemy import create_engine, Column, Integer, String, JSON, Float, or_, distinct
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from fastapi import Depends, Form

# --- DATABASE CONFIG ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./axiom_users.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
app = FastAPI(title="RepoLens Pro", version="2.0.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your Next.js dev server
    allow_credentials=True,
    allow_methods=["*"], # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"], # Allows Content-Type, Authorization, etc.
)

# --- SECURITY ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# --- Configuration & Logging ---
load_dotenv()
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RepoLens")

MODEL_NAME = "gemini-2.5-flash" 

class Config:
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# --- Constants & Helpers ---
IGNORE_DIRS = {".git", "node_modules", "venv", "__pycache__", "dist", "build", ".next", ".vercel"}
IGNORE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".pyc", ".mp4", ".pdf", ".lock", ".json"}

def get_github_headers() -> dict:
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

# --- Schemas ---
class RepoRequest(BaseModel):
    url: HttpUrl
    mode: str = "standard"

class RepoResponse(BaseModel):
    projectSummary: str
    techStack: List[str]
    complexityScore: int
    aiGeneratedPercentage: int
    noveltyScore: int
    topStrengths: List[str]
    topImprovements: List[str]
    possibleImpacts: List[str]
    securityAlerts: List[str]
    githubStats: Dict[str, Any]
    fileTree: Dict[str, Any]
    rawStats: Dict[str, Any]
# --- DATABASE MODELS ---
class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profile_data = Column(JSON, default={})
    resume_data = Column(JSON, default={})
    linkedin_data = Column(JSON, default={})
    github_data = Column(JSON, default={})

class DBRecruiter(Base):
    __tablename__ = "recruiters"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    company_name = Column(String)

class StudentSkill(Base):
    __tablename__ = "StudentSkills"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    skill = Column(String, index=True)
    category = Column(String)
    signal_score = Column(Integer)
    years_used = Column(Float)

# Create the .db file and tables
Base.metadata.create_all(bind=engine)

# --- DB DEPENDENCY ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SCHEMAS ---
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class RecruiterRegister(BaseModel):
    username: str
    email: str
    password: str
    company_name: str

class RecruiterLogin(BaseModel):
    email: str
    password: str
# --- Core Logic Services ---
class AnalysisService:
    @staticmethod
    async def get_github_stats(url: str) -> dict:
        headers = get_github_headers()
        parts = str(url).rstrip('/').split('/')
        if len(parts) < 2: return {"stars": 0, "forks": 0, "open_issues": 0, "last_updated": "N/A"}
        repo_path = f"{parts[-2]}/{parts[-1]}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.get(f"https://api.github.com/repos/{repo_path}", headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    return {
                        "stars": data.get("stargazers_count", 0),
                        "forks": data.get("forks_count", 0),
                        "open_issues": data.get("open_issues_count", 0),
                        "last_updated": data.get("updated_at", "")[:10]
                    }
            except Exception: pass
        return {"stars": 0, "forks": 0, "open_issues": 0, "last_updated": "N/A"}

    @staticmethod
    def get_code_metrics(dir_path: Path) -> Dict[str, Any]:
        scores, mi_list = [], []
        loc, comments = 0, 0
        source_files = [p for p in dir_path.rglob("*.py") if not any(d in p.parts for d in IGNORE_DIRS)]
        for p in source_files:
            try:
                code = p.read_text(encoding="utf-8", errors="ignore")
                raw = raw_analyze(code)
                loc += raw.loc
                comments += raw.comments
                mi_list.append(mi_visit(code, multi=True))
                scores.extend([b.complexity for b in cc_visit(code)])
            except: continue
        avg_mi = int(statistics.mean(mi_list)) if mi_list else 75
        avg_cc = round(statistics.mean(scores), 2) if scores else 1.0
        return {
            "maintainabilityIndex": avg_mi,
            "avgComplexity": avg_cc,
            "totalLines": loc,
            "commentRatio": f"{round((comments/loc)*100, 1) if loc > 0 else 0}%",
            "fileCount": len(list(dir_path.rglob("*")))
        }

# --- Initialize Router ---
router = APIRouter(prefix="/api")

# --- Endpoints ---

@router.post("/upload-linkedin")
async def parse_linkedin(email: Optional[str] = Form(None), file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file")
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.2)
        prompt = ChatPromptTemplate.from_template("""
    SYSTEM ROLE:
    You are an elite Tech Profile Auditor. Analyze the following LinkedIn PDF text and return a JSON object.
    
    EXPECTED JSON SCHEMA:
    {{
      "credibility_score": number (0-100),
      "name": "string",
      "headline": "string",
      "about": "string",
      "experience": [{{"company": "string", "role": "string", "duration": "string"}}],
      "education": [{{"institution": "string", "degree": "string"}}],
      "skills": ["string"],
      "certifications": ["string"],
      "verification_tags": ["string"],
      "brutal_feedback": ["string"],
      "roadmap": [{{ "title": "string", "description": "string" }}]
    }}

    LinkedIn Profile PDF Text: {text}
    """)
        chain = prompt | llm | JsonOutputParser()
        result = await chain.ainvoke({"text": text[:12000]})
        
        # Persist to DB
        if email:
            db_user = db.query(DBUser).filter(DBUser.email == email).first()
            if db_user:
                db_user.linkedin_data = result
                db.add(db_user)
                db.commit()
                db.refresh(db_user)
            
        return result
    except Exception as e:
        logger.error(f"LinkedIn Parsing Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to audit LinkedIn PDF")
    
@router.post("/register")
async def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists by email
    existing_user = db.query(DBUser).filter(DBUser.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered in Axiom Archive.")
    
    # Hash the secret key (password)
    hashed_pass = pwd_context.hash(user.password)
    
    new_user = DBUser(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pass
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"status": "identity_initialized", "user_id": new_user.id}

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Normalize email to lowercase and strip whitespace
    clean_email = user.email.lower().strip()
    db_user = db.query(DBUser).filter(DBUser.email == clean_email).first()
    
    if not db_user:
        logger.warning(f"Login failed: {clean_email} not found.")
        raise HTTPException(status_code=401, detail="Identity not found.")
    
    return {
        "status": "success",
        "username": db_user.username,
        "message": "Neural link established. Welcome to Axiom."
    }

@router.post("/recruiter/register")
async def register_recruiter(recruiter: RecruiterRegister, db: Session = Depends(get_db)):
    existing = db.query(DBRecruiter).filter(DBRecruiter.email == recruiter.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Identity already forged in Axiom.")
    
    hashed_pass = pwd_context.hash(recruiter.password)
    new_recruiter = DBRecruiter(
        username=recruiter.username,
        email=recruiter.email,
        hashed_password=hashed_pass,
        company_name=recruiter.company_name
    )
    db.add(new_recruiter)
    db.commit()
    return {"status": "recruiter_authorized", "recruiter_id": new_recruiter.id}

@router.post("/recruiter/login")
async def login_recruiter(recruiter: RecruiterLogin, db: Session = Depends(get_db)):
    clean_email = recruiter.email.lower().strip()
    db_recruiter = db.query(DBRecruiter).filter(DBRecruiter.email == clean_email).first()
    
    if not db_recruiter or not pwd_context.verify(recruiter.password, db_recruiter.hashed_password):
        raise HTTPException(status_code=401, detail="Unauthorized access to recruiting terminal.")
    
    return {
        "status": "access_granted",
        "username": db_recruiter.username,
        "company": db_recruiter.company_name
    }

@router.get("/github/{username}")
async def fetch_github_profile(username: str, email: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetches developer DNA by isolating individual 'Hard Work' vs group noise."""
    headers = {"Authorization": f"token {Config.GITHUB_TOKEN}"} if Config.GITHUB_TOKEN else {}
    
    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            # 1. Fetch Basic User and Repo Data
            user_resp = await client.get(f"https://api.github.com/users/{username}", headers=headers)
            repos_resp = await client.get(f"https://api.github.com/users/{username}/repos?per_page=50&sort=pushed", headers=headers)
            
            if user_resp.status_code != 200:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_data = user_resp.json()
            all_repos = repos_resp.json()
            
            repo_audit_list = []
            total_stars = 0

            # 2. PROOF OF WORK FILTERING
            # We check the 'contributors' for each repo to find YOUR specific work
            for repo in all_repos[:20]: # Check the 20 most recent for depth
                total_stars += repo.get("stargazers_count", 0)
                repo_name = repo.get("name")
                owner = repo.get("owner", {}).get("login")

                # Fetch contributor stats for this specific repo
                stats_resp = await client.get(
                    f"https://api.github.com/repos/{owner}/{repo_name}/contributors", 
                    headers=headers
                )
                
                user_commits = 0
                if stats_resp.status_code == 200:
                    contributors = stats_resp.json()
                    # Find the specific username in the contributor list
                    for contributor in contributors:
                        if contributor.get("login").lower() == username.lower():
                            user_commits = contributor.get("contributions", 0)
                            break
                
                # INDIVIDUAL HARD WORK FORMULA
                # High weight on personal commits, low weight on total stars
                work_score = (user_commits * 15) + (repo.get("stargazers_count", 0) * 5)
                
                if user_commits > 0: # Only include if you actually wrote code
                    repo_audit_list.append({
                        "name": repo_name,
                        "description": repo.get("description") or "No description.",
                        "personal_commits": user_commits,
                        "stars": repo.get("stargazers_count", 0),
                        "language": repo.get("language") or "Mixed",
                        "url": repo.get("html_url"),
                        "work_score": work_score
                    })

            # Sort by our new Proof of Work score
            top_5_repos = sorted(repo_audit_list, key=lambda x: x['work_score'], reverse=True)[:5]

            # 3. AI AUDIT (Gemini now sees your ACTUAL contributions)
            llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.1)
            parser = JsonOutputParser()
            
            audit_prompt = ChatPromptTemplate.from_template(
                "System: You are a Tier-1 Technical Auditor. You are analyzing the INDIVIDUAL contribution of {login}.\n"
                "Verified Personal Work (Commits + Impact): {repos}\n\n"
                "Generate a JSON object with keys:\n"
                "1. 'radarMetrics': {{'System Design': 0-100, 'Code Quality': 0-100, 'Consistency': 0-100, 'Frontend': 0-100, 'Backend': 0-100, 'Security': 0-100}}\n"
                "2. 'strategicVerdict': A sharp 2-sentence analysis of their personal coding 'grind' and expertise.\n"
                "3. 'milestones': 2 upcoming technical goals.\n"
                "4. 'devType': A title based on their most committed technologies.\n"
                "5. 'topLanguages': ['Python', 'Rust', 'JavaScript']\n"
                "6. 'recentAchievements': ['Contributed to massive open source project', 'Published popular library']\n"
                "{format_instructions}"
            )

            ai_audit = await (audit_prompt | llm | parser).ainvoke({
                "login": username,
                "repos": top_5_repos,
                "format_instructions": parser.get_format_instructions()
            })

            result = {
                "name": user_data.get("name", username),
                "avatarUrl": user_data.get("avatar_url", ""),
                "publicRepos": user_data.get("public_repos", 0),
                "totalStars": total_stars,
                "topProjects": top_5_repos,
                "aiAudit": ai_audit 
            }
            
            # Persist to DB if email provided
            if email:
                db_user = db.query(DBUser).filter(DBUser.email == email).first()
                if db_user:
                    db_user.github_data = result
                    db.add(db_user)
                    db.commit()
                    db.refresh(db_user)
            
            return result
            
        except Exception as e:
            logger.error(f"Audit Error: {e}")
            raise HTTPException(status_code=500, detail="Neural sync failed.")

@router.post("/analyze", response_model=RepoResponse)
async def analyze_repo(request: RepoRequest):
    temp_dir = tempfile.mkdtemp()
    try:
        process = await asyncio.create_subprocess_exec("git", "clone", "--depth", "1", str(request.url), temp_dir)
        await asyncio.wait_for(process.communicate(), timeout=30.0)
        root = Path(temp_dir)
        metrics, github_stats = await asyncio.gather(asyncio.to_thread(AnalysisService.get_code_metrics, root), AnalysisService.get_github_stats(request.url))
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.1)
        parser = JsonOutputParser()
        prompt = ChatPromptTemplate.from_template("Analyze repo {url} with metrics {metrics}. {format_instructions}")
        ai_res = await (prompt | llm | parser).ainvoke({"url": str(request.url), "metrics": metrics, "format_instructions": parser.get_format_instructions()})
        return {**ai_res, "complexityScore": metrics["maintainabilityIndex"], "securityAlerts": [], "githubStats": github_stats, "fileTree": {"name": root.name, "type": "directory"}, "rawStats": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
# --- Update ONLY the parse_resume endpoint in your main.py ---
# --- Update ONLY the parse_resume endpoint in your main.py ---
@router.post("/upload-resume")
async def parse_resume(email: Optional[str] = Form(None), file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file")
    
    try:
        # Reset pointer and extract text
        file.file.seek(0)
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        
        # Initializing AI with retry logic
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.1, max_retries=3)
        parser = JsonOutputParser()
        
        # UPDATED PROMPT: Unified Senior Data Architect & ATS Auditor Logic
        prompt = ChatPromptTemplate.from_template(
            "Role: You are a Unified Senior Data Architect and Elite ATS Auditor. Your task is to perform an exhaustive analysis of this resume.\n\n"
            "Resume Text: {text}\n\n"
            "Extraction & Analysis Rules:\n"
            "1. Senior Data Architect (Skills): Parse 'Hard Skills' into a structured matrix. Normalize tech (e.g. NextJS -> Next.js). Assign signal_score (1-100) and years_used based on project proof (e.g. Phrelis, AetherLink). Categories: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Mobile', 'Databases', 'Cloud'].\n"
            "2. Senior Data Architect (Projects): Extract top 3 projects with stack and a one_line_impact.\n"
            "3. ATS Auditor: Calculate an 'atsScore' (0-100), identify 'devType' (e.g. Full-Stack Engineer), provide 'criticalFlaws' (brutally honest feedback), and 'actionableFixes' (how to improve the resume).\n\n"
            "Required JSON Schema:\n"
            "{{\n"
            "  \"student_name\": \"string\",\n"
            "  \"college\": \"string\",\n"
            "  \"major\": \"string\",\n"
            "  \"atsScore\": integer,\n"
            "  \"devType\": \"string\",\n"
            "  \"skills_matrix\": [\n"
            "    {{\n"
            "      \"skill\": \"string\",\n"
            "      \"category\": \"string\",\n"
            "      \"signal_score\": integer,\n"
            "      \"years_used\": float\n"
            "    }}\n"
            "  ],\n"
            "  \"top_3_projects\": [\n"
            "    {{\n"
            "      \"name\": \"string\",\n"
            "      \"stack\": [\"string\"],\n"
            "      \"one_line_impact\": \"string\"\n"
            "    }}\n"
            "  ],\n"
            "  \"criticalFlaws\": [\"string\"],\n"
            "  \"actionableFixes\": [\"string\"],\n"
            "  \"certifications\": [\"string\"],\n"
            "  \"majorMilestones\": [\"string\"]\n"
            "}}\n"
            "Return ONLY the JSON object. No prose.\n"
        )
        
        chain = prompt | llm | parser
        result = await chain.ainvoke({
            "text": text[:12000]
        })

        # NORMALIZE: Ensure atsScore is present and consistent
        # AI often flips between camelCase and snake_case or slightly different labels
        raw_score = result.get("atsScore") or result.get("ats_score") or result.get("ATS Score") or 0
        result["atsScore"] = int(raw_score)
        
        # Persist to DB
        if email:
            db_user = db.query(DBUser).filter(DBUser.email == email).first()
            if db_user:
                db_user.resume_data = result
                db.add(db_user)
            
            # Save skills_matrix into StudentSkills table
            # First, clear existing skills for this email to avoid duplicates
            db.query(StudentSkill).filter(StudentSkill.user_email == email).delete()
            
            skills_matrix = result.get("skills_matrix", [])
            for skill_entry in skills_matrix:
                new_skill = StudentSkill(
                    user_email=email,
                    skill=skill_entry.get("skill"),
                    category=skill_entry.get("category"),
                    signal_score=skill_entry.get("signal_score"),
                    years_used=skill_entry.get("years_used")
                )
                db.add(new_skill)
            
            db.commit()
            if db_user:
                db.refresh(db_user)
            
        return result

    except Exception as e:
        logger.error(f"ATS Audit Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Neural Audit Failure")
    

@router.post("/verify-certificate")
async def verify_certificate(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.0)
        prompt = ChatPromptTemplate.from_template("Extract cert info: {text}")
        return await (prompt | llm | JsonOutputParser()).ainvoke({"text": text[:5000]})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_me(email: str, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "resume": db_user.resume_data or {},
        "linkedin": db_user.linkedin_data or {},
        "github": db_user.github_data or {},
        "legacy": db_user.profile_data or {}
    }

@router.get("/search-skills")
async def search_skills(skill: str, db: Session = Depends(get_db)):
    """Search for students with multiple hard skills (comma-separated), ranked by proficiency."""
    skill_list = [s.strip() for s in skill.split(',') if s.strip()]
    if not skill_list:
        return []

    # Build filters for each skill
    filters = [StudentSkill.skill.ilike(f"%{s}%") for s in skill_list]
    
    # We join StudentSkill with DBUser. We want unique users.
    # We'll group by user email to ensure one result per student, then order by highest score found.
    results = db.query(StudentSkill, DBUser).\
        join(DBUser, DBUser.email == StudentSkill.user_email).\
        filter(or_(*filters)).\
        order_by(StudentSkill.signal_score.desc()).all()
    
    output = []
    seen_emails = set()
    for skill_entry, user_entry in results:
        if user_entry.email in seen_emails:
            continue
        seen_emails.add(user_entry.email)
        
        # CALCULATE UNIFIED NEURAL SCORE (Matching dashboard logic)
        resume = user_entry.resume_data or {}
        linkedin = user_entry.linkedin_data or {}
        github = user_entry.github_data or {}
        
        r_score = int(resume.get("atsScore") or 50)
        l_score = int(linkedin.get("credibility_score") or 50)
        g_stars = int(github.get("totalStars") or 0)
        p_count = len(github.get("topProjects") or [])
        g_impact = min((g_stars * 15) + (p_count * 5), 100)
        
        neural_score = round((r_score * 0.35) + (l_score * 0.25) + (g_impact * 0.4))

        # Include student info from DBUser
        output.append({
            "student_name": user_entry.username,
            "student_email": user_entry.email,
            "skill": skill_entry.skill, # Representative skill that matched first
            "category": skill_entry.category,
            "signal_score": skill_entry.signal_score,
            "years_used": skill_entry.years_used,
            "neural_score": neural_score,
            "student_profile": resume
        })
    
    return output

# --- Middleware & Mounting ---
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)