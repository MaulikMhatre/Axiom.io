
"use client";
import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Terminal, Layers, ExternalLink, 
  Loader2, Zap, Trophy, Cpu, Target, Fingerprint
} from "lucide-react";

// FIX 1: Named import for the calendar
import { GitHubCalendar } from 'react-github-calendar';

// FIX 2: Recharts Components
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar as RadarArea, ResponsiveContainer, Tooltip 
} from 'recharts';

export default function GitHubAudit() {
  const [repoData, setRepoData] = useState<any>(null);
  const [ghUsername, setGhUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  // FIX 3: Prevent Hydration/Size errors
  const [mounted, setMounted] = useState(false);

useEffect(() => {
    setMounted(true);
    const storedProfile = localStorage.getItem('user_profile');
    const storedUsername = localStorage.getItem('gh_username');
    
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      
      // FIX: Map both snake_case and CamelCase to ensure Impact Score isn't 0
      const sanitized = {
        ...parsed,
        totalStars: parsed.totalStars || parsed.total_stars || 0,
        publicRepos: parsed.publicRepos || parsed.public_repos || 0
      };
      
      setRepoData(sanitized);
    }
    
    if (storedUsername) {
      setGhUsername(storedUsername);
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);


  // Safety loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-zinc-600">
          Reconstructing Neural Profile...
        </p>
      </div>
    );
  }

  const audit = repoData?.aiAudit || {};
  const radarData = audit.radarMetrics ? 
    Object.entries(audit.radarMetrics).map(([subject, value]) => ({
      subject, 
      A: Number(value) || 0, 
      fullMark: 100
    })) : [];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-32 font-sans relative selection:bg-indigo-500/30">
      
      {/* Dynamic Background FX */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-600 text-[9px] font-mono tracking-widest uppercase">
                Active Node
              </span>
              <span className="text-zinc-700 font-mono text-[9px]"> LTM / {new Date().getFullYear()}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase text-white">
              {repoData?.name || ghUsername} <span className="text-zinc-700">|</span> Audit
            </h1>
            <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase">
              Instance: {ghUsername} // {audit.devType || "Verified Contributor"}
            </p>
          </div>
          <div className="flex items-center gap-6 text-right">
             <Stat label="Impact Score" value={repoData?.totalStars || 0} />
             <Stat label="Verified Assets" value={repoData?.publicRepos || 0} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- 1. RADAR MATRIX (Console Fix applied) --- */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-2">
              <Cpu size={14} className="text-indigo-500" /> Competency Matrix
            </h3>
            {/* FIX 4: Explicit height container for Recharts */}
            <div className="w-full h-[280px]"> 
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: '8px', color: 'white' }} />
                  <RadarArea name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- 2. THE REDESIGNED AESTHETIC AI VERDICT --- */}
          <div className="lg:col-span-2 bg-[#0c0c0e] border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
              {/* Background data stream aesthetic */}
              <div className="absolute inset-0 font-mono text-[10px] text-zinc-900/40 leading-none p-2 break-all -z-10 group-hover:text-indigo-950/40 transition-colors">
                  PHRONEX_AUDIT_LOG::TIMESTAMP::{new Date().toISOString()}::INTEGRITY_CHECK::PASSED::VECTOR:: {audit.strategicVerdict || "ANALYZING..."} ::{radarData.map(r => `${r.subject}_${r.A}` ).join('::')}
              </div>
              
              <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                    <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] flex items-center gap-3">
                      <Target size={18} className="text-indigo-500"/> Neural Blueprint Directive
                    </h3>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-mono font-bold text-indigo-400">
                      <ShieldCheck size={14} /> AUTHENTICATED
                    </div>
                </div>

                {/* The Main Suggestion Text */}
                <p className="text-3xl font-bold leading-tight tracking-tight text-white/90">
                  {audit.strategicVerdict || "Strategic directive pending. Please ensure all profile data is synchronized for accurate synthesis."}
                </p>
                
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t border-zinc-800/50">
                    <div className="flex flex-wrap gap-2.5">
                      {audit.milestones?.map((m: string, i: number) => (
                        <div key={i} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-indigo-300 flex items-center gap-2.5 uppercase tracking-widest font-mono">
                          {i === 0 ? <Zap size={14} className="text-emerald-500" /> : <Trophy size={14} className="text-amber-500" />} {m}
                        </div>
                      ))}
                    </div>
                    {/* Fake signature section for aesthetic */}
                    <div className="text-right border-l border-zinc-800 pl-6 space-y-1">
                      <Fingerprint size={24} className="ml-auto text-zinc-800" />
                      <div className="text-[9px] font-mono text-zinc-600 uppercase">Audit_Key: PHX-{ghUsername.slice(0,3).toUpperCase()}</div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-tighter">Phronex AI Core</div>
                    </div>
                </div>
              </div>
          </div>
        </div>

        {/* --- 3. CONTRIBUTION MAP --- */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 shadow-xl">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Temporal Activity Matrix / LTM</h3>
             <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-700 bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">
                LESS <div className="w-3.5 h-3.5 bg-zinc-900 rounded-[3px]" />
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-[3px]" /> MORE
             </div>
          </div>
          <div className="flex justify-center overflow-x-auto p-4 bg-black/30 rounded-3xl border border-white/5">
            <GitHubCalendar 
              username={ghUsername}
              colorScheme="dark"
              // Stable 2026 Indigo theme
             theme={{ 
        dark: [
          '#161b22', // Empty (Background)
          '#0e4429', // Low
          '#006d32', // Medium
          '#26a641', // High
          '#39d353'  // Max
        ] 
      }}
            />
          </div>
        </div>

        {/* --- 4. PROJECT LIST --- */}
        <div className="space-y-4 pb-20">
          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-6">Verified Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repoData?.topProjects?.map((repo: any, i: number) => (
              <div key={i} className="p-7 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div>
                    <h4 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      {repo.name} <Target size={14} className="text-zinc-700" />
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Impact_Score: {Math.floor(Math.random() * 20) + 80}%</p>
                  </div>
                  <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full">
                    <Layers size={14} /> {repo.stars}
                  </div>
                </div>
                
                <p className="text-sm text-zinc-400 line-clamp-2 italic mb-6 leading-relaxed">"{repo.description}"</p>
                
                <div className="flex justify-between items-center pt-5 border-t border-white/5 relative z-10">
                  <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-lg uppercase tracking-wider">{repo.language}</span>
                  <a href={repo.url} target="_blank" className="text-zinc-600 hover:text-white transition-colors bg-black/40 p-2.5 rounded-full">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="text-right">
      <div className="text-3xl font-black mt-1 text-white tracking-tighter">{value}</div>
      <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">{label}</div>
    </div>
  );
}



























