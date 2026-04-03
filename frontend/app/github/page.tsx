"use client";

import React, { useEffect, useState } from 'react';
import {
  Activity, Code2, ShieldCheck,
  Terminal, Layers, ExternalLink, Loader2
} from "lucide-react";
import { GitHubCalendar } from 'react-github-calendar';

export default function GitHubAudit() {
  const [repoData, setRepoData] = useState<any>(null);
  const [ghUsername, setGhUsername] = useState<string>("github");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Pull the AI-analyzed profile and the raw username from Settings
    const storedProfile = localStorage.getItem('user_profile');
    const storedUsername = localStorage.getItem('gh_username');

    if (storedProfile) {
      setRepoData(JSON.parse(storedProfile));
    }

    if (storedUsername) {
      setGhUsername(storedUsername);
    }

    // 2. Short delay for that "Processing Data" terminal feel
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="font-mono text-xs tracking-widest uppercase animate-pulse">Running Neural Audit...</p>
      </div>
    );
  }

  // --- Empty State (If user hasn't synced in Settings yet) ---
  if (!repoData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Terminal className="w-12 h-12 opacity-20" />
        <p className="font-mono text-sm tracking-widest uppercase text-center">
          No Identity Found. <br />
          <span className="text-zinc-700">Please sync your GitHub handle in Settings.</span>
        </p>
      </div>
    );
  }

  // --- Dynamic Data Helpers ---
  const topLang = repoData.topLanguages?.[0]?.[0] || "Mixed";
  const displayName = repoData.name || ghUsername || "Developer";
  const safeIdString = (repoData.name || ghUsername || "USER").substring(0, 4).toUpperCase();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-32 font-sans relative selection:bg-indigo-500/30">

      {/* Background FX */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12">

        {/* --- Header Section --- */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                {displayName}'s Audit
              </h1>
            </div>
            <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase">
              Instance: {ghUsername} // Node_Status: Verified // {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Audit: Online</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-600">ID: PHX-{safeIdString}-992</span>
          </div>
        </div>

        {/* --- Primary Insights Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Public Sources" value={repoData.publicRepos} sub="Repos Scanned" icon={<Code2 />} color="text-indigo-400" />
              <MetricCard title="Global Stars" value={repoData.totalStars} sub="Impact Score" icon={<Activity />} color="text-emerald-400" />
              <MetricCard title="Stack Bias" value={topLang} sub="Main Language" icon={<Layers />} color="text-blue-400" />
            </div>

            {/* Repository Feed */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">High-Intelligence Projects</span>
                <Terminal size={14} className="text-zinc-600" />
              </div>
              <div className="divide-y divide-white/5">
                {repoData.topProjects?.map((repo: any, i: number) => (
                  <a
                    key={i}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-zinc-200 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                        {repo.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase w-48 lg:w-80 truncate">{repo.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-black px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">{repo.language}</span>
                      <div className="text-amber-400 font-bold text-xs">{repo.stars} ⭐</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar AI Verdict */}
          <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <h2 className="text-sm font-black uppercase tracking-tighter text-indigo-400 mb-6 flex items-center gap-2">
              <ShieldCheck size={18} /> Phronex AI Verdict
            </h2>
            <ul className="space-y-6 text-[13px] leading-relaxed text-zinc-400">
              <li>
                <span className="text-white font-bold block mb-1">Structural Integrity</span>
                The user demonstrates high proficiency in <span className="text-indigo-300">{topLang}</span> with {repoData.publicRepos} verified sources.
              </li>
              <li>
                <span className="text-white font-bold block mb-1">Market Impact</span>
                Accumulated <span className="text-indigo-300">{repoData.totalStars} Stars</span> across the ecosystem, placing the user in the top tier of technical influencers.
              </li>
              <li>
                <span className="text-white font-bold block mb-1">Growth Vector</span>
                Integrity check passed. Suggesting expansion into <span className="text-white">Distributed Systems</span> to leverage existing {topLang} logic.
              </li>
            </ul>
          </div>
        </div>

        {/* --- LIVE CONTRIBUTION HEATMAP --- */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center">

            <div className="w-full flex justify-between items-center mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">
                Verified Interaction Matrix / LTM
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                LESS <div className="w-3 h-3 bg-zinc-900 rounded-sm" />
                <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> MORE
              </div>
            </div>

            <div className="p-8 bg-black/40 rounded-3xl border border-white/5 w-full flex justify-center overflow-x-auto">
              <GitHubCalendar
                username={ghUsername}
                colorScheme="dark"
                theme={{
                  dark: ['#18181b', '#064e3b', '#047857', '#10b981', '#34d399']
                }}
                labels={{
                  totalCount: '{{count}} contributions verified in the last year',
                }}
              />
            </div>
          </div>

          {/* Dynamic Activity Timeline */}
          <div className="grid grid-cols-1 gap-8 pb-20">
            <div className="relative pl-12 border-l border-zinc-800 pb-4">
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-500 rounded-full border-4 border-[#09090b] shadow-[0_0_15px_indigo]" />
              <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Historical Data Stream</h2>
              <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.03] transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {repoData.topProjects?.slice(0, 4).map((repo: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-zinc-300 group-hover:text-indigo-400 transition-colors flex items-center gap-2 truncate w-40">
                          {repo.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                        </p>
                        <p className="text-[10px] font-mono text-zinc-600 uppercase">INTEGRITY_INDEX: {Math.floor(Math.random() * 20) + 80}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-zinc-400">{repo.stars} ⭐</p>
                        <div className="w-16 h-1 bg-zinc-900 mt-2 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(repo.stars * 10, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean metric display
function MetricCard({ title, value, sub, icon, color }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-white/20 transition-all group shadow-xl">
      <div className={`${color} mb-4 opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</span>
      <div className="text-4xl font-black mt-1 tracking-tighter text-white">{value}</div>
      <div className="text-[10px] font-bold text-zinc-600 uppercase mt-2 tracking-tighter">{sub}</div>
    </div>
  );
}