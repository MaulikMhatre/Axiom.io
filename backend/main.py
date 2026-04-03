import os
import shutil
import tempfile
import statistics
import re
import asyncio
import logging
from pathlib import Path
from typing import List, Dict, Any

import httpx  # UPGRADE: Replaced 'requests' with async 'httpx'
import PyPDF2
import git
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Mathematical Analysis
from radon.complexity import cc_visit
from radon.metrics import mi_visit
from radon.raw import analyze as raw_analyze

# AI Analysis
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel as LCBaseModel, Field

# --- Initialize Environment & Logging ---
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if not os.getenv("GOOGLE_API_KEY"):
    logger.warning("🚨 GOOGLE_API_KEY is missing from environment variables! AI features will fail.")
if not os.getenv("GITHUB_TOKEN"):
    logger.warning("⚠️ GITHUB_TOKEN is missing. You will be subject to strict GitHub API rate limits (60 req/hr).")

# --- App Initialization ---
app = FastAPI(
    title="RepoLens Backend",
    description="AI-Powered Developer Identity & Portfolio Verification API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "gemini-2.5-flash" 

# --- Schemas ---
class RepoRequest(BaseModel):
    url: str
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

class LLMOutput(LCBaseModel):
    projectSummary: str = Field(description="Summary of the repo")
    techStack: List[str] = Field(description="Detected tech stack")
    aiGeneratedPercentage: int = Field(description="Probability (0-100) that code is AI-written")
    noveltyScore: int = Field(description="How unique the architecture is (0-100)")
    topStrengths: List[str] = Field(description="Top 3 strengths")
    topImprovements: List[str] = Field(description="Top 3 improvements")
    possibleImpacts: List[str] = Field(description="Top 3 potential real-world impacts") 

# Constants
IGNORE_DIRS = {".git", "node_modules", "venv", "__pycache__", "dist", "build", ".next", ".vercel"}
IGNORE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".pyc", ".mp4", ".pdf", ".lock", ".json"}

# --- Helpers for Authenticated GitHub API Calls ---
def get_github_headers() -> dict:
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

# ==========================================
# ENDPOINTS: USER IDENTITY & FILES
# ==========================================

@app.get("/api/github/{username}")
async def fetch_real_github(username: str):
    """Fetches live data and top projects using Async HTTP."""
    headers = get_github_headers()
    
    try:
        # UPGRADE: Using httpx for non-blocking concurrent requests
        async with httpx.AsyncClient() as client:
            user_task = client.get(f"https://api.github.com/users/{username}", headers=headers)
            repos_task = client.get(f"https://api.github.com/users/{username}/repos?per_page=100&sort=stars", headers=headers)
            
            user_resp, repos_resp = await asyncio.gather(user_task, repos_task)
            
            if user_resp.status_code == 403 or repos_resp.status_code == 403:
                raise HTTPException(status_code=403, detail="GitHub API Rate Limit Exceeded. Add a GITHUB_TOKEN to .env.")
            
            user_data = user_resp.json()
            repos_data = repos_resp.json()
        
        total_stars = sum(repo.get('stargazers_count', 0) for repo in repos_data if isinstance(repo, dict))
        languages = {}
        top_projects = []
        
        for repo in repos_data:
            if not isinstance(repo, dict): continue
            
            if repo.get('language'):
                lang = repo['language']
                languages[lang] = languages.get(lang, 0) + 1
            
            if len(top_projects) < 3:
                top_projects.append({
                    "name": repo.get("name"),
                    "description": repo.get("description") or "No description provided.",
                    "stars": repo.get("stargazers_count", 0),
                    "language": repo.get("language", "Mixed"),
                    "url": repo.get("html_url")
                })
                
        return {
            "name": user_data.get("name", username),
            "avatarUrl": user_data.get("avatar_url", ""),
            "bio": user_data.get("bio", "Software Engineer"),
            "publicRepos": user_data.get("public_repos", 0),
            "totalStars": total_stars,
            "topLanguages": sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5],
            "topProjects": top_projects
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GitHub Fetch Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to fetch GitHub data")

