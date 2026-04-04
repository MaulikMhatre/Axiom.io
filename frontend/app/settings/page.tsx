"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Github, RefreshCw, Loader2, CheckCircle, ArrowLeft,
    User, Briefcase, Trash2, Save, FileText, UploadCloud, Edit2, X, Linkedin
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();

    // --- State Management ---
    const [github, setGithub] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [msg, setMsg] = useState('');

    const [profileData, setProfileData] = useState({ name: '', college: '', major: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [resumeMsg, setResumeMsg] = useState('');

    const [isUploadingLinkedin, setIsUploadingLinkedin] = useState(false);
    const [linkedinMsg, setLinkedinMsg] = useState('');

    const [manualProjects, setManualProjects] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        name: '', description: '', language: '', author: '', collaborators: '', videoUrl: ''
    });

    // --- Initialization ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setGithub(localStorage.getItem('gh_username') || '');
            const regData = JSON.parse(localStorage.getItem('user_registration') || '{}');
            setProfileData({ 
                name: regData.name || '', 
                college: regData.college || '', 
                major: regData.major || '' 
            });
            setManualProjects(JSON.parse(localStorage.getItem('manual_projects') || '[]'));
        }
    }, []);

    // --- GitHub Sync Logic ---
    const syncIdentity = async () => {
        if (!github) return;
        setIsSyncing(true);
        try {
            const userEmail = localStorage.getItem('user_email') || '';
            const resp = await fetch(`http://localhost:8000/api/github/${github}?email=${userEmail}`);
            const data = await resp.json();
            if (typeof window !== 'undefined') {
                localStorage.setItem('gh_username', github);
                localStorage.setItem('user_profile', JSON.stringify(data));
                if (data.name) setProfileData(prev => ({ ...prev, name: data.name }));
            }
            setMsg(`Synced identity for ${github}!`);
            setTimeout(() => setMsg(''), 3000);
        } catch (e) {
            setMsg('Sync Failed.');
        } finally {
            setIsSyncing(false);
        }
    };

    // --- Profile Persistence ---
    const handleProfileSave = () => {
        setIsSavingProfile(true);
        setTimeout(() => {
            if (typeof window !== 'undefined') {
                const existing = JSON.parse(localStorage.getItem('user_registration') || '{}');
                localStorage.setItem('user_registration', JSON.stringify({ ...existing, ...profileData }));
            }
            setIsSavingProfile(false);
        }, 800);
    };

    // --- Resume AI Parsing ---
    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingResume(true);
        setResumeMsg('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', localStorage.getItem('user_email') || '');

        try {
            const response = await fetch('http://localhost:8000/api/upload-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("Resume parsing failed");
            const data = await response.json();

            if (typeof window !== 'undefined') {
                localStorage.setItem('user_resume_data', JSON.stringify(data));
                const updatedProfile = {
                    name: data.name || profileData.name,
                    college: data.college || data.education?.[0]?.institution || profileData.college,
                    major: data.major || data.education?.[0]?.degree || profileData.major
                };
                setProfileData(updatedProfile);
                
                const existingReg = JSON.parse(localStorage.getItem('user_registration') || '{}');
                localStorage.setItem('user_registration', JSON.stringify({ ...existingReg, ...updatedProfile }));
            }
            setResumeMsg('Resume parsed! Profile auto-filled.');
            setTimeout(() => setResumeMsg(''), 4000);
        } catch (err) {
            setResumeMsg('Failed to read PDF.');
        } finally {
            setIsUploadingResume(false);
        }
    };

    // --- LinkedIn AI Sync & Audit ---
    const handleLinkedinUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setIsUploadingLinkedin(true);
        setLinkedinMsg('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', localStorage.getItem('user_email') || '');

        try {
            const response = await fetch('http://localhost:8000/api/upload-linkedin', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("LinkedIn parsing failed");
            const data = await response.json();

            if (typeof window !== 'undefined') {
                // 1. Store for general profile persistence
                localStorage.setItem('user_linkedin_data', JSON.stringify(data));
                
                // 2. Store specifically for the Audit Page
                localStorage.setItem('linkedin_audit_data', JSON.stringify(data));

                // 3. Update the global registration
                const updatedProfile = {
                    name: data.name || profileData.name,
                    college: data.education?.[0]?.institution || data.college || profileData.college,
                    major: data.education?.[0]?.degree || data.education?.[0]?.field || profileData.major
                };
                setProfileData(updatedProfile);
                const existingReg = JSON.parse(localStorage.getItem('user_registration') || '{}');
                localStorage.setItem('user_registration', JSON.stringify({ ...existingReg, ...updatedProfile }));

                // 4. Redirect to analysis page
                router.push('/linkedin');
            }
        } catch (err) {
            setLinkedinMsg('Failed to sync LinkedIn.');
        } finally {
            setIsUploadingLinkedin(false);
        }
    };

    // --- Project Management Logic ---
    const deleteProject = (index: number) => {
        const updated = manualProjects.filter((_, i) => i !== index);
        setManualProjects(updated);
        localStorage.setItem('manual_projects', JSON.stringify(updated));
    };

    const startEditing = (index: number, project: any) => {
        setEditingIndex(index);
        setEditForm({
            name: project.name || '',
            description: project.description || '',
            language: project.language || '',
            author: project.author || '',
            collaborators: project.collaborators || '',
            videoUrl: project.videoUrl || ''
        });
    };

    const saveProjectEdit = () => {
        if (editingIndex === null) return;
        const updated = [...manualProjects];
        updated[editingIndex] = { ...updated[editingIndex], ...editForm };
        setManualProjects(updated);
        localStorage.setItem('manual_projects', JSON.stringify(updated));
        setEditingIndex(null);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-background selection:bg-indigo-500/30">
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pt-32 pb-20 px-8 text-foreground">
                
                <button onClick={() => router.back()} className="flex items-center text-zinc-800 dark:text-zinc-300 hover:text-indigo-600 dark:text-indigo-400 mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <h1 className="text-4xl font-black text-foreground dark:text-white mb-2 tracking-tight">Identity Settings</h1>
                <p className="text-zinc-800 dark:text-zinc-300 mb-10 font-light">Manage your connected accounts, academic profile, and portfolio.</p>

                <div className="space-y-6">
                    
                    {/* Top Row: AI Sync Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resume Sync */}
                        <div className="bg-zinc-100/50 dark:bg-white/5 border border-border backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-emerald-500/30 group">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                                    <div><h3 className="text-lg font-extrabold text-foreground dark:text-white">AI Resume Sync</h3><p className="text-base text-zinc-800 dark:text-zinc-300">Auto-fill Profile & Skills.</p></div>
                                </div>
                                <label className={`mt-auto w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl font-extrabold flex items-center justify-center transition-all border border-emerald-500/20 cursor-pointer ${isUploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploadingResume ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                    {isUploadingResume ? 'Parsing...' : 'Upload PDF'}
                                    <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
                                </label>
                                {resumeMsg && <p className="mt-3 text-emerald-600 dark:text-emerald-400 text-base text-center font-bold uppercase tracking-wider animate-pulse">{resumeMsg}</p>}
                            </div>
                        </div>

                        {/* LinkedIn Sync */}
                        <div className="bg-zinc-100/50 dark:bg-white/5 border border-border backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-blue-500/30 group">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform"><Linkedin className="w-6 h-6" /></div>
                                    <div><h3 className="text-lg font-extrabold text-foreground dark:text-white">LinkedIn Audit</h3><p className="text-base text-zinc-800 dark:text-zinc-300">Sync & Analyze Profile.</p></div>
                                </div>
                                <label className={`mt-auto w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-xl font-extrabold flex items-center justify-center transition-all border border-blue-500/20 cursor-pointer ${isUploadingLinkedin ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploadingLinkedin ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                    {isUploadingLinkedin ? 'Syncing...' : 'Upload PDF'}
                                    <input type="file" accept="application/pdf" className="hidden" onChange={handleLinkedinUpload} />
                                </label>
                                {linkedinMsg && <p className="mt-3 text-blue-600 dark:text-blue-400 text-base text-center font-bold uppercase tracking-wider animate-pulse">{linkedinMsg}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Personal Profile Section */}
                    <div className="bg-zinc-100/50 dark:bg-white/5 border border-border backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20"><User className="w-6 h-6" /></div>
                                <h3 className="text-xl font-extrabold text-foreground dark:text-white">Academic Profile</h3>
                            </div>
                            <button onClick={handleProfileSave} disabled={isSavingProfile} className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-5 py-2.5 rounded-xl font-extrabold flex items-center transition-all border border-purple-500/20 shadow-lg shadow-purple-500/10">
                                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className="text-base uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-300 ml-1 block font-extrabold">Full Identity Name</label>
                                <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full bg-background/40 border border-border shadow-sm rounded-xl px-4 py-3.5 text-foreground dark:text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-700" placeholder="Full Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-base uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-300 ml-1 block font-extrabold">Institution</label>
                                    <input value={profileData.college} onChange={(e) => setProfileData({ ...profileData, college: e.target.value })} className="w-full bg-background/40 border border-border shadow-sm rounded-xl px-4 py-3.5 text-foreground dark:text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all" placeholder="University Name" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-base uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-300 ml-1 block font-extrabold">Major</label>
                                    <input value={profileData.major} onChange={(e) => setProfileData({ ...profileData, major: e.target.value })} className="w-full bg-background/40 border border-border shadow-sm rounded-xl px-4 py-3.5 text-foreground dark:text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all" placeholder="Course of Study" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manage Projects Section */}
                    <div className="bg-zinc-100/50 dark:bg-white/5 border border-border backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20"><Briefcase className="w-6 h-6" /></div>
                            <div><h3 className="text-xl font-extrabold text-foreground dark:text-white">Project Portfolio</h3><p className="text-base text-zinc-800 dark:text-zinc-300">Edit or curate your showcased work.</p></div>
                        </div>

                        <div className="space-y-4">
                            {manualProjects.length > 0 ? manualProjects.map((project: any, index: number) => (
                                <div key={index}>
                                    {editingIndex === index ? (
                                        <div className="bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/30 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="bg-black/60 border border-border rounded-xl px-4 py-2.5 text-base text-foreground dark:text-white focus:border-indigo-500 outline-none" placeholder="Project Name" />
                                                <input value={editForm.language} onChange={(e) => setEditForm({ ...editForm, language: e.target.value })} className="bg-black/60 border border-border rounded-xl px-4 py-2.5 text-base text-foreground dark:text-white focus:border-indigo-500 outline-none" placeholder="Tech Stack (e.g. React, Python)" />
                                            </div>
                                            <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-black/60 border border-border rounded-xl px-4 py-2.5 text-base text-foreground dark:text-white resize-none focus:border-indigo-500 outline-none mb-4" rows={3} placeholder="Project description..." />
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setEditingIndex(null)} className="flex items-center text-base font-extrabold text-slate-400 hover:text-foreground dark:text-white px-4 py-2 rounded-xl bg-zinc-100/50 dark:bg-white/5 transition-colors"><X className="w-3 h-3 mr-1" /> Cancel</button>
                                                <button onClick={saveProjectEdit} className="flex items-center text-base font-extrabold text-foreground dark:text-white px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"><Save className="w-3 h-3 mr-1" /> Update Project</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center bg-white/50 dark:bg-black/30 p-5 rounded-2xl border border-border shadow-sm group hover:border-indigo-500/30 transition-all hover:bg-background/50">
                                            <div>
                                                <h4 className="font-extrabold text-foreground dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{project.name}</h4>
                                                <p className="text-base text-zinc-800 dark:text-zinc-300 uppercase tracking-widest mt-1 font-semibold">{project.language || 'General Project'}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button onClick={() => startEditing(index, project)} className="text-slate-400 hover:text-indigo-600 dark:text-indigo-400 p-2.5 bg-zinc-100/50 dark:bg-white/5 hover:bg-indigo-500/10 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => deleteProject(index)} className="text-red-400 hover:text-red-300 p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-12 border-2 border-dashed border-white dark:border-black shadow-lg dark:shadow-none/5 dark:border-white/5 rounded-3xl bg-background/20">
                                    <p className="text-base text-slate-600">No manual projects added to your portfolio.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GitHub Integration Card */}
                    <div className="bg-zinc-100/50 dark:bg-white/5 border border-border backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-indigo-500/20">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"><Github className="w-6 h-6" /></div>
                            <div><h3 className="text-xl font-extrabold text-foreground dark:text-white">GitHub Connection</h3><p className="text-base text-zinc-800 dark:text-zinc-300">Sync repositories and contributions.</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-base">github.com/</span>
                                <input value={github} onChange={(e) => setGithub(e.target.value)} className="w-full bg-background/50 border border-border shadow-sm rounded-xl pl-[5.5rem] pr-4 py-4 text-foreground dark:text-white focus:border-indigo-500 outline-none transition-all" placeholder="username" />
                            </div>
                            <button onClick={syncIdentity} disabled={isSyncing} className="bg-indigo-500 hover:bg-indigo-600 px-10 rounded-xl font-black flex items-center text-foreground dark:text-white transition-all border border-indigo-400/20 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50">
                                {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" /> Sync</>}
                            </button>
                        </div>
                        {msg && <div className="mt-6 text-emerald-600 dark:text-emerald-400 font-extrabold text-base flex items-center bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20 w-fit animate-in slide-in-from-top-2"><CheckCircle className="w-4 h-4 mr-2" /> {msg}</div>}
                    </div>

                </div>
            </div>
        </div>
    );
}