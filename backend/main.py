
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
from sqlalchemy import create_engine, Column, Integer, String, JSON
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

MODEL_NAME = "gemini-2.5-flash-lite" 

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
    leetcode_data = Column(JSON, default={})

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
            # We check the 'contributors' for each repo concurrently to find YOUR specific work
            for repo in all_repos[:20]:
                total_stars += repo.get("stargazers_count", 0)

            async def fetch_contributors(repo):
                repo_name = repo.get("name")
                owner = repo.get("owner", {}).get("login")
                try:
                    stats_resp = await client.get(
                        f"https://api.github.com/repos/{owner}/{repo_name}/contributors", 
                        headers=headers
                    )
                except Exception:
                    return None
                    
                user_commits = 0
                if stats_resp and stats_resp.status_code == 200:
                    contributors = stats_resp.json()
                    for contributor in contributors:
                        if contributor.get("login", "").lower() == username.lower():
                            user_commits = contributor.get("contributions", 0)
                            break
                            
                work_score = (user_commits * 15) + (repo.get("stargazers_count", 0) * 5)
                
                if user_commits > 0: # Only include if you actually wrote code
                    return {
                        "name": repo_name,
                        "description": repo.get("description") or "No description.",
                        "personal_commits": user_commits,
                        "stars": repo.get("stargazers_count", 0),
                        "language": repo.get("language") or "Mixed",
                        "url": repo.get("html_url"),
                        "work_score": work_score
                    }
                return None

            tasks = [fetch_contributors(repo) for repo in all_repos[:20]]
            results = await asyncio.gather(*tasks)
            
            for res in results:
                if res is not None:
                    repo_audit_list.append(res)

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

class ForensicAuditRequest(BaseModel):
    url: HttpUrl

class ForensicAuditResponse(BaseModel):
    cleanCodeIndex: int
    maintainabilityScore: int
    securityLevel: str
    authenticityPercent: float
    aiVerdict: str
    detailedMetrics: Dict[str, Any]

