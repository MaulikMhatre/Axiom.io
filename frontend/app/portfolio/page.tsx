// "use client";
// import React, { useEffect, useState } from 'react';
// import {
//     Github, CheckCircle, Folder, Trophy, Activity,
//     Star, Award, ShieldCheck, GraduationCap, Briefcase, Network, BookOpen, ExternalLink, Loader2
// } from 'lucide-react';

// export default function DashboardPage() {
//     const [data, setData] = useState<any>(null);
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//         if (typeof window !== 'undefined') {
//             const gitSync = localStorage.getItem('user_profile');
//             const manualProjs = localStorage.getItem('manual_projects');
//             const regForm = localStorage.getItem('user_registration');
//             const resumeAi = localStorage.getItem('user_resume_data');

//             const gitData = gitSync ? JSON.parse(gitSync) : {};
//             const personalData = manualProjs ? JSON.parse(manualProjs) : [];
//             const regData = regForm ? JSON.parse(regForm) : {};
//             const resumeData = resumeAi ? JSON.parse(resumeAi) : {};

//             const combinedProjects = [...personalData, ...(gitData.topProjects || [])].slice(0, 6);

//             // --- DATA NORMALIZATION LAYER ---
//             // This ensures that no matter what the AI names the keys, the frontend finds them.
//             const rawSkills = resumeData.skills || resumeData.extractedSkills || gitData.topLanguages || [];
//             const rawCerts = resumeData.certifications || resumeData.certs || [];
//             const rawMilestones = resumeData.milestones || resumeData.achievements || [];

//             setData({
//                 ...gitData,
//                 displayName: regData.name || gitData.name || "Maulik Mhatre",
//                 displayCollege: regData.college || "D.J. Sanghvi College of Engineering",
//                 displayMajor: regData.major || "B.Tech Computer Engineering",
//                 avatarUrl: gitData.avatarUrl || "https://github.com/identicons/m.png",
//                 allProjects: combinedProjects,
//                 skills: rawSkills,
//                 workExperience: resumeData.workExperience || [],
//                 certifications: rawCerts,
//                 milestones: rawMilestones,
//                 trustScore: gitData.totalStars > 0 ? '98' : '92',
//                 publicRepos: gitData.publicRepos || 0,
//                 totalStars: gitData.totalStars || 0
//             });
//         }
//     }, []);

//     if (!mounted || !data) return (
//         <div className="flex h-screen items-center justify-center bg-[#09090b]">
//             <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
//         </div>
//     );

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-8 max-w-7xl mx-auto pt-24 px-6 pb-20">

//             {/* --- IDENTITY HEADER --- */}
//             <div className="bg-slate-800/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

//                 <div className="flex flex-col md:flex-row items-center gap-10 z-10 text-center md:text-left">
//                     <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
//                         <img src={data.avatarUrl} className="w-full h-full rounded-full bg-[#09090b] object-cover border-4 border-[#09090b]" alt="Profile" />
//                     </div>
//                     <div>
//                         <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
//                             <h1 className="text-4xl font-black text-white tracking-tight italic uppercase">{data.displayName}</h1>
//                             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
//                                 <CheckCircle className="w-3 h-3 mr-1" /> Verified Node
//                             </span>
//                         </div>
//                         <p className="text-slate-400 text-sm font-mono uppercase tracking-[0.2em]">{data.displayCollege} // {data.displayMajor}</p>
//                         <div className="flex gap-4 justify-center md:justify-start mt-6">
//                             <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold text-slate-300">
//                                 <span className="text-indigo-400">{data.publicRepos}</span> ASSETS
//                             </div>
//                             <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold text-slate-300">
//                                 <span className="text-amber-400">{data.totalStars}</span> IMPACT
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center min-w-[200px] z-10 shadow-inner group hover:border-indigo-500/20 transition-all">
//                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 font-mono text-center">Neural Integrity</span>
//                     <span className="text-7xl font-black text-white italic tracking-tighter opacity-80">
//                         {data.trustScore}
//                     </span>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* --- LEFT: PROJECTS & WORK --- */}
//                 <div className="lg:col-span-2 space-y-8">
//                     <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
//                         <h2 className="text-xl font-bold mb-10 flex items-center text-white italic uppercase tracking-tighter">
//                             <Folder className="w-5 h-5 mr-4 text-indigo-500" /> Verified Project Audit
//                         </h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {data.allProjects.map((project: any, i: number) => (
//                                 <div key={i} className="bg-white/[0.03] rounded-3xl border border-white/5 p-6 hover:border-indigo-500/30 transition-all group">
//                                     <div className="flex justify-between items-start mb-4">
//                                         <h4 className="font-bold text-indigo-400 group-hover:text-white transition-colors">{project.name}</h4>
//                                         <ExternalLink size={14} className="text-zinc-700" />
//                                     </div>
//                                     <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 italic">"{project.description}"</p>
//                                     <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
//                                         <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">{project.language}</span>
//                                         <span className="text-[10px] text-amber-500 font-bold flex items-center"><Star size={10} className="mr-1 fill-amber-500" /> {project.stars}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>