@app.post("/api/verify-certificate")
def verify_certificate(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file")

    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.0)
        prompt = ChatPromptTemplate.from_template(
            "Extract the following from this certificate text: {text}\n"
            "Return JSON: {{'issuing_org': '', 'certificate_name': '', 'credential_id': '', 'issue_date': ''}}"
        )
        chain = prompt | llm | JsonOutputParser()
        return chain.invoke({"text": text[:5000]})
    except Exception as e:
        logger.error(f"Certificate Parsing Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse certificate")

@app.post("/api/upload-resume")
def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file")
    
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = "".join([p.extract_text() for p in pdf_reader.pages])
        
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.0)
        prompt = ChatPromptTemplate.from_template(
            "Analyze this resume text: {text}\n"
            "Return ONLY a valid JSON object with exact keys:\n"
            "1. 'extractedSkills': Array of arrays (e.g., [['Python', 9], ['React', 8]])\n"
            "2. 'achievements': Array of strings.\n"
            "3. 'certifications': Array of strings.\n"
            "4. 'workExperience': Array of objects (keys: 'role', 'company', 'duration', 'description').\n"
        )
        
        chain = prompt | llm | JsonOutputParser()
        return chain.invoke({"text": text[:10000]})
    except Exception as e:
        logger.error(f"Resume Parsing Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse resume")

# ==========================================
# HELPER FUNCTIONS: REPO ANALYSIS
# ==========================================

def scan_for_secrets(dir_path: Path) -> List[str]:
    alerts = []
    secret_patterns = [
        (r"['\"]sk-proj-[a-zA-Z0-9-_]{20,}['\"]", "Exposed OpenAI API Key"),
        (r"AKIA[0-9A-Z]{16}", "Exposed AWS Access Key"),
        (r"['\"]ghp_[a-zA-Z0-9]{36}['\"]", "Exposed GitHub Token"),
        (r"(?i)password\s*=\s*['\"][^'\"]+['\"]", "Hardcoded Password")
    ]
    for p in dir_path.rglob('*'):
        if p.is_file() and not any(d in p.parts for d in IGNORE_DIRS) and p.suffix not in IGNORE_EXTS:
            try:
                content = p.read_text(encoding='utf-8', errors='ignore')
                for pattern, name in secret_patterns:
                    if re.search(pattern, content):
                        alerts.append(f"CRITICAL: {name} found in {p.name}")
            except Exception:
                continue
    return list(set(alerts))[:5]

async def fetch_github_stats_async(url: str) -> dict:
    """Async fetch for repo stats."""
    headers = get_github_headers()
    try:
        parts = url.rstrip('/').split('/')
        repo_path = f"{parts[-2]}/{parts[-1]}"
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://api.github.com/repos/{repo_path}", headers=headers, timeout=5.0)
            
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "stars": data.get("stargazers_count", 0),
                    "forks": data.get("forks_count", 0),
                    "open_issues": data.get("open_issues_count", 0),
                    "last_updated": data.get("updated_at", "Unknown")[:10]
                }
    except Exception as e:
        logger.warning(f"Failed to fetch GitHub stats for {url}: {e}")
    return {"stars": 0, "forks": 0, "open_issues": 0, "last_updated": "Unknown"}

def get_enhanced_metrics(dir_path: Path) -> Dict[str, Any]:
    all_mi, complexity_scores = [], []
    total_loc, total_comments = 0, 0
    py_files = list(dir_path.glob("**/*.py"))
    
    for py_file in py_files:
        if any(ignored in str(py_file) for ignored in IGNORE_DIRS): continue
        try:
            code = py_file.read_text(encoding="utf-8", errors="ignore")
            all_mi.append(mi_visit(code, multi=True))
            raw = raw_analyze(code)
            total_loc += raw.loc
            total_comments += raw.comments
            cc = cc_visit(code)
            for block in cc: complexity_scores.append(block.complexity)
        except Exception:
            continue
    
    all_files = [p for p in dir_path.rglob('*') if p.is_file() and not any(d in p.parts for d in IGNORE_DIRS)]
    avg_mi = statistics.mean(all_mi) if all_mi else 75 
    avg_cc = statistics.mean(complexity_scores) if complexity_scores else 1
    
    return {
        "maintainabilityIndex": int(avg_mi),
        "avgComplexity": round(avg_cc, 2),
        "totalLines": total_loc or (len(all_files) * 50),
        "commentRatio": f"{round((total_comments / total_loc * 100), 1)}%" if total_loc > 0 else "N/A",
        "fileCount": len(all_files)
    }

