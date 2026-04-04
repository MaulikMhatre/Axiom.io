"use client";
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, Activity, Cpu, Fingerprint, Zap, Loader2, GitCommitHorizontal, Star, Trophy, Folder
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const gitRaw = localStorage.getItem('user_profile');
            const resumeRaw = localStorage.getItem('user_resume_data');
            const regRaw = localStorage.getItem('user_registration');
            
            const gitData = gitRaw ? JSON.parse(gitRaw) : {};
            const resumeData = resumeRaw ? JSON.parse(resumeRaw) : {};
            const regData = regRaw ? JSON.parse(regRaw) : {};
            const projects = gitData.topProjects || [];

            // --- 1. GENERATE DYNAMIC 6-MONTH WINDOW (Nov 2025 - Apr 2026) ---
            const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const now = new Date(); // April 2026
            const history: any[] = [];

            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                history.push({
                    month: monthsShort[d.getMonth()],
                    year: d.getFullYear(),
                    commits: 0,
                });
            }

            // --- 2. MAP COMMITS TO BUCKETS ---
            projects.forEach((p: any) => {
                if (p.last_updated) {
                    const pDate = new Date(p.last_updated);
                    if (!isNaN(pDate.getTime())) {
                        const pMonth = monthsShort[pDate.getMonth()];
                        const pYear = pDate.getFullYear();

                        const bucket = history.find(m => m.month === pMonth && m.year === pYear);
                        if (bucket) {
                            bucket.commits += (Number(p.personal_commits) || 0);
                        }
                    }
                }
            });

            // --- 3. BRUTAL INTEGRITY ALGORITHM ---
            const extractScore = (val: any) => {
                if (!val) return 0;
                return parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0;
            };

            const R_Score = extractScore(resumeData.atsScore || resumeData.credibility_score);
            const G_Stars = Number(gitData.totalStars || 0);
            const G_Impact = Math.min((G_Stars * 12) + (gitData.publicRepos * 2), 100);
            const totalCommits = projects.reduce((acc: number, curr: any) => acc + (Number(curr.personal_commits) || 0), 0);
            
            // Formula: 40% Resume, 40% GitHub Social, 20% Commit Consistency
            const finalScore = Math.round((R_Score * 0.4) + (G_Impact * 0.4) + (Math.min(totalCommits, 100) * 0.2)) || 88;

            setData({
                ...gitData,
                displayName: resumeData.name || regData.name || gitData.name || "Maulik Mhatre",
                displayCollege: regData.college || "D.J. Sanghvi College of Engineering",
                neuralScore: finalScore,
                momentum: history,
                milestones: resumeData.majorMilestones || [],
                topProjects: projects.slice(0, 4)
            });
        }
    }, []);

    if (!mounted || !data) return (
        <div className="h-screen bg-[#050505] flex items-center justify-center">
            <Loader2 className="animate-spin text-violet-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020203] text-zinc-100 pb-40 selection:bg-violet-500/30">
            <div className="max-w-7xl mx-auto pt-32 px-6 space-y-12">
                
                {/* Identity Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-10 flex items-center gap-10 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:opacity-[0.06] transition-opacity">
                            <Fingerprint size={250} />
                        </div>
                        <img src={data.avatarUrl} className="w-32 h-32 rounded-full border-4 border-zinc-800 z-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Avatar" />
                        <div className="z-10 space-y-2">
                            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{data.displayName}</h1>
                            <p className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase font-bold">{data.displayCollege}</p>
                            <div className="flex gap-3 pt-4">
                                <span className="px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                                   <Activity size={12}/> Analysis_Window: 180D_SYNC
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white text-black rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.05)]">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 z-10">Brutal integrity Score</span>
                        <div className="z-10 flex items-baseline gap-2">
                            <span className="text-9xl font-black italic tracking-tighter leading-none">{data.neuralScore}</span>
                            <span className="text-2xl font-bold text-black/20 italic">/100</span>
                        </div>
                        <Cpu className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000" size={250} />
                    </div>
                </div>

                {/* --- 6-MONTH GRIND GRAPH --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-zinc-900/10 border border-zinc-800 rounded-[3.5rem] p-10 flex flex-col">
                        <div className="flex justify-between items-center mb-10 px-2">
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 flex items-center gap-3 italic">
                                <GitCommitHorizontal size={18} className="text-violet-500" /> Neural Contribution Pulse
                            </h3>
                            <div className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-mono border border-zinc-700 rounded uppercase tracking-widest">Time_Series_Audit</div>
                        </div>
                        
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.momentum} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} opacity={0.2} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="#52525b" 
                                        fontSize={12} 
                                        fontWeight="900" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        dy={10}
                                    />
                                    <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                                    
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#09090b', 
                                            border: '1px solid #27272a', 
                                            borderRadius: '12px',
                                            paddingLeft: '12px',
                                            paddingRight: '12px',
                                            paddingTop: '8px',
                                            paddingBottom: '8px'
                                        }}
                                        itemStyle={{ 
                                            color: '#8b5cf6', 
                                            fontSize: '12px', 
                                            fontWeight: '900',
                                            margin: 0
                                        }}
                                        cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }}
                                    />
                                    
                                    <Area 
                                        type="monotone" 
                                        dataKey="commits" 
                                        stroke="#8b5cf6" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorCommits)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-8 group hover:border-violet-500/30 transition-all shadow-xl">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Impact Radius</span>
                            <div className="text-5xl font-black text-white italic">{data.totalStars || 0} <span className="text-sm font-mono text-zinc-800 uppercase">Stars</span></div>
                        </div>
                        <div className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-8 group hover:border-emerald-500/30 transition-all shadow-xl">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Authenticated Nodes</span>
                            <div className="text-5xl font-black text-white italic">{data.milestones.length || 0} <span className="text-sm font-mono text-zinc-800 uppercase">Tasks</span></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Repo Log */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                    {data.topProjects.map((p: any, i: number) => (
                        <div key={i} className="p-8 bg-black/40 border border-zinc-900 rounded-[2.5rem] hover:border-violet-500/40 transition-all group">
                            <div className="text-[8px] font-mono text-zinc-700 mb-3 uppercase font-bold tracking-widest">Ref_Node: 0x{i}F</div>
                            <h4 className="text-lg font-black text-zinc-100 uppercase italic tracking-tighter mb-4 truncate group-hover:text-violet-400 transition-colors leading-none">{p.name}</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-600 font-mono uppercase">{p.language || 'CORE'}</span>
                                <div className="flex items-center gap-2">
                                    <GitCommitHorizontal size={14} className="text-violet-500" />
                                    <span className="text-xs font-black text-white">{p.personal_commits || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}