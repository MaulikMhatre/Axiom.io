"use client";
import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Terminal, Layers, ExternalLink, 
  Loader2, Zap, Trophy, Cpu, Target, Fingerprint
} from "lucide-react";
import { GitHubCalendar } from 'react-github-calendar';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar as RadarArea, ResponsiveContainer, Tooltip 
} from 'recharts';

export default function GitHubAudit() {
  const [repoData, setRepoData] = useState<any>(null);
  const [ghUsername, setGhUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedProfile = localStorage.getItem('user_profile');
    const storedUsername = localStorage.getItem('gh_username');
    
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      
      // SANITIZATION: Bridge the gap between Backend (snake_case) and Frontend (camelCase)
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-32 font-sans relative selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Dynamic Background FX */}
      <div className="fixed inset-0 overflow-hidden -z-10 text-zinc-900/10 font-mono text-[8px] opacity-20 pointer-events-none">
          {Array(50).fill(0).map((_, i) => (
            <div key={i} className="whitespace-nowrap">PHRONEX_CORE_DUMP_{Math.random().toString(16)}__INIT_VECTOR_{i}</div>
          ))}
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
          <div className="flex items-center gap-10 text-right">
             <Stat label="Impact Index" value={repoData?.totalStars || 0} />
             <Stat label="Verified Assets" value={repoData?.publicRepos || 0} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- 1. RADAR MATRIX --- */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-2">
              <Cpu size={14} className="text-indigo-500" /> Competency Matrix
            </h3>
            {/* GRAPH FIX: Mandatory height container */}
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

          {/* --- 2. AI VERDICT --- */}
          <div className="lg:col-span-2 bg-[#0c0c0e] border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[350px]">
              {/* Background data stream aesthetic */}
              <div className="absolute inset-0 font-mono text-[9px] text-zinc-900/40 leading-none p-2 break-all -z-10 group-hover:text-indigo-950/40 transition-colors">
                  PHRONEX_AUDIT_LOG::TIMESTAMP::{new Date().toISOString()}::VECTOR:: {audit.strategicVerdict}
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

                <p className="text-3xl font-bold leading-tight tracking-tight text-white/90">
                  {audit.strategicVerdict || "Strategic directive pending. Synthesizing repository vectors..."}
                </p>
                
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t border-zinc-800/50">
                    <div className="flex flex-wrap gap-2.5">
                      {audit.milestones?.map((m: string, i: number) => (
                        <div key={i} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-indigo-300 flex items-center gap-2.5 uppercase tracking-widest font-mono">
                          {i === 0 ? <Zap size={14} className="text-emerald-500" /> : <Trophy size={14} className="text-amber-500" />} {m}
                        </div>
                      ))}
                    </div>
                    <div className="text-right border-l border-zinc-800 pl-6 space-y-1">
                      <Fingerprint size={24} className="ml-auto text-zinc-800 hover:text-indigo-500 transition-colors cursor-pointer" />
                      <div className="text-[9px] font-mono text-zinc-600 uppercase">Audit_Key: PHX-{ghUsername.slice(0,3).toUpperCase()}</div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-tighter">Phronex AI Core</div>
                    </div>
                </div>
              </div>
          </div>
        </div>

        {/* --- 3. CONTRIBUTION MAP (GREEN FIX) --- */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 shadow-xl">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Temporal Activity Matrix</h3>
             <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-700 bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800 uppercase">
                GitHub Contribution Flux
             </div>
          </div>
          <div className="flex justify-center overflow-x-auto p-4 bg-black/30 rounded-3xl border border-white/5 shadow-inner">
            <GitHubCalendar 
              username={ghUsername}
              colorScheme="dark"
              theme={{ 
                dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] 
              }}
            />
          </div>
        </div>

        {/* --- 4. PROJECT LIST --- */}
        <div className="space-y-4 pb-20">
          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-6 flex items-center gap-3">
             <Layers size={14} /> Individual Proof of Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repoData?.topProjects?.map((repo: any, i: number) => (
              <div key={i} className="p-8 bg-[#0c0c0e] border border-white/5 rounded-[2rem] hover:border-indigo-500/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h4 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      {repo.name} <Target size={14} className="text-zinc-800" />
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1 italic">
                      Hardwork_Vector: {repo.personal_commits || 0} Commits
                    </p>
                  </div>
                  <div className="text-amber-500 font-bold text-xs flex items-center gap-2 bg-black/50 px-4 py-2 rounded-xl">
                    <Trophy size={14} /> {repo.stars}
                  </div>
                </div>
                
                <p className="text-sm text-zinc-500 line-clamp-2 italic mb-8 leading-relaxed font-light">
                  "{repo.description}"
                </p>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5 relative z-10">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-md uppercase tracking-wider">
                    {repo.language}
                  </span>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors bg-white/5 p-3 rounded-full">
                    <ExternalLink size={18} />
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
      <div className="text-4xl font-black mt-1 text-white tracking-tighter tabular-nums">{value}</div>
      <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">{label}</div>
    </div>
  );
}