def get_file_tree(dir_path: Path, current_depth: int = 0, max_depth: int = 5) -> Dict[str, Any]:
    if current_depth > max_depth: return {"name": "...", "type": "directory"}
    tree = {"name": dir_path.name, "type": "directory", "children": []}
    try:
        paths = sorted(dir_path.iterdir(), key=lambda p: (p.is_file(), p.name))
        for p in paths:
            if p.is_dir() and p.name not in IGNORE_DIRS:
                tree["children"].append(get_file_tree(p, current_depth + 1))
            elif p.is_file() and p.suffix.lower() not in IGNORE_EXTS:
                tree["children"].append({"name": p.name, "type": "file"})
    except Exception:
        pass
    return tree

def extract_context(dir_path: Path) -> str:
    context = ""
    priority = ["README.md", "package.json", "requirements.txt", "main.py", "app.py", "index.tsx"]
    for file in priority:
        for p in dir_path.rglob(file):
            try:
                context += f"\nFILE: {p.name}\n{p.read_text(encoding='utf-8', errors='ignore')[:1500]}\n"
                break 
            except Exception:
                continue
    return context or "No readable code configuration files found."

# ==========================================
# ENDPOINTS: REPO ANALYSIS
# ==========================================

@app.post("/api/analyze", response_model=RepoResponse)
async def analyze_repo(request: RepoRequest):
    if not request.url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Only standard GitHub URLs are supported.")

    temp_dir = tempfile.mkdtemp()
    try:
        logger.info(f"Cloning repository: {request.url}")
        
        # UPGRADE: Anti-Crash Clone Timeout (20 seconds max)
        try:
            await asyncio.wait_for(
                asyncio.to_thread(git.Repo.clone_from, request.url, temp_dir, depth=1),
                timeout=20.0
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Repository is too large or took too long to clone.")
        except git.exc.GitCommandError:
            raise HTTPException(status_code=400, detail="Failed to clone repository. Is it private?")

        root_path = Path(temp_dir)
        
        metrics, tree, context_data, security_alerts, github_stats = await asyncio.gather(
            asyncio.to_thread(get_enhanced_metrics, root_path),
            asyncio.to_thread(get_file_tree, root_path),
            asyncio.to_thread(extract_context, root_path),
            asyncio.to_thread(scan_for_secrets, root_path),
            fetch_github_stats_async(request.url) # Calling our new async version
        )
        tree["name"] = request.url.split("/")[-1]
        
        llm = ChatGoogleGenerativeAI(model=MODEL_NAME, temperature=0.0)
        parser = JsonOutputParser(pydantic_object=LLMOutput)
        
        template = """Analyze this repository: {url}
Metrics: {metrics}
Code/Config Context: {code}
Mode: {mode}

{format_instructions}"""
        
        prompt = ChatPromptTemplate.from_template(template)
        chain = prompt | llm | parser

        logger.info(f"Invoking LLM for {request.url}")
        ai_res = await chain.ainvoke({
            "url": request.url,
            "metrics": str(metrics), 
            "code": context_data[:15000],
            "mode": request.mode,
            "format_instructions": parser.get_format_instructions()
        })

        return RepoResponse(
            projectSummary=ai_res.get("projectSummary", "N/A"),
            techStack=ai_res.get("techStack", []),
            complexityScore=metrics.get("maintainabilityIndex", 50),
            aiGeneratedPercentage=ai_res.get("aiGeneratedPercentage", 50),
            noveltyScore=ai_res.get("noveltyScore", 50),
            topStrengths=ai_res.get("topStrengths", []),
            topImprovements=ai_res.get("topImprovements", []),
            possibleImpacts=ai_res.get("possibleImpacts", []),
            securityAlerts=security_alerts,
            githubStats=github_stats,
            fileTree=tree,
            rawStats=metrics
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis.")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)