@router.post("/forensic-audit", response_model=ForensicAuditResponse)
async def forensic_audit(request: ForensicAuditRequest):
    temp_dir = tempfile.mkdtemp()
    try:
        # 1. HARDENED CLONE
        repo_url = str(request.url).rstrip('/')
        try:
            # Using depth=50 to get enough history for Authenticity check
            await asyncio.to_thread(git.Repo.clone_from, repo_url, temp_dir, depth=50)
        except Exception as ge:
            logger.error(f"Git clone failed: {ge}")
            raise HTTPException(status_code=500, detail="Target repository unreachable or private.")
            
        root = Path(temp_dir)

        # 2. STATIC METRICS (RADON)
        metrics = AnalysisService.get_code_metrics(root)

        # 3. STRICT SECURITY AUDIT (Severity Based)
        security_score = 100
        critical_patterns = [r"BEGIN RSA PRIVATE KEY", r"-----BEGIN", r"id_rsa"] 
        warning_patterns = [r"(?i)api_key", r"(?i)secret", r"(?i)token", r"(?i)password"]

        for p in root.rglob("*"):
            if p.is_file() and p.suffix not in IGNORE_EXTS:
                try:
                    content = p.read_text(encoding="utf-8", errors="ignore")
                    # Deduct 25 for keys, 10 for potential secrets
                    for cp in critical_patterns:
                        if re.search(cp, content): security_score -= 25
                    for wp in warning_patterns:
                        if re.search(wp, content): security_score -= 10
                except: continue
        
        security_score = max(0, security_score)
        security_level = "SAFE" if security_score > 85 else "WARNING" if security_score > 60 else "CRITICAL"

        # 4. AUTHENTICITY AUDIT (Commit Ownership)
        # We verify if the majority of the code belongs to one 'Master' dev or is a mix of boilerplate
        authenticity_percent = 0.0
        try:
            repo = git.Repo(temp_dir)
            commits = list(repo.iter_commits())
            if commits:
                authors = {}
                for c in commits:
                    authors[c.author.email] = authors.get(c.author.email, 0) + 1
                
                # Logic: If top author is < 30%, it's likely a scraped or massive collaborative boilerplate
                top_author_count = max(authors.values())
                authenticity_percent = round((top_author_count / len(commits)) * 100, 1)
        except: authenticity_percent = 50.0

        # 5. THE "AXIOM RULEBOOK" AI PROMPT
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.1) # Lower temp for strictness
        parser = JsonOutputParser()
        
        # Read the largest logic files for code quality verification
        code_files = [p for p in root.rglob("*") if p.is_file() and p.suffix in {'.py', '.js', '.ts', '.tsx', '.c', '.cpp'}]
        top_files = sorted(code_files, key=lambda x: x.stat().st_size, reverse=True)[:3]
        sample_code = ""
        for f in top_files:
            sample_code += f"\n--- FILE: {f.name} ---\n{f.read_text(errors='ignore')[:2000]}"

        prompt = ChatPromptTemplate.from_template("""
        SYSTEM ROLE:
        You are the Axiom Forensic Engine (Tier-1 Auditor). Your job is to verify the INTEGRITY of this repository. 
        You must be ELITE and BRUTALLY STRICT. Do not award high scores to mediocre code.

        INPUT DATA:
        - Repo URL: {url}
        - Radon Metrics: {metrics}
        - Security Level: {security_level} (Calculated Score: {sec_score})
        - Git Authenticity: {authenticity}%
        - Code Sample: {sample_code}

        --- SCORING RULES (MANDATORY) ---
        1. CLEAN CODE (0-100): 
           - Start at 100. Deduct 10 for every 'Any' type (TS) or lack of type hints (Py).
           - Deduct 20 if variable names are non-descriptive (e.g., 'a', 'temp', 'data1').
           - Deduct 15 if functions exceed 50 lines.

        2. MAINTAINABILITY (0-100):
           - Must align with Radon MI Index. If MI < 20, score cannot exceed 30.
           - High CC (Cyclomatic Complexity) > 10 in any function results in a max score of 50.

        3. SECURITY PERIMETER (SAFE|WARNING|CRITICAL):
           - If sec_score < 90, result MUST be WARNING.
           - If any private key pattern was found, result MUST be CRITICAL.

        4. AUTHENTICITY (0-100):
           - Use the Git Authenticity ({authenticity}%) as base.
           - Deduct 30 if the code looks like standard tutorial boilerplate (e.g., ToDo apps, basic Auth templates).

        JSON RESPONSE SCHEMA:
        {{
            "cleanCodeIndex": number,
            "maintainabilityScore": number,
            "securityLevel": "SAFE" | "WARNING" | "CRITICAL",
            "authenticityPercent": number,
            "aiVerdict": "A 3-sentence technical assault/critique of the code quality.",
            "detailedMetrics": {{
                "totalLoc": "{loc}",
                "complexity": {cc},
                "duplicateCode": number (0-100),
                "dependencyHealth": number (0-100)
            }}
        }}
        {format_instructions}
        """)

        ai_res = await (prompt | llm | parser).ainvoke({
            "url": repo_url,
            "metrics": metrics,
            "security_level": security_level,
            "sec_score": security_score,
            "authenticity": authenticity_percent,
            "sample_code": sample_code,
            "loc": metrics['totalLines'],
            "cc": metrics['avgComplexity'],
            "format_instructions": parser.get_format_instructions()
        })

        return ai_res
        
    except Exception as e:
        logger.error(f"Forensic Audit Failure: {e}")
        raise HTTPException(status_code=500, detail="Neural analysis failed to establish integrity.")
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
        
        # UPDATED PROMPT: Matching the v4.5 Frontend exactly
        prompt = ChatPromptTemplate.from_template(
            "System: You are an ELITE ATS Auditor for a Tier-1 Tech Giant (Google/Meta).\n"
            "Analyze this resume: {text}\n\n"
            "STRICT JSON SCHEMA REQUIREMENTS:\n"
            "1. 'name': Full name from the header.\n"
            "2. 'atsScore': Integer (0-100).\n"
            "3. 'devType': A professional title (e.g. 'Full-Stack Engineer').\n"
            "4. 'cgpa': The extracted CGPA or GPA (string or float value).\n"
            "5. 'education': An ARRAY of objects: [{{'institution': '...', 'degree': '...', 'year': '...'}}]\n"
            "6. 'skills': An ARRAY of objects: [{{'name': 'Python', 'level': 95}}]. Only include top-tier skills.\n"
            "7. 'skillDensity': An OBJECT for Radar Chart: {{'Backend': 90, 'Frontend': 70, 'DevOps': 50, 'Data': 40, 'Cloud': 60}}.\n"
            "8. 'projectImpacts': An ARRAY of objects: [{{'name': 'Project X', 'score': 92, 'description': '...'}}].\n"
            "9. 'certifications': An ARRAY of strings (Formal professional certifications).\n"
            "10. 'majorMilestones': An ARRAY of strings (Key career or project achievements).\n"
            "11. 'criticalFlaws': An ARRAY of strings (Brutally honest critiques).\n"
            "12. 'actionableFixes': An ARRAY of strings (Directives to improve the resume).\n\n"
            "Return ONLY the JSON object. Do not include prose.\n"
            "{format_instructions}"
        )
        
        chain = prompt | llm | parser
        result = await chain.ainvoke({
            "text": text[:12000], 
            "format_instructions": parser.get_format_instructions()
        })
        
        # Persist to DB
        if email:
            db_user = db.query(DBUser).filter(DBUser.email == email).first()
            if db_user:
                db_user.resume_data = result
                db.add(db_user)
                db.commit()
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
        "leetcode": db_user.leetcode_data or {},
        "legacy": db_user.profile_data or {}
    }

@router.get("/leetcode/{username}")
async def fetch_leetcode_profile(username: str, email: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetches LeetCode stats using the official GraphQL API and performs an AI-driven 'Neural Audit'."""
    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            # 1. Official LeetCode GraphQL Query
            gql_url = "https://leetcode.com/graphql/"
            query = """
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
                profile {
                  ranking
                  reputation
                }
                submitStatsGlobal {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                  totalSubmissionNum {
                    difficulty
                    count
                  }
                }
              }
            }
            """
            
            payload = {
                "query": query,
                "variables": {"username": username}
            }
            
            headers = {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
            }

            resp = await client.post(gql_url, json=payload, headers=headers)
            
            if resp.status_code != 200:
                logger.error(f"LeetCode GQL Error: {resp.text}")
                raise HTTPException(status_code=resp.status_code, detail="LeetCode Profile sync failed.")
            
            data = resp.json()
            if not data.get("data") or not data["data"].get("matchedUser"):
                raise HTTPException(status_code=404, detail=f"LeetCode User '{username}' not found.")

            user_data = data["data"]["matchedUser"]
            stats = user_data["submitStatsGlobal"]
            
            # Helper to extract counts
            def get_count(stat_list, diff):
                for item in stat_list:
                    if item["difficulty"] == diff:
                        return item["count"]
                return 0

            easy = get_count(stats["acSubmissionNum"], "Easy")
            medium = get_count(stats["acSubmissionNum"], "Medium")
            hard = get_count(stats["acSubmissionNum"], "Hard")
            total = get_count(stats["acSubmissionNum"], "All")
            
            total_submissions = get_count(stats["totalSubmissionNum"], "All")
            acceptance = round((total / total_submissions * 100), 2) if total_submissions > 0 else 0
            ranking = user_data["profile"].get("ranking", 0)

            # 2. AI AUDIT
            llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.1)
            parser = JsonOutputParser()
            
            audit_prompt = ChatPromptTemplate.from_template(
                "System: You are an ELITE Competitive Programming Coach. Analyze the following LeetCode sync for {login}.\n"
                "Stats: {stats}\n\n"
                "Generate a JSON object with keys:\n"
                "1. 'algorithmic_iq': 0-100 (matching our calculation or refining it)\n"
                "2. 'strategic_verdict': A razor-sharp 2-sentence analysis of their algorithmic prowess.\n"
                "3. 'vectors': {{'Data Structures': 0-100, 'Complexity': 0-100, 'Grit': 0-100}}\n"
                "4. 'roadmap': [{{'title': 'string', 'description': 'string'}}]\n"
                "5. 'easy_count': {easy}, 'medium_count': {medium}, 'hard_count': {hard}\n"
                "{format_instructions}"
            )

            ai_audit = await (audit_prompt | llm | parser).ainvoke({
                "login": username,
                "stats": {
                    "totalSolved": total,
                    "ranking": ranking,
                    "acceptance": acceptance,
                    "reputation": user_data["profile"].get("reputation")
                },
                "easy": easy,
                "medium": medium,
                "hard": hard,
                "format_instructions": parser.get_format_instructions()
            })

            result = {
                "username": username,
                "ranking": ranking,
                "acceptance": acceptance,
                "totalSolved": total,
                "aiAudit": ai_audit 
            }
            
            # Persist to DB if email provided
            if email:
                db_user = db.query(DBUser).filter(DBUser.email == email).first()
                if db_user:
                    db_user.leetcode_data = result
                    db.add(db_user)
                    db.commit()
                    db.refresh(db_user)
            
            return result
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"LeetCode Audit Error: {e}")
            raise HTTPException(status_code=500, detail="Neural link to LeetCode severed.")


# --- Middleware & Mounting ---
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)