"use client";
import React, { useEffect, useState } from 'react';
import {
    CheckCircle, Folder, Trophy, Activity,
    Star, Award, ShieldCheck, BookOpen, ExternalLink, 
    Cpu, Fingerprint
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

            // --- DATA NORMALIZATION LAYER (THE FIX) ---
            setData({
                ...gitData,
                // PRIORITY: 1. AI Resume Name | 2. Form Name | 3. GitHub Name
                displayName: resumeData.name || regData.name || gitData.name || "Maulik Mhatre",
                
                displayCollege: regData.college || "D.J. Sanghvi College of Engineering",
                displayMajor: regData.major || resumeData.devType || "Computer Engineering",
                
                // SKILLS: Prioritize AI extraction
                skills: resumeData.skills || resumeData.extractedSkills || gitData.topLanguages || [],
                
                // CERTS: Handle multiple key possibilities
                certifications: resumeData.certifications || resumeData.certs || [],
                
                // MILESTONES: Explicitly check the key from your Python backend
                milestones: resumeData.majorMilestones || resumeData.milestones || resumeData.achievements || [],
                
                allProjects: [...(gitData.topProjects || [])].slice(0, 6),
                trustScore: resumeData.atsScore || "92"
            });
        }
    }, []);

    if (!mounted || !data) return <div className="bg-[#050505] h-screen" />;

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500/30 pb-40">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[140px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto pt-40 px-6 space-y-16">
                {/* --- IDENTITY HEADER --- */}
                <header className="relative p-12 md:p-16 rounded-[4rem] border border-zinc-800 bg-zinc-900/10 backdrop-blur-3xl overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Fingerprint size={240} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                            <img src={data.avatarUrl || `https://ui-avatars.com/api/?name=${data.displayName}&background=0D8ABC&color=fff`} className="w-full h-full rounded-full object-cover bg-black border-8 border-black" alt="Avatar" />
                        </div>
                        <div className="text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
                                        {data.displayName}
                                    </h1>
                                    <span className="text-xs font-black uppercase tracking-widest px-5 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                        Verified_Node
                                    </span>
                                </div>
                                <p className="text-zinc-400 font-mono text-base md:text-lg tracking-[0.4em] uppercase font-bold pt-2">
                                    {data.displayCollege} <span className="text-zinc-800 mx-2">//</span> {data.displayMajor}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* TECHNICAL VECTOR */}
                    <div className="md:col-span-4 bg-zinc-900/10 border border-zinc-800 rounded-[3.5rem] p-10 shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 mb-12 flex items-center gap-3">
                            <Cpu size={18} className="text-indigo-500" /> Technical Vector
                        </h3>
                        <div className="space-y-10">
                            {data.skills.map((skill: any, i: number) => {
                                const name = skill.name || (Array.isArray(skill) ? skill[0] : "Asset");
                                const val = skill.level || (Array.isArray(skill) ? (skill[1] > 10 ? skill[1] : skill[1] * 10) : 85);
                                return (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-between text-sm font-black uppercase text-zinc-200 tracking-widest">
                                            <span>{name}</span>
                                            <span className="text-indigo-400 font-mono">{val}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-1000" style={{ width: `${val}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PROJECTS */}
                    <div className="md:col-span-8 bg-zinc-900/10 border border-zinc-800 rounded-[3.5rem] p-12">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 mb-12 flex items-center gap-3">
                            <Folder size={18} className="text-indigo-500" /> Proof of Work
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {data.allProjects.map((proj: any, i: number) => (
                                <div key={i} className="group p-8 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] hover:border-indigo-500/40 transition-all shadow-lg">
                                    <h4 className="font-black text-2xl text-zinc-100 group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter mb-4">
                                        {proj.name}
                                    </h4>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium line-clamp-3 mb-8 italic">
                                        "{proj.description}"
                                    </p>
                                    <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600 font-mono">{proj.language || "ASM_CORE"}</span>
                                        <ExternalLink size={18} className="text-zinc-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CERTIFICATIONS */}
                    <div className="md:col-span-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[3rem] p-12">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-emerald-500 mb-10 flex items-center gap-3">
                            <ShieldCheck size={18} /> Credentials
                        </h3>
                        <div className="grid gap-4">
                            {data.certifications.map((cert: any, i: number) => (
                                <div key={i} className="flex items-center gap-5 p-5 bg-black/40 rounded-3xl border border-zinc-800">
                                    <BookOpen size={20} className="text-emerald-500" />
                                    <span className="text-base font-bold text-white tracking-tight">
                                        {typeof cert === 'object' ? (cert.name || cert.certificate_name) : cert}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MILESTONES (FIXED RENDER) */}
                    <div className="md:col-span-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-[3rem] p-12">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-amber-500 mb-10 flex items-center gap-3">
                            <Trophy size={18} /> Major Milestones
                        </h3>
                        <div className="space-y-8 relative pl-6">
                            <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-zinc-800" />
                            {data.milestones.map((ach: any, i: number) => (
                                <div key={i} className="relative flex items-center gap-8">
                                    <div className="w-3 h-3 rounded-full bg-zinc-950 border-2 border-amber-500 z-10 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                                    <p className="text-lg font-black text-zinc-100 uppercase tracking-tighter leading-none">
                                        {typeof ach === 'object' ? (ach.name || ach.achievement || ach.milestone) : ach}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}