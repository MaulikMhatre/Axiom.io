"use client";

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Zap,
    ShieldCheck,
    ArrowRight,
    Fingerprint,
    Globe,
    Share2,
    Loader2,
    CheckCircle,
    Activity,
    Lock,
    Cpu,
    BarChart3,
    History
} from 'lucide-react';
import { analyzeRepo } from '@/lib/api';

export default function Dashboard() {
    const [githubUrl, setGithubUrl] = useState("");
    const [repoData, setRepoData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [systemPulse, setSystemPulse] = useState(0);

    // Aesthetic Pulse Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemPulse(Math.floor(Math.random() * 10) + 90);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAnalyze = async () => {
        if (!githubUrl) return;
        setLoading(true);
        try {
            const data = await analyzeRepo(githubUrl);
            setRepoData(data);
            setIsInputVisible(false);
        } catch (err) {
            console.error(err);
            alert("Verification failed. Protocol timeout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-12 pt-28 font-sans selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- NEURAL HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800/50 pb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black tracking-[0.2em] uppercase">
                                System Active
                            </span>
                            <span className="text-zinc-700 font-mono text-[9px]">Uptime: 99.9% // Node: PH-01</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
                            Phronex <span className="text-indigo-600">Command</span>
                        </h1>
                    </div>
                    <div className="flex gap-8">
                        <HeaderStat label="Neural Load" value={`${systemPulse}%`} color="text-emerald-500" />
                        <HeaderStat label="Verified Nodes" value={repoData ? "04" : "01"} color="text-indigo-500" />
                    </div>
                </div>

                {/* --- MAIN COMMAND GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">

                    {/* 1. SOURCE AUDIT (The Action Center) */}
                    <div className="md:col-span-2 lg:col-span-3 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Globe size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Cpu size={14} className="text-indigo-500" /> Repository Intelligence
                            </h3>
                            
                            {repoData ? (
                                <div className="space-y-6">
                                    <p className="text-2xl font-bold leading-tight text-white italic">
                                        "{repoData.projectSummary.substring(0, 100)}..."
                                    </p>
                                    <div className="flex gap-3">
                                        {repoData.techStack.map((s: string) => (
                                            <span key={s} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-zinc-800 flex items-center gap-2 text-emerald-500 font-mono text-[10px] font-bold uppercase">
                                        <CheckCircle size={14} /> Audit Sequence Complete
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-sm">
                                        Connect your GitHub to initialize the <span className="text-white">Proof-of-Work</span> matrix and verify architectural complexity.
                                    </p>
                                    {isInputVisible ? (
                                        <div className="flex flex-col gap-3 max-w-sm">
                                            <input
                                                type="text"
                                                placeholder="Enter Repository URL..."
                                                className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                                                value={githubUrl}
                                                onChange={(e) => setGithubUrl(e.target.value)}
                                            />
                                            <button
                                                disabled={loading}
                                                onClick={handleAnalyze}
                                                className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={18} /> : "Initiate Audit"}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsInputVisible(true)}
                                            className="group/btn flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all"
                                        >
                                            Connect Source <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. SYSTEM STATUS (Data Visual) */}
                    <div className="md:col-span-2 lg:col-span-3 bg-indigo-600/[0.03] border border-indigo-500/20 p-8 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-[8px] leading-none p-4 break-all">
                            {Array(20).fill("VERIFY_TOKEN_INIT_PHRONEX_PROTOCOL_BLOCK_0x992_").join("")}
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Activity size={14} /> Integrity Index
                            </h3>
                            <div className="text-8xl font-black italic tracking-tighter text-white leading-none">
                                {repoData ? repoData.complexityScore : "0.0"}<span className="text-indigo-600">/</span>10
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Verification Status</span>
                                <span className="text-[10px] font-mono text-zinc-400">{repoData ? "COMPLETED" : "AWAITING_INPUT"}</span>
                             </div>
                             <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                                    style={{ width: repoData ? `${repoData.noveltyScore}%` : '0%' }}
                                />
                             </div>
                        </div>
                    </div>

                    {/* 3. EXPERIENCE SYNC (Bento Bottom) */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit mb-6">
                            <Share2 size={24} className="text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight mb-2">Experience Sync</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                            Import professional history to calculate the **Industry Velocity** score.
                        </p>
                        <button className="mt-8 w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                            Parse Resume PDF
                        </button>
                    </div>

                    {/* 4. RECENT ACTIVITY FEED */}
                    <div className="md:col-span-2 lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-6 flex items-center gap-2">
                            <History size={14} /> Audit Trail
                        </h3>
                        <div className="space-y-4">
                            <ActivityItem icon={<Zap size={12} />} text="Identity Matrix initialized." time="Just now" />
                            <ActivityItem icon={<Lock size={12} />} text="Secure node PH-01 established." time="2m ago" />
                            {repoData && <ActivityItem icon={<CheckCircle size={12} className="text-emerald-500" />} text={`Verified ${githubUrl.split('/').pop()}`} time="Recently" />}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function HeaderStat({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="text-right">
            <div className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</div>
            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function ActivityItem({ icon, text, time }: { icon: React.ReactNode, text: string, time: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
                <div className="text-zinc-600 group-hover:text-indigo-400 transition-colors">{icon}</div>
                <span className="text-xs font-bold text-zinc-400">{text}</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-700">{time}</span>
        </div>
    );
}