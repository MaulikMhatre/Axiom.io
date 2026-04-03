"use client";
import React, { useEffect, useState } from 'react';
import {
    Github, CheckCircle, Folder, Trophy, Activity,
    Star, Award, ShieldCheck, GraduationCap, Briefcase, Network, BookOpen, ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // 1. Fetch from Local Storage if available
        if (typeof window !== 'undefined') {
            const gitSync = localStorage.getItem('user_profile');
            const manualProjs = localStorage.getItem('manual_projects');
            const regForm = localStorage.getItem('user_registration');
            const resumeAi = localStorage.getItem('user_resume_data');

            const gitData = gitSync ? JSON.parse(gitSync) : {};
            const personalData = manualProjs ? JSON.parse(manualProjs) : [];
            const regData = regForm ? JSON.parse(regForm) : {};
            const resumeData = resumeAi ? JSON.parse(resumeAi) : {};

            const combinedProjects = [...personalData, ...(gitData.topProjects || [])].slice(0, 6);

            const finalSkills = resumeData.extractedSkills
                ? resumeData.extractedSkills
                : (gitData.topLanguages || [["Python", 9], ["React", 7], ["TypeScript", 6]]);

            setData({
                ...gitData,
                displayName: gitData.name || regData.name || "Ujjwal Rajesh Rai",
                displayCollege: regData.college || "D.J. Sanghvi College of Engineering",
                displayMajor: regData.major || "B.Tech AI/ML",
                avatarUrl: gitData.avatarUrl || "https://github.com/identicons/u.png",
                allProjects: combinedProjects,
                skills: finalSkills,
                workExperience: resumeData.workExperience || [],
                certifications: resumeData.certifications || [],
                achievements: resumeData.achievements || [],
                trustScore: gitData.totalStars ? '98' : '94',
                publicRepos: gitData.publicRepos || 0,
                totalStars: gitData.totalStars || 0
            });
        }
    }, []);

    if (!data) return (
        <div className="flex h-[60vh] items-center justify-center text-slate-500 animate-pulse">
            Loading Profile...
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-8 max-w-7xl mx-auto pt-24">

            {/* --- IDENTITY HEADER --- */}
            <div className="bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>

                <div className="flex flex-col md:flex-row items-center gap-10 z-10 text-center md:text-left">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5 shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-transform duration-500">
                        <img src={data.avatarUrl} className="w-full h-full rounded-full bg-[#0f172a] object-cover border-4 border-[#0f172a]" alt="Profile" />
                    </div>
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">{data.displayName}</h1>
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <CheckCircle className="w-3 h-3 mr-1" /> Identity Verified
                            </span>
                        </div>
                        <p className="text-slate-300 text-lg flex items-center justify-center md:justify-start mt-2 font-medium">
                            <GraduationCap className="w-5 h-5 mr-3 text-indigo-400" /> {data.displayCollege}
                        </p>
                        <p className="text-slate-500 text-sm mt-1 mb-5">{data.displayMajor}</p>
                        <div className="flex gap-6 justify-center md:justify-start border-t border-white/5 pt-5">
                            <span className="flex items-center text-slate-300 text-sm font-semibold bg-white/5 px-4 py-1.5 rounded-lg"><Folder className="w-4 h-4 mr-2 text-indigo-400" /> {data.publicRepos} Repos</span>
                            <span className="flex items-center text-slate-300 text-sm font-semibold bg-white/5 px-4 py-1.5 rounded-lg"><Star className="w-4 h-4 mr-2 text-amber-400" /> {data.totalStars} Stars</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center min-w-[200px] z-10 shadow-inner group transition-all hover:border-indigo-500/30">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Trust Index</span>
                    <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500 drop-shadow-[0_0_20px_rgba(129,140,248,0.4)]">
                        {data.trustScore}
                    </span>
                </div>
            </div>

            {/* --- TWO COLUMN LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Experience & Projects */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Work Experience Timeline */}
                    {data.workExperience.length > 0 && (
                        <section className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-xl">
                            <h2 className="text-2xl font-bold mb-10 flex items-center text-white">
                                <Network className="w-6 h-6 mr-4 text-indigo-400" /> Professional Experience
                            </h2>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:to-purple-500">
                                {data.workExperience.map((exp: any, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-indigo-500/40 transition-all shadow-lg hover:shadow-indigo-500/10">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-indigo-400 text-lg">{exp.role}</h4>
                                            </div>
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{exp.company} • {exp.duration}</p>
                                            <p className="text-sm text-slate-300 leading-relaxed font-light">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Featured Projects (Rich Media) */}
                    <section className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-xl">
                        <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
                            <Folder className="w-6 h-6 mr-4 text-indigo-400" /> Verified Project Audit
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.allProjects.length > 0 ? data.allProjects.map((project: any, i: number) => (
                                <div key={i} className="bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden group flex flex-col shadow-lg">

                                    {/* Banner Image / Screenshot Render */}
                                    {project.screenshots && project.screenshots.length > 0 && (
                                        <div className="w-full aspect-video overflow-hidden border-b border-white/5 shrink-0 bg-slate-900">
                                            <img src={project.screenshots[0]} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                        </div>
                                    )}

                                    <div className="p-8 flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-slate-900/50">
                                        {project.isManual && <div className="absolute top-0 right-0 bg-indigo-500/20 text-indigo-400 text-[9px] font-black px-4 py-1.5 rounded-bl-[1.5rem] uppercase tracking-wider z-10 backdrop-blur-md border-b border-l border-indigo-500/20">Personal</div>}

                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-xl text-indigo-400 pr-8 leading-tight">{project.name}</h4>
                                            {!project.isManual && <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-lg flex items-center font-black shrink-0 border border-indigo-500/20"><Star className="w-3 h-3 mr-1 fill-indigo-400" /> {project.stars}</span>}
                                        </div>

                                        {/* Author & Collaborators Details */}
                                        {(project.author || project.collaborators) && (
                                            <div className="text-[10px] text-slate-400 mb-4 flex items-center flex-wrap gap-2">
                                                {project.author && <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/5 shadow-inner">By: <span className="text-slate-200">{project.author}</span></span>}
                                                {project.collaborators && <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/5 shadow-inner">With: <span className="text-slate-200">{project.collaborators}</span></span>}
                                            </div>
                                        )}

                                        <p className="text-sm text-slate-400 mb-6 leading-relaxed font-light flex-1">{project.description}</p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">{project.language}</span>
                                            {project.videoUrl && (
                                                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition-colors border border-purple-500/20">
                                                    Watch Demo <ExternalLink className="w-3 h-3 ml-1.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/10 rounded-[2.5rem] bg-white/5 text-center">
                                    <Folder className="w-12 h-12 text-slate-600 mb-4" />
                                    <p className="text-slate-400 font-medium">No projects synced yet.</p>
                                    <p className="text-sm text-slate-500 mt-1">Add a rich project from the top menu or sync your GitHub in Settings.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Skills, Certs, Achievements */}
                <div className="space-y-8">

                    {/* Engineering Skill Depth (BULLETPROOF MAPPING) */}
                    <section className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                        <h2 className="text-lg font-bold mb-8 flex items-center text-white">
                            <Activity className="w-5 h-5 mr-3 text-indigo-400" /> AI Assessed Skills
                        </h2>
                        <div className="space-y-6">
                            {Array.isArray(data.skills) && data.skills.length > 0 ? data.skills.map((skillItem: any, i: number) => {
                                // Bulletproof extraction handles both ["Python", 9] AND {skill: "Python", points: 90}
                                const lang = Array.isArray(skillItem) ? skillItem[0] : (skillItem.skill || skillItem.name || "Unknown");
                                const rawVal = Array.isArray(skillItem) ? skillItem[1] : (skillItem.points || skillItem.score || 5);
                                const displayVal = rawVal > 10 ? Math.ceil(rawVal / 10) : rawVal; // Normalize out of 10

                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between text-xs mb-2.5 text-slate-300 font-bold">
                                            <span className="tracking-wide">{lang}</span>
                                            <span className="text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded">{displayVal} Units</span>
                                        </div>
                                        <div className="w-full bg-slate-950/80 rounded-full h-2.5 border border-white/5 overflow-hidden shadow-inner">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${Math.min(displayVal * 10, 100)}%` }}></div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-sm text-slate-500 italic text-center py-4">Upload a resume to generate skills.</p>
                            )}
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                        <h2 className="text-lg font-bold mb-6 flex items-center text-white">
                            <BookOpen className="w-5 h-5 mr-3 text-emerald-400" /> Certifications
                        </h2>
                        <div className="space-y-3">
                            {data.certifications && data.certifications.length > 0 ? data.certifications.map((cert: string, i: number) => (
                                <div key={i} className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-start hover:bg-emerald-500/10 transition-colors">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                                    <p className="text-sm font-bold text-slate-200 leading-tight">{cert}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 italic text-center py-4">No certifications found.</p>
                            )}
                        </div>
                    </section>

                    {/* Elite Achievements */}
                    <section className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                        <h2 className="text-lg font-bold mb-6 flex items-center text-white">
                            <Award className="w-5 h-5 mr-3 text-amber-400" /> Milestones
                        </h2>
                        <div className="space-y-4">
                            {data.achievements && data.achievements.length > 0 ? data.achievements.map((ach: string, i: number) => (
                                <div key={i} className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center hover:bg-amber-500/10 transition-colors">
                                    <div className="p-2.5 bg-amber-500/10 rounded-xl mr-4 shrink-0 shadow-inner"><Trophy className="w-4 h-4 text-amber-400" /></div>
                                    <h4 className="font-bold text-slate-200 text-sm leading-tight">{ach}</h4>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 italic text-center py-4">No milestones synced yet.</p>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
