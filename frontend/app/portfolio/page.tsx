// "use client";
// import React, { useEffect, useState } from 'react';
// import {
//     CheckCircle, Folder, Trophy, Activity,
//     Star, Award, ShieldCheck, BookOpen, ExternalLink, 
//     Cpu, Target, Target as TargetIcon
// } from 'lucide-react';
// import { useTheme } from 'next-themes';

// export default function PortfolioPage() {
//     const { theme } = useTheme();
//     const isDark = theme === 'dark';
//     const [data, setData] = useState<any>(null);
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//         const fetchData = async () => {
//             const userEmail = localStorage.getItem('user_email');
//             if (!userEmail) return;

//             try {
//                 const response = await fetch(`http://localhost:8000/api/me?email=${userEmail}`);
//                 const dbData = await response.json();

//                 const gitData = dbData.github || {};
//                 const resumeData = dbData.resume || {};
//                 const legacy = dbData.legacy || {};
                
//                 // Unified Data Object
//                 setData({
//                     ...gitData,
//                     displayName: resumeData.student_name || gitData.name || "Axiom User",
//                     displayCollege: resumeData.college || "Academic Institution",
//                     displayMajor: resumeData.major || resumeData.devType || "Core Engineering",
//                     skills: resumeData.skills_matrix 
//                         ? resumeData.skills_matrix.map((s: any) => ({ name: s.skill, level: s.signal_score }))
//                         : (resumeData.skills || gitData.topLanguages || []).slice(0, 6),
//                     certifications: resumeData.certifications || legacy.certifications || [],
//                     milestones: (resumeData.majorMilestones || resumeData.achievements || legacy.achievements || []).slice(0, 5),
//                     allProjects: (resumeData.top_3_projects && resumeData.top_3_projects.length > 0)
//                         ? resumeData.top_3_projects.map((p: any) => ({ name: p.name, description: p.one_line_impact, language: p.stack?.[0] || "ASM_CORE" }))
//                         : (gitData.topProjects || []).slice(0, 6),
//                     trustScore: resumeData.atsScore || "92"
//                 });
//             } catch (err) {
//                 console.error("Portfolio synchronization failed:", err);
//             }
//         };

//         fetchData();
//     }, []);

//     if (!mounted || !data) return <div className="bg-white dark:bg-background h-screen" />;

//     return (
//         <div className="min-h-screen bg-white dark:bg-background text-foreground selection:bg-indigo-500/30 pb-40 transition-colors duration-300">
//             {/* Background Effects */}
//             <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
//                 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 dark:bg-indigo-600/5 blur-[140px] rounded-full" />
//                 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[140px] rounded-full" />
//             </div>

//             <div className="max-w-7xl mx-auto pt-40 px-6 space-y-16">
                
//                 {/* --- IDENTITY HEADER --- */}
//                 <header className="relative p-12 md:p-16 rounded-[4rem] border border-border bg-zinc-100 dark:bg-zinc-900/10 backdrop-blur-3xl overflow-hidden group shadow-2xl">
//                     <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity">
//                         <ShieldCheck size={280} className="text-indigo-600 dark:text-indigo-500" />
//                     </div>
                    
//                     <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
//                         <div className="w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-xl">
//                             <img 
//                                 src={data.avatarUrl || `https://ui-avatars.com/api/?name=${data.displayName}&background=6366f1&color=fff`} 
//                                 className="w-full h-full rounded-full object-cover bg-background border-8 border-white dark:border-black shadow-lg dark:shadow-none" 
//                                 alt="Avatar" 
//                             />
//                         </div>
                        
//                         <div className="text-center md:text-left space-y-6">
//                             <div className="space-y-3">
//                                 <div className="flex flex-col md:flex-row items-center gap-6">
//                                     <h1 className="text-6xl md:text-7xl font-black text-foreground italic uppercase tracking-tighter leading-none">
//                                         {data.displayName}
//                                     </h1>
//                                     <span className="text-base font-black uppercase tracking-widest px-5 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
//                                         Verified_Node
//                                     </span>
//                                 </div>
//                                 <p className="text-zinc-800 dark:text-zinc-300 font-mono text-xl md:text-xl tracking-[0.4em] uppercase font-bold pt-2">
//                                     {data.displayCollege} <span className="text-indigo-500 mx-2">//</span> {data.displayMajor}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    
//                     {/* TECHNICAL VECTOR */}
//                     <div className="md:col-span-4 bg-zinc-100 dark:bg-zinc-900/10 border border-border rounded-[3.5rem] p-10 shadow-xl">
//                         <h3 className="text-base font-black uppercase tracking-[0.5em] text-zinc-800 dark:text-zinc-300 font-bold mb-12 flex items-center gap-3">
//                             <Cpu size={18} className="text-indigo-700 dark:text-indigo-500" /> Technical Vector
//                         </h3>
//                         <div className="space-y-10">
//                             {data.skills.map((skill: any, i: number) => {
//                                 const name = skill.name || (Array.isArray(skill) ? skill[0] : skill);
//                                 const val = skill.level || (Array.isArray(skill) ? (skill[1] > 10 ? skill[1] : skill[1] * 10) : 85);
//                                 return (
//                                     <div key={i} className="space-y-4">
//                                         <div className="flex justify-between text-base font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-widest">
//                                             <span>{name}</span>
//                                             <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{val}%</span>
//                                         </div>
//                                         <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800/50 rounded-full overflow-hidden border border-border shadow-sm p-0.5">
//                                             <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 rounded-full" style={{ width: `${val}%` }} />
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* PROOF OF WORK */}
//                     <div className="md:col-span-8 bg-zinc-100 dark:bg-zinc-900/10 border border-border rounded-[3.5rem] p-12 shadow-xl">
//                         <h3 className="text-base font-black uppercase tracking-[0.5em] text-zinc-800 dark:text-zinc-300 font-bold mb-12 flex items-center gap-3">
//                             <Folder size={18} className="text-indigo-700 dark:text-indigo-500" /> Proof of Work
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                             {data.allProjects.map((proj: any, i: number) => (
//                                 <div key={i} className="group p-8 bg-white dark:bg-zinc-900/30 border border-border rounded-[2.5rem] hover:border-indigo-500/40 transition-all shadow-lg">
//                                     <h4 className="font-black text-2xl text-foreground group-hover:text-indigo-600 dark:text-indigo-400 transition-colors uppercase italic tracking-tighter mb-4">
//                                         {proj.name}
//                                     </h4>
//                                     <p className="text-lg text-zinc-800 dark:text-zinc-300 leading-relaxed font-bold line-clamp-3 mb-8 italic">
//                                         "{proj.description || 'Verified computational asset architecture.'}"
//                                     </p>
//                                     <div className="flex justify-between items-center pt-6 border-t border-border">
//                                         <span className="text-base font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400 font-mono bg-indigo-500/10 px-3 py-1 rounded">{proj.language || "ASM_CORE"}</span>
//                                         <ExternalLink size={18} className="text-zinc-800 dark:text-zinc-300 font-bold" />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* CREDENTIALS */}
//                     <div className="md:col-span-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] p-12">
//                         <h3 className="text-base font-black uppercase tracking-[0.5em] text-emerald-600 dark:text-emerald-500 mb-10 flex items-center gap-3">
//                             <ShieldCheck size={18} /> Credentials
//                         </h3>
//                         <div className="grid gap-4">
//                             {data.certifications.map((cert: any, i: number) => (
//                                 <div key={i} className="flex items-center gap-5 p-6 bg-white/40 dark:bg-background/20 rounded-3xl border border-border">
//                                     <BookOpen size={20} className="text-emerald-500" />
//                                     <span className="text-lg font-black text-foreground tracking-tight uppercase leading-none">
//                                         {typeof cert === 'object' ? (cert.name || cert.certificate_name) : cert}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* MILESTONES */}
//                     <div className="md:col-span-6 bg-amber-500/5 border border-amber-500/10 rounded-[3rem] p-12 text-zinc-900 dark:text-zinc-100">
//                         <h3 className="text-base font-black uppercase tracking-[0.5em] text-amber-600 dark:text-amber-500 mb-10 flex items-center gap-3">
//                             <Trophy size={18} /> Major Milestones
//                         </h3>
//                         <div className="space-y-8 relative pl-6">
//                             <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-zinc-200 dark:bg-zinc-800" />
//                             {data.milestones.map((ach: any, i: number) => (
//                                 <div key={i} className="relative flex items-center gap-8">
//                                     <div className="w-3 h-3 rounded-full bg-background border-2 border-amber-500 z-10 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
//                                     <p className="text-xl font-black text-foreground uppercase tracking-tighter leading-none italic">
//                                         {typeof ach === 'object' ? (ach.name || ach.achievement || ach.milestone) : ach}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




















"use client";
import React, { useEffect, useState } from 'react';
import {
    CheckCircle, Folder, Trophy, Activity, Star, Award, 
    ShieldCheck, BookOpen, ExternalLink, Cpu, Target, 
    Zap, Globe, Code2, Layers
} from 'lucide-react';
import { useTheme } from 'next-themes';

// --- TYPES ---
interface Project {
    name: string;
    description: string;
    language: string;
}

interface Skill {
    name: string;
    level: number;
}

// --- SUB-COMPONENTS ---
const Card = ({ children, className = "", title, icon: Icon, colorClass = "text-indigo-500" }: any) => (
    <div className={`relative overflow-hidden bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md ${className}`}>
        {title && (
            <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${colorClass}`}>
                    <Icon size={20} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                    {title}
                </h3>
            </div>
        )}
        {children}
    </div>
);

export default function PortfolioPage() {
    const { theme } = useTheme();
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
                const { github: gitData = {}, resume: resumeData = {}, legacy = {} } = dbData;

                setData({
                    ...gitData,
                    displayName: resumeData.student_name || gitData.name || "Axiom User",
                    displayCollege: resumeData.college || "Academic Institution",
                    displayMajor: resumeData.major || resumeData.devType || "Core Engineering",
                    skills: (resumeData.skills_matrix || []).map((s: any) => ({ 
                        name: s.skill, 
                        level: parseInt(s.signal_score) || 85 
                    })).slice(0, 6),
                    certifications: resumeData.certifications || legacy.certifications || [],
                    milestones: (resumeData.majorMilestones || resumeData.achievements || []).slice(0, 5),
                    allProjects: (resumeData.top_3_projects || []).length > 0
                        ? resumeData.top_3_projects.map((p: any) => ({ 
                            name: p.name, 
                            description: p.one_line_impact, 
                            language: p.stack?.[0] || "ASM_CORE" 
                          }))
                        : (gitData.topProjects || []).slice(0, 4),
                });
            } catch (err) {
                console.error("Sync failed:", err);
            }
        };
        fetchData();
    }, []);

    if (!mounted || !data) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
                <Activity className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground selection:bg-indigo-500/30 pb-24 transition-colors duration-300">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 space-y-8">
                
                {/* --- HEADER SECTION --- */}
                <header className="relative group overflow-hidden rounded-[3rem] border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-500 blur-2xl opacity-20 animate-pulse" />
                            <img 
                                src={data.avatarUrl || `https://ui-avatars.com/api/?name=${data.displayName}&background=6366f1&color=fff`} 
                                className="relative w-40 h-40 rounded-3xl object-cover border-4 border-white dark:border-zinc-800 shadow-2xl" 
                                alt="Profile" 
                            />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck size={14} /> Identity Verified
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                                {data.displayName}
                            </h1>
                            <p className="font-mono text-zinc-500 dark:text-zinc-400 text-sm md:text-base tracking-[0.2em] uppercase">
                                {data.displayCollege} <span className="text-indigo-500 font-bold mx-2">/</span> {data.displayMajor}
                            </p>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 text-center">
                                <p className="text-3xl font-black text-indigo-500">92</p>
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Trust Score</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 text-center">
                                <p className="text-3xl font-black text-emerald-500">{data.allProjects.length}</p>
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Assets</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: TECH STACK */}
                    <Card title="Technical Vector" icon={Cpu} className="lg:col-span-4" colorClass="text-indigo-500">
                        <div className="space-y-6">
                            {data.skills.map((skill: Skill, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-black uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                                            {skill.name}
                                        </span>
                                        <span className="text-xs font-mono opacity-50">{skill.level}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                                            style={{ width: `${skill.level}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* RIGHT COLUMN: PROJECTS */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.allProjects.map((proj: Project, i: number) => (
                                <div key={i} className="group relative p-8 rounded-[2rem] bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 hover:border-indigo-500/50 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                            <Code2 size={24} />
                                        </div>
                                        <ExternalLink size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="text-xl font-black uppercase italic tracking-tight mb-2 group-hover:text-indigo-500">
                                        {proj.name}
                                    </h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 line-clamp-2">
                                        {proj.description || "System architecture for high-scale computational modules."}
                                    </p>
                                    <div className="inline-block px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                        {proj.language}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOTTOM ROW: CREDENTIALS & MILESTONES */}
                    <Card title="Certified Credentials" icon={Award} className="lg:col-span-6" colorClass="text-emerald-500">
                        <div className="grid gap-3">
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-transparent hover:border-emerald-500/20 transition-all">
                                    <BookOpen size={16} className="text-emerald-500" />
                                    <span className="text-xs font-bold uppercase tracking-tight">
                                        {typeof cert === 'object' ? (cert.name || cert.certificate_name) : cert}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Major Milestones" icon={Target} className="lg:col-span-6" colorClass="text-amber-500">
                        <div className="space-y-4">
                            {data.milestones.map((ach: any, i: number) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                        <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 mt-2" />
                                    </div>
                                    <p className="text-sm font-bold uppercase italic tracking-tight pb-4 group-hover:text-amber-500 transition-colors">
                                        {typeof ach === 'object' ? (ach.name || ach.achievement || ach.milestone) : ach}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}