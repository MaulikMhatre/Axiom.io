"use client";
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, Activity, Cpu, Fingerprint, GitCommitHorizontal, Star, Briefcase, GraduationCap, Github, Linkedin, FileText, ShieldAlert, Award, Target
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import NeuralBackground from "@/components/ui/flow-field-background";
import { useTheme } from 'next-themes';

export default function DashboardPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [data, setData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            const userEmail = localStorage.getItem('user_email');
            if (!userEmail) return;

            try {
                const response = await fetch(`http://localhost:8000/api/me?email=${userEmail}`);
                const dbData = await response.json();

                const legacy = dbData.legacy || {};
                
                const gitData = (Object.keys(dbData.github || {}).length > 0 ? dbData.github : legacy.github) || {};
                const resumeData = (Object.keys(dbData.resume || {}).length > 0 ? dbData.resume : legacy.resume) || {};
                const linkedinData = (Object.keys(dbData.linkedin || {}).length > 0 ? dbData.linkedin : legacy.linkedin) || {};

                
                const projects = gitData.topProjects || [];

                // --- 1. GENERATE DYNAMIC 6-MONTH WINDOW ---
                const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const now = new Date();
                const history: any[] = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    history.push({ month: monthsShort[d.getMonth()], year: d.getFullYear(), commits: 0 });
                }

                projects.forEach((p: any) => {
                    if (p.last_updated) {
                        const pDate = new Date(p.last_updated);
                        if (!isNaN(pDate.getTime())) {
                            const bucket = history.find(m => m.month === monthsShort[pDate.getMonth()] && m.year === pDate.getFullYear());
                            if (bucket) bucket.commits += (Number(p.personal_commits) || 0);
                        }
                    }
                });

                // --- 2. COMPOSE SKILL DENSITY FOR RADAR ---
                // E.g. { "Backend": 90, "Frontend": 70 } -> [{ subject: 'Backend', A: 90, fullMark: 100 }]
                const skillDensityRaw = resumeData.skillDensity || { "Logic": 50, "Code": 50, "Design": 50 };
                const radarData = Object.keys(skillDensityRaw).map(key => ({
                    subject: key,
                    A: skillDensityRaw[key],
                    fullMark: 100
                }));

                // --- 3. NEURAL SCORE ENGINE ---
                const extractScore = (val: any) => parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0;
                const R_Score = extractScore(resumeData.atsScore) || 50;
                const L_Score = extractScore(linkedinData.credibility_score) || 50;
                const G_Stars = Number(gitData.totalStars || 0);
                const G_Impact = Math.min((G_Stars * 15) + (projects.length * 5), 100);
                
                const finalScore = Math.round((R_Score * 0.35) + (L_Score * 0.25) + (G_Impact * 0.4)) || 0;
                
                let legacyObj = legacy;
                if (typeof legacy === "string") {
                    try { legacyObj = JSON.parse(legacy); } catch(e){}
                }
                const dbCgpa = resumeData?.cgpa || legacyObj?.resume?.cgpa || legacyObj?.profile_data?.resume?.cgpa || legacyObj?.cgpa || "N/A";

                setData({
                    ready: true,
                    displayName: resumeData.name || linkedinData.name || gitData.name || "Axiom User",
                    email: userEmail,
                    cgpa: dbCgpa,
                    avatarUrl: gitData.avatarUrl || "https://github.com/github.png",
                    neuralScore: finalScore,
                    momentum: history,
                    radarData: radarData,
                    resume: resumeData,
                    linkedin: linkedinData,
                    github: gitData,
                    projects: projects.slice(0, 4)
                });
            } catch (err) {
                console.error("Failed to fetch ME endpoint:", err);
            }
        };

        fetchData();
    }, []);

    if (!mounted || !data?.ready) return (
        <div className="h-screen bg-background flex flex-col items-center justify-center space-y-4">
            <Activity className="animate-pulse text-indigo-700 dark:text-indigo-500" size={60} />
            <p className="text-indigo-600 dark:text-indigo-400 text-base font-black uppercase tracking-[0.4em] animate-pulse">Aggregating Global Vectors</p>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background text-foreground pb-40 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-background">
                <NeuralBackground color="#6366f1" trailOpacity={0.1} particleCount={400} speed={0.5} scale={1} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto pt-32 px-6 space-y-12 relative z-10">
                
                {/* --- HEADER IDENTITY --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 backdrop-blur-2xl bg-card text-card-foreground shadow-sm border border-border rounded-[3rem] p-10 flex items-center gap-10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.1)] group">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <img src={data.avatarUrl} className="w-full h-full rounded-full border border-indigo-500/30 z-10 grayscale group-hover:grayscale-0 transition-all duration-700 object-cover" alt="Avatar" />
                            <div className="absolute -inset-4 border border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute -inset-8 border border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl lg:text-6xl font-black text-foreground italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 dark:from-white to-zinc-500 leading-none">{data.displayName}</h1>
                                <CheckCircle className="text-indigo-700 dark:text-indigo-500" size={28} />
                            </div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-mono text-base tracking-[0.4em] uppercase font-extrabold">{data.email}</p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-base font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                   <Activity size={12}/> Analysis_Window: 180D_SYNC
                                </span>
                                {(data.resume?.devType || data.github?.devType) && (
                                    <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-base font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                                        <Cpu size={12}/> {data.resume?.devType || data.github?.devType}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="backdrop-blur-2xl bg-card text-card-foreground shadow-sm border border-border rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group shadow-[0_0_100px_-20px_rgba(99,102,241,0.1)]">
                        <span className="text-base font-black uppercase tracking-[0.4em] text-zinc-800 dark:text-zinc-300 font-bold z-10">Axiom Neural Score</span>
                        <div className="z-10 flex items-baseline gap-2 mt-4">
                            <span className="text-8xl lg:text-9xl font-black text-foreground italic tracking-tighter leading-none text-foreground">{data.neuralScore}</span>
                            <span className="text-xl lg:text-2xl font-extrabold text-zinc-800 dark:text-zinc-300 font-bold italic">/100</span>
                        </div>
                        <Fingerprint className="absolute -bottom-10 -right-10 text-indigo-700 dark:text-indigo-500/10 group-hover:text-indigo-700 dark:text-indigo-500/20 group-hover:scale-110 transition-all duration-1000" size={250} strokeWidth={0.5} />
                    </div>
                </div>

                {/* --- CORE ANALYTICS ROW --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Github Radar / Skills */}
                    <div className="backdrop-blur-xl bg-card text-card-foreground shadow-sm border border-border rounded-[2.5rem] p-8 flex flex-col items-center justify-center">
                        <div className="w-full flex justify-between items-center mb-4 justify-center">
                            <span className="text-base font-black uppercase tracking-[0.3em] text-zinc-800 dark:text-zinc-300 flex items-center justify-center gap-2 w-full"><Cpu size={16}/> Skill Density</span>
                        </div>
                        <div className="w-full h-[250px] -mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                                    <PolarGrid stroke={isDark ? "#3f3f46" : "#e4e4e7"} strokeDasharray="3 3"/>
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#d4d4d8' : '#27272a', fontSize: 13, fontWeight: 'bold' }} />
                                    <Radar name="Skills" dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Resume / ATS Overview */}
                    <div className="backdrop-blur-xl bg-card text-card-foreground shadow-sm border border-border rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-white dark:border-black shadow-lg dark:shadow-none/5 dark:border-white/5 pb-4">
                            <span className="text-base font-black uppercase tracking-[0.3em] text-zinc-800 dark:text-zinc-300 flex items-center gap-2"><FileText size={16}/> ATS Telemetry</span>
                            <span className="text-4xl font-black text-foreground italic">{data.resume?.atsScore || 0}<span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300">ATS</span></span>
                        </div>
                        
                        <div className="space-y-4">
                            {/* <div className="flex justify-between items-center">
                                <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300">Recorded CGPA</span>
                                <span className="text-base font-black text-foreground px-4 py-1.5 bg-zinc-100/50 dark:bg-white/5 rounded-lg border border-border">{data.cgpa}</span>
                            </div> */}
                            
                            <div className="w-full bg-zinc-100/50 dark:bg-white/5 rounded-xl p-5">
                                <span className="text-base font-black uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-300 block mb-4">Top Hard Skills</span>
                                <div className="flex flex-wrap gap-3">
                                    {(data.resume?.skills || []).slice(0, 5).map((s: any, i: number) => (
                                        <span key={i} className="text-base font-extrabold px-4 py-2 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 rounded-md border border-indigo-500/30">
                                            {s.name} ({s.level})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LinkedIn / Trust Overview */}
                    <div className="backdrop-blur-xl bg-card text-card-foreground shadow-sm border border-border rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-white dark:border-black shadow-lg dark:shadow-none/5 dark:border-white/5 pb-4">
                            <span className="text-base font-black uppercase tracking-[0.3em] text-zinc-800 dark:text-zinc-300 flex items-center gap-2"><Linkedin size={16}/> Trust Vector</span>
                            <span className="text-4xl font-black text-foreground italic">{data.linkedin?.credibility_score || 0}<span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300">CRD</span></span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="w-full bg-zinc-100/50 dark:bg-white/5 rounded-xl p-5">
                                <span className="text-base font-black uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-300 block mb-4">Verification Tags</span>
                                <div className="flex flex-wrap gap-3">
                                    {(data.linkedin?.verification_tags || []).slice(0, 4).map((tag: string, i: number) => (
                                        <span key={i} className="text-base font-extrabold px-4 py-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-500/20 flex items-center gap-2">
                                            <CheckCircle size={14} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-base text-zinc-800 dark:text-zinc-300 font-bold leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 py-2">
                                "{data.linkedin?.headline || 'No verified professional headline detected.'}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STRATEGIC ROADMAP --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 backdrop-blur-2xl bg-card text-card-foreground shadow-sm border border-border rounded-[3rem] p-10 flex flex-col">
                        <div className="flex justify-between items-center mb-10 px-2">
                            <h3 className="text-base font-black uppercase tracking-[0.5em] text-zinc-800 dark:text-zinc-300 font-bold flex items-center gap-3">
                                <Target size={18} className="text-indigo-700 dark:text-indigo-500" /> Strategic Growth Roadmap
                            </h3>
                            <div className="px-3 py-1 bg-zinc-100/50 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 text-base font-mono border border-border rounded uppercase tracking-widest italic">Phase_III_Audit</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-4">
                            {[
                                { title: 'Institutional Genesis', icon: <GraduationCap size={20} />, status: 'COMPLETE', desc: data.displayCollege || 'D.J. Sanghvi COE', color: 'indigo' },
                                { title: 'Neural Hardening', icon: <Cpu size={20} />, status: 'ACTIVE', desc: `${data.projects.length}+ Verified Projects`, color: 'emerald' },
                                { title: 'Target Horizon', icon: <Star size={20} />, status: 'LOCKED', desc: 'Elite System Architect', color: 'purple' }
                            ].map((step, i) => (
                                <div key={i} className="bg-zinc-50 dark:bg-white/[0.02] border border-border rounded-[2rem] p-8 space-y-6 group hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className={`w-12 h-12 rounded-full bg-${step.color}-500/10 flex items-center justify-center text-${step.color}-500 text-${step.color}-700 dark:text-${step.color}-400`}>
                                            {step.icon}
                                        </div>
                                        <h4 className="text-lg font-black text-foreground uppercase italic tracking-tight leading-none">{step.title}</h4>
                                        <p className="text-base text-zinc-800 dark:text-zinc-300 font-bold leading-relaxed">{step.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${step.status === 'COMPLETE' ? 'bg-emerald-500' : step.status === 'ACTIVE' ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-500'} shadow-[0_0_10px_currentColor]`} />
                                        <span className="text-base font-black font-mono text-zinc-800 dark:text-zinc-300 uppercase tracking-widest">{step.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6 flex flex-col justify-center">
                        <div className="backdrop-blur-xl bg-white border-zinc-200 shadow-sm dark:bg-white/[0.01] border dark:border-white/5 rounded-[2.5rem] p-8 space-y-2 group hover:border-indigo-500/30 transition-all">
                            <span className="text-base font-black text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-widest flex items-center gap-2"><Github size={14}/> Impact Radius</span>
                            <div className="text-5xl font-black text-foreground italic">{data.github?.totalStars || 0} <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300 font-bold uppercase">Stars</span></div>
                        </div>
                        <div className="backdrop-blur-xl bg-white border-zinc-200 shadow-sm dark:bg-white/[0.01] border dark:border-white/5 rounded-[2.5rem] p-8 space-y-2 group hover:border-purple-500/30 transition-all">
                            <span className="text-base font-black text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-widest flex items-center gap-2"><Award size={14}/> Major Achievements</span>
                            <div className="text-5xl font-black text-foreground italic">{data.resume?.achievements?.length || data.resume?.majorMilestones?.length || 0} <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300 font-bold uppercase">Recognitions</span></div>
                        </div>
                    </div>
                </div>

                {/* --- INTELLIGENCE LOGS (Actionable & Flaws) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="backdrop-blur-2xl bg-indigo-50/50 dark:bg-indigo-500/[0.02] border border-indigo-500/10 rounded-[3rem] p-10">
                        <h3 className="text-base font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-3"><Activity size={16}/> Actionable Vectors</h3>
                        <ul className="space-y-4">
                            {(data.resume?.actionableFixes || []).slice(0, 3).map((fix: string, idx: number) => (
                                <li key={idx} className="flex gap-4 items-start">
                                    <div className="mt-1 p-1 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded"><Activity size={12}/></div>
                                    <p className="text-base text-zinc-800 dark:text-zinc-300 font-bold leading-relaxed">{fix}</p>
                                </li>
                            ))}
                            {(!data.resume?.actionableFixes || data.resume.actionableFixes.length === 0) && (
                                <p className="text-base text-zinc-800 dark:text-zinc-300 font-mono">No actionable intelligence available. Upload resume for analysis.</p>
                            )}
                        </ul>
                    </div>
                    <div className="backdrop-blur-2xl bg-rose-50 dark:bg-rose-500/[0.02] border border-rose-500/10 rounded-[3rem] p-10">
                        <h3 className="text-base font-black uppercase tracking-[0.4em] text-rose-600 dark:text-rose-400 mb-8 flex items-center gap-3"><ShieldAlert size={16}/> Critical Vulnerabilities</h3>
                        <ul className="space-y-4">
                            {(data.resume?.criticalFlaws || []).slice(0, 3).map((flaw: string, idx: number) => (
                                <li key={idx} className="flex gap-4 items-start">
                                    <div className="mt-1 p-1 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded"><ShieldAlert size={12}/></div>
                                    <p className="text-base text-zinc-800 dark:text-zinc-300 font-bold leading-relaxed">{flaw}</p>
                                </li>
                            ))}
                            {(!data.resume?.criticalFlaws || data.resume.criticalFlaws.length === 0) && (
                                <p className="text-base text-zinc-800 dark:text-zinc-300 font-mono">No critical flaws detected.</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* --- BOTTOM GITHUB PROJECTS LIST --- */}
                {data.projects.length > 0 && (
                    <div className="pt-8">
                        <h3 className="text-base font-black uppercase tracking-[0.5em] text-zinc-800 dark:text-zinc-300 font-bold mb-6 text-center italic">Verified Project Nodes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.projects.map((p: any, i: number) => (
                                <div key={i} className="p-8 backdrop-blur-xl bg-card text-card-foreground shadow-sm border border-border rounded-[2.5rem] hover:border-indigo-500/40 transition-all group shadow-xl">
                                    <div className="text-[8px] font-mono text-zinc-800 dark:text-zinc-300 mb-4 uppercase font-extrabold tracking-widest">Ref_Node: 0x{i + 1}F</div>
                                    <h4 className="text-lg font-black text-foreground uppercase italic tracking-tight mb-4 truncate group-hover:text-indigo-600 dark:text-indigo-400 transition-colors leading-none">{p.name}</h4>
                                    <div className="flex items-center justify-between border-t border-white dark:border-black shadow-lg dark:shadow-none/5 dark:border-white/5 pt-4">
                                        <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300 font-bold font-mono uppercase bg-zinc-100/50 dark:bg-white/5 px-2 py-1 rounded">{p.language || 'CORE'}</span>
                                        <div className="flex items-center gap-2">
                                            <GitCommitHorizontal size={14} className="text-indigo-700 dark:text-indigo-500" />
                                            <span className="text-base font-black text-foreground">{p.personal_commits || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Stat({ label, value }: any) {
    return (
        <div className="text-right">
            <div className="text-4xl font-black text-foreground mt-1 text-foreground tracking-tighter tabular-nums">{value}</div>
            <div className="text-base font-black text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-[0.4em]">{label}</div>
        </div>
    );
}
