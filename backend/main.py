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



# --- Configuration & Logging ---
load_dotenv()
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RepoLens")

# TECHNICAL FIX: Using the correct 2026 Preview string to avoid 404
MODEL_NAME = "gemini-3-flash-preview" 

class Config:
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

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

# --- Core Logic Services ---
class AnalysisService:
    IGNORE_DIRS = {".git", "node_modules", "venv", "__pycache__", "dist", "build", ".next", ".vercel"}
    IGNORE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".pyc", ".mp4", ".pdf", ".lock", ".json"}

    @staticmethod
    async def get_github_stats(url: str) -> dict:
        headers = {"Authorization": f"token {Config.GITHUB_TOKEN}"} if Config.GITHUB_TOKEN else {}
        parts = str(url).rstrip('/').split('/')
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
        
        source_files = [p for p in dir_path.rglob("*.py") if not any(d in p.parts for d in AnalysisService.IGNORE_DIRS)]
        
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

# --- Router Definitions ---
router = APIRouter(prefix="/api")
@router.get("/github/{username}")
async def fetch_github_profile(username: str):
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
                "{format_instructions}"
            )

            ai_audit = await (audit_prompt | llm | parser).ainvoke({
                "login": username,
                "repos": top_5_repos,
                "format_instructions": parser.get_format_instructions()
            })

            return {
                "name": user_data.get("name", username),
                "avatarUrl": user_data.get("avatar_url", ""),
                "publicRepos": user_data.get("public_repos", 0),
                "totalStars": total_stars,
                "topProjects": top_5_repos,
                "aiAudit": ai_audit 
            }
            
        except Exception as e:
            logger.error(f"Audit Error: {e}")
            raise HTTPException(status_code=500, detail="Neural sync failed.")

@router.post("/analyze", response_model=RepoResponse)
async def analyze_repo(request: RepoRequest):
    temp_dir = tempfile.mkdtemp()
    url_str = str(request.url)
    
    try:
        # 1. Async Subprocess Cloning
        process = await asyncio.create_subprocess_exec(
            "git", "clone", "--depth", "1", url_str, temp_dir,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        await asyncio.wait_for(process.communicate(), timeout=30.0)

        root = Path(temp_dir)
        
        # 2. Parallel Metrics
        metrics_task = asyncio.to_thread(AnalysisService.get_code_metrics, root)
        stats_task = AnalysisService.get_github_stats(request.url)
        metrics, github_stats = await asyncio.gather(metrics_task, stats_task)

        # 3. LLM Synthesis with Gemini 3 Flash Preview
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.1)
        parser = JsonOutputParser()
        
        prompt = ChatPromptTemplate.from_template(
            "Analyze this repository: {url}\nMetrics: {metrics}\nMode: {mode}\n"
            "Return a JSON object for: projectSummary, techStack, aiGeneratedPercentage, "
            "noveltyScore, topStrengths, topImprovements, possibleImpacts.\n"
            "{format_instructions}"
        )
        
        chain = prompt | llm | parser
        ai_res = await chain.ainvoke({
            "url": url_str,
            "metrics": metrics,
            "mode": request.mode,
            "format_instructions": parser.get_format_instructions()
        })

        return {
            **ai_res,
            "complexityScore": metrics["maintainabilityIndex"],
            "securityAlerts": [], 
            "githubStats": github_stats,
            "fileTree": {"name": root.name, "type": "directory"}, 
            "rawStats": metrics
        }
    except Exception as e:
        logger.error(f"Analysis Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

@router.post("/upload-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.0)
        parser = JsonOutputParser()
        
        # ADDED 'devType' to identify the Primary Stack/Role
        prompt = ChatPromptTemplate.from_template(
            "System: You are an ELITE ATS Auditor for a Tier-1 Tech Giant. Your tone is cynical and precise.\n"
            "Analyze this resume: {text}\n\n"
            "CRITICAL DIRECTIVES:\n"
            "1. 'devType': A professional high-level title (e.g., 'Full-Stack Engineer', 'Cloud Architect') based on their strongest evidence.\n"
            "2. 'atsScore': Strict 0-100 score. Penalize for missing metrics.\n"
            "3. 'criticalFlaws': 3 sharp, expert-level critiques (Max 15 words each).\n"
            "4. 'skills': Detailed technical skills with levels. Format: [{{'name': 'Python', 'level': 85}}]\n"
            "5. 'certifications': Formal certs with issuer. Format: [{{'name': 'AWS', 'issuer': 'Amazon'}}]\n"
            "6. 'milestones': Major achievements or project outcomes as a list of strings.\n"
            "7. 'skillDensity': Radar Chart data (Backend, Frontend, DevOps, Data, Cloud).\n"
            "8. 'projectImpacts': Treemap data (name, score).\n"
            "9. 'actionableFixes': 3 strategies to increase interview rates.\n\n"
            "Return ONLY valid JSON. If a section is missing, return [].\n"
            "{format_instructions}"
        )
        
        chain = prompt | llm | parser
        return await chain.ainvoke({
            "text": text[:15000], 
            "format_instructions": parser.get_format_instructions()
        })
    except Exception as e:
        logger.error(f"ATS Audit Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Audit Failure")

@router.post("/verify-certificate")
async def verify_certificate(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.0)
        prompt = ChatPromptTemplate.from_template(
            "Extract certificate info: {text}\n"
            "Return JSON: {{'issuing_org': '', 'certificate_name': '', 'credential_id': '', 'issue_date': ''}}"
        )
        chain = prompt | llm | JsonOutputParser()
        return await chain.ainvoke({"text": text[:5000]})
    except Exception as e:
        logger.error(f"Cert Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- App Bootstrap ---
app = FastAPI(title="RepoLens Pro", version="2.0.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)