//                 {/* --- RIGHT: SKILLS & CERTS --- */}
//                 <div className="space-y-8">
                    
//                     {/* SKILLS PROGRESS BARS */}
//                     <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
//                         <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 flex items-center">
//                             <Activity className="w-4 h-4 mr-3 text-indigo-500" /> Vector Analysis
//                         </h2>
//                         <div className="space-y-6">
//                             {data.skills.map((skill: any, i: number) => {
//                                 // Handles both array format ["Python", 9] and object format {name: "Python", level: 90}
//                                 const name = skill.name || skill.skill || (Array.isArray(skill) ? skill[0] : "Neural Asset");
//                                 const rawVal = skill.level || skill.score || (Array.isArray(skill) ? skill[1] : 50);
//                                 const percentage = rawVal <= 10 ? rawVal * 10 : rawVal;

//                                 return (
//                                     <div key={i} className="space-y-2">
//                                         <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-widest">
//                                             <span>{name}</span>
//                                             <span className="text-indigo-400">{percentage}%</span>
//                                         </div>
//                                         <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
//                                             <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </section>

//                     {/* CERTIFICATIONS (SAFE OBJECT RENDERING) */}
//                     <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
//                         <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 flex items-center">
//                             <ShieldCheck className="w-4 h-4 mr-3" /> Credentials
//                         </h2>
//                         <div className="space-y-3">
//                             {data.certifications.length > 0 ? data.certifications.map((cert: any, i: number) => (
//                                 <div key={i} className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center text-[11px] font-bold text-zinc-300">
//                                     <BookOpen size={14} className="mr-3 text-emerald-500 shrink-0" />
//                                     {typeof cert === 'object' ? (cert.name || cert.certificate_name) : cert}
//                                 </div>
//                             )) : <p className="text-[10px] text-zinc-700 italic">No credentials logged.</p>}
//                         </div>
//                     </section>

//                     {/* MILESTONES (SAFE OBJECT RENDERING) */}
//                     <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
//                         <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-6 flex items-center">
//                             <Award className="w-4 h-4 mr-3" /> Milestones
//                         </h2>
//                         <div className="space-y-3">
//                             {data.milestones.length > 0 ? data.milestones.map((ach: any, i: number) => (
//                                 <div key={i} className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center text-[11px] font-bold text-zinc-300">
//                                     <Trophy size={14} className="mr-3 text-amber-500 shrink-0" />
//                                     {typeof ach === 'object' ? (ach.name || ach.achievement || ach.milestone) : ach}
//                                 </div>
//                             )) : <p className="text-[10px] text-zinc-700 italic">No achievements detected.</p>}
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         </div>
//     );
// }




















"use client";
import React, { useEffect, useState } from 'react';
import {
    CheckCircle, Folder, Trophy, Activity,
    Star, Award, ShieldCheck, GraduationCap, 
    Network, BookOpen, ExternalLink, Loader2,
    Cpu, Zap, Fingerprint
} from 'lucide-react';

export default function PortfolioPage() {
    const [data, setData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const gitSync = localStorage.getItem('user_profile');
            const resumeAi = localStorage.getItem('user_resume_data');
            const regForm = localStorage.getItem('user_registration');

            const gitData = gitSync ? JSON.parse(gitSync) : {};
            const resumeData = resumeAi ? JSON.parse(resumeAi) : {};
            const regData = regForm ? JSON.parse(regForm) : {};

            setData({
                ...gitData,
                displayName: regData.name || gitData.name || "Maulik Mhatre",
                skills: resumeData.skills || gitData.topLanguages || [],
                certifications: resumeData.certifications || [],
                milestones: resumeData.milestones || [],
                allProjects: [...(gitData.topProjects || [])].slice(0, 6)
            });
        }
    }, []);

    if (!mounted || !data) return <div className="bg-[#050505] h-screen" />;

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500/30 pb-40">
            
            {/* --- AMBIENT BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[140px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto pt-40 px-6 space-y-16">

                {/* --- 1. IMPACT HEADER (MAX VISIBILITY) --- */}
                <header className="relative p-12 md:p-16 rounded-[4rem] border border-zinc-800 bg-zinc-900/10 backdrop-blur-3xl overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Fingerprint size={240} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                            <img src={data.avatarUrl} className="w-full h-full rounded-full object-cover bg-black border-8 border-black" alt="Avatar" />
                        </div>
                        <div className="text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
                                        {data.displayName}
                                    </h1>
                                    <span className="text-xs font-black uppercase tracking-widest px-5 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full shadow-lg">
                                        Verified_Node
                                    </span>
                                </div>
                                <p className="text-zinc-400 font-mono text-base md:text-lg tracking-[0.4em] uppercase font-bold pt-2">
                                    {data.displayCollege} <span className="text-zinc-800 mx-2">//</span> {data.displayMajor || "Computer Engineering"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- 2. BENTO GRID MATRIX --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    
                    {/* --- SKILLS (ENHANCED LEGIBILITY) --- */}
                    <div className="md:col-span-4 bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-10 hover:border-indigo-500/30 transition-all shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 mb-12 flex items-center gap-3">
                            <Cpu size={18} className="text-indigo-500" /> Technical Vector
                        </h3>
                        <div className="space-y-10">
                            {data.skills.map((skill: any, i: number) => {
                                const name = skill.name || (Array.isArray(skill) ? skill[0] : "Asset");
                                const val = skill.level || (Array.isArray(skill) ? skill[1] * 10 : 50);
                                return (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-between text-sm font-black uppercase text-zinc-200 tracking-widest">
                                            <span>{name}</span>
                                            <span className="text-indigo-400 font-mono">{val}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" style={{ width: `${val}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- PROJECTS (BIG TITLES) --- */}
                    <div className="md:col-span-8 bg-zinc-900/10 border border-zinc-800 rounded-[3rem] p-12">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 mb-12 flex items-center gap-3">
                            <Folder size={18} className="text-indigo-500" /> Proof of Work
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {data.allProjects.map((proj: any, i: number) => (
                                <div key={i} className="group p-8 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] hover:bg-zinc-800/30 hover:border-indigo-500/40 transition-all shadow-lg">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-black text-2xl text-zinc-100 group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter">
                                            {proj.name}
                                        </h4>
                                        <div className="p-2 bg-amber-500/10 rounded-lg">
                                            <Star size={16} className="text-amber-500 fill-amber-500" />
                                        </div>
                                    </div>
                                    <p className="text-base text-zinc-400 leading-relaxed font-medium line-clamp-3 mb-8">
                                        "{proj.description}"
                                    </p>
                                    <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600 font-mono">{proj.language}</span>
                                        <a href={proj.url} className="text-zinc-500 hover:text-white transition-colors">
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- CERTS (HIGH-CONTRAST) --- */}
                    <div className="md:col-span-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[3rem] p-12 group hover:border-emerald-500/30 transition-all">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-emerald-500 mb-10 flex items-center gap-3">
                            <ShieldCheck size={18} /> Verified Credentials
                        </h3>
                        <div className="grid gap-6">
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i} className="flex items-center gap-6 p-6 bg-black/40 rounded-3xl border border-zinc-800 group-hover:border-emerald-500/20 transition-all">
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 shadow-inner">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold text-white tracking-tight">{typeof cert === 'object' ? (cert.name || cert.certificate_name) : cert}</div>
                                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">
                                            {typeof cert === 'object' ? cert.issuer : "Authenticated Source"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- MILESTONES (BOLD TIMELINE) --- */}
                    <div className="md:col-span-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-[3rem] p-12 group hover:border-amber-500/30 transition-all">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-amber-500 mb-10 flex items-center gap-3">
                            <Trophy size={18} /> Major Milestones
                        </h3>
                        <div className="space-y-10 relative pl-6">
                            <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-zinc-800" />
                            {data.milestones.map((ach: any, i: number) => (
                                <div key={i} className="relative flex items-center gap-8">
                                    <div className="w-3 h-3 rounded-full bg-zinc-950 border-2 border-amber-500 z-10 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all" />
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-zinc-100 uppercase tracking-tighter leading-none">
                                            {typeof ach === 'object' ? (ach.name || ach.achievement) : ach}
                                        </p>
                                        <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-widest">VERIFIED_ACHIEVEMENT // 2026.ID</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}