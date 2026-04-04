"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Github, RefreshCw, Loader2, CheckCircle, ArrowLeft,
    User, Briefcase, Trash2, Save, FileText, UploadCloud, Edit2, X, Linkedin, Target
} from 'lucide-react';

import { useTheme } from 'next-themes';

export default function SettingsPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // --- State Management ---
    const [github, setGithub] = useState('');
    const [leetcode, setLeetcode] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSyncingLeet, setIsSyncingLeet] = useState(false);
    const [msg, setMsg] = useState('');
    const [leetMsg, setLeetMsg] = useState('');

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
            const userEmail = localStorage.getItem('user_email') || '';
            
            // GitHub stays localStorage-only as requested
            setGithub(localStorage.getItem('gh_username') || '');
            
            // LeetCode uses DB sync
            const localLC = localStorage.getItem('lc_username');
            if (localLC) setLeetcode(localLC);

            if (userEmail) {
                fetch(`http://localhost:8000/api/me?email=${userEmail}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.leetcode?.username) {
                            setLeetcode(data.leetcode.username);
                            localStorage.setItem('lc_username', data.leetcode.username);
                        }
                    })
                    .catch(e => console.error("Identity Fetch Error:", e));
            }

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

    const syncLeetCode = async () => {
        if (!leetcode) return;
        setIsSyncingLeet(true);
        setLeetMsg('');
        try {
            const userEmail = localStorage.getItem('user_email') || '';
            const resp = await fetch(`http://localhost:8000/api/leetcode/${leetcode}?email=${userEmail}`);
            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.detail || 'Sync Failed');
            }
            const data = await resp.json();
            if (typeof window !== 'undefined') {
                localStorage.setItem('lc_username', leetcode);
                localStorage.setItem('user_leetcode_data', JSON.stringify(data));
            }
            setLeetMsg(`Successfully synced ${leetcode}!`);
            setTimeout(() => setLeetMsg(''), 4000);
        } catch (e: any) {
            setLeetMsg(e.message || 'Sync Failed.');
        } finally {
            setIsSyncingLeet(false);
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
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020202] selection:bg-indigo-500/30">
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
                        <div className={`border rounded-3xl p-8 transition-all group
                            ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex flex-col h-full">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold'}`}><FileText className="w-6 h-6" /></div>
                                    <div><h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Resume Sync</h3><p className="text-sm text-slate-500">Auto-fill Profile & Skills.</p></div>
                                </div>
                                <label className={`mt-auto w-full px-4 py-3 rounded-xl font-bold flex items-center justify-center transition-all border cursor-pointer 
                                    ${isDark ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/20' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'} 
                                    ${isUploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploadingResume ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                    {isUploadingResume ? 'Parsing...' : 'Upload PDF'}
                                    <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
                                </label>
                                {resumeMsg && <p className="mt-3 text-emerald-600 dark:text-emerald-400 text-xs text-center font-bold uppercase tracking-wider animate-pulse">{resumeMsg}</p>}
                            </div>
                        </div>

                        {/* LinkedIn Sync */}
                        <div className={`border rounded-3xl p-8 transition-all group
                            ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex flex-col h-full">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100 font-bold'}`}><Linkedin className="w-6 h-6" /></div>
                                    <div><h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LinkedIn Audit</h3><p className="text-sm text-slate-500">Sync & Analyze Profile.</p></div>
                                </div>
                                <label className={`mt-auto w-full px-4 py-3 rounded-xl font-bold flex items-center justify-center transition-all border cursor-pointer
                                    ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'}
                                    ${isUploadingLinkedin ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploadingLinkedin ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                    {isUploadingLinkedin ? 'Syncing...' : 'Upload PDF'}
                                    <input type="file" accept="application/pdf" className="hidden" onChange={handleLinkedinUpload} />
                                </label>
                                {linkedinMsg && <p className="mt-3 text-blue-600 dark:text-blue-400 text-xs text-center font-bold uppercase tracking-wider animate-pulse">{linkedinMsg}</p>}
                            </div>
                        </div>
                    </div>

                    <div className={`border rounded-3xl p-8 transition-all
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className={`p-4 rounded-2xl ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}><User className="w-6 h-6" /></div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Academic Profile</h3>
                            </div>
                            <button onClick={handleProfileSave} disabled={isSavingProfile} className={`px-5 py-2.5 rounded-xl font-bold flex items-center transition-all border
                                ${isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}>
                                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className={`text-xs uppercase tracking-widest ml-1 block font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Full Identity Name</label>
                                <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-1 outline-none transition-all
                                    ${isDark ? 'bg-black/40 border-white/10 text-white focus:ring-purple-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-slate-400'}`} placeholder="Full Name" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={`text-xs uppercase tracking-widest ml-1 block font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Institution</label>
                                    <input value={profileData.college} onChange={(e) => setProfileData({ ...profileData, college: e.target.value })} className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-1 outline-none transition-all
                                        ${isDark ? 'bg-black/40 border-white/10 text-white focus:ring-purple-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-slate-400'}`} placeholder="University Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-xs uppercase tracking-widest ml-1 block font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Major</label>
                                    <input value={profileData.major} onChange={(e) => setProfileData({ ...profileData, major: e.target.value })} className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-1 outline-none transition-all
                                        ${isDark ? 'bg-black/40 border-white/10 text-white focus:ring-purple-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-slate-400'}`} placeholder="Course of Study" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manage Projects Section */}
                    <div className={`border rounded-3xl p-8 transition-all
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className={`p-4 rounded-2xl ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600 border border-amber-100 font-bold'}`}><Briefcase className="w-6 h-6" /></div>
                            <div><h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Project Portfolio</h3><p className="text-sm text-slate-500">Edit or curate your showcased work.</p></div>
                        </div>

                        <div className="space-y-4">
                            {manualProjects.length > 0 ? manualProjects.map((project: any, index: number) => (
                                <div key={index}>
                                    {editingIndex === index ? (
                                        <div className={`p-6 rounded-3xl border animate-in fade-in zoom-in-95 duration-300
                                            ${isDark ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-slate-50 border-indigo-100'}`}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={`border rounded-xl px-4 py-2 text-sm outline-none transition-all
                                                    ${isDark ? 'bg-black/60 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'}`} placeholder="Project Name" />
                                                <input value={editForm.language} onChange={(e) => setEditForm({ ...editForm, language: e.target.value })} className={`border rounded-xl px-4 py-2 text-sm outline-none transition-all
                                                    ${isDark ? 'bg-black/60 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'}`} placeholder="Tech Stack (e.g. React, Python)" />
                                            </div>
                                            <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`w-full border rounded-xl px-4 py-2 text-sm resize-none outline-none mb-4
                                                ${isDark ? 'bg-black/60 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'}`} rows={3} placeholder="Project description..." />
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setEditingIndex(null)} className={`flex items-center text-xs font-bold px-4 py-2 rounded-xl transition-colors
                                                    ${isDark ? 'bg-white/5 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'}`}><X className="w-3 h-3 mr-1" /> Cancel</button>
                                                <button onClick={saveProjectEdit} className={`flex items-center text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm
                                                    ${isDark ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}><Save className="w-3 h-3 mr-1" /> Update Project</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`flex justify-between items-center p-5 rounded-2xl border shadow-sm group transition-all
                                            ${isDark ? 'bg-black/30 border-white/5 hover:border-indigo-500/30 hover:bg-white/5' : 'bg-slate-50/50 border-slate-100 hover:border-indigo-200 hover:bg-white shadow-sm'}`}>
                                            <div>
                                                <h4 className={`font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-600`}>{project.name}</h4>
                                                <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{project.language || 'General Project'}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => startEditing(index, project)} className={`p-2 rounded-xl transition-all ${isDark ? 'text-zinc-400 hover:text-white bg-white/5 hover:bg-indigo-500/20' : 'text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 hover:border-indigo-100'}`}><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => deleteProject(index)} className={`p-2 rounded-xl transition-all ${isDark ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20' : 'text-red-500 bg-red-50 border border-red-100 hover:bg-red-100'}`}><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className={`text-center py-12 border-2 border-dashed rounded-3xl
                                    ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className="text-sm text-slate-500">No manual projects added to your portfolio.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GitHub Integration Card */}
                    <div className={`border rounded-3xl p-8 transition-all
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className={`p-4 rounded-2xl ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}><Github className="w-6 h-6" /></div>
                            <div><h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>GitHub Connection</h3><p className="text-sm text-slate-500">Sync repositories and contributions.</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">github.com/</span>
                                <input value={github} onChange={(e) => setGithub(e.target.value)} className={`w-full border rounded-xl pl-24 pr-4 py-3 text-sm outline-none transition-all
                                    ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'}`} placeholder="username" />
                            </div>
                            <button onClick={syncIdentity} disabled={isSyncing} className={`px-8 rounded-xl font-bold flex items-center transition-all border disabled:opacity-50 active:scale-95
                                ${isDark ? 'bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-600' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}>
                                {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" /> Sync</>}
                            </button>
                        </div>
                        {msg && <div className="mt-6 text-emerald-600 font-bold text-xs flex items-center bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 w-fit animate-in slide-in-from-top-2 tracking-wide uppercase"><CheckCircle className="w-4 h-4 mr-2" /> {msg}</div>}
                    </div>

                    {/* LeetCode Integration Card */}
                    <div className={`border rounded-3xl p-8 transition-all
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className={`p-4 rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}><Target className="w-6 h-6" /></div>
                            <div><h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LeetCode Connection</h3><p className="text-sm text-slate-500">Analyze algorithmic vectors.</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">leetcode.com/</span>
                                <input value={leetcode} onChange={(e) => setLeetcode(e.target.value)} className={`w-full border rounded-xl pl-28 pr-4 py-3 text-sm outline-none transition-all
                                    ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'}`} placeholder="username" />
                            </div>
                            <button onClick={syncLeetCode} disabled={isSyncingLeet} className={`px-8 rounded-xl font-bold flex items-center transition-all border disabled:opacity-50 active:scale-95
                                ${isDark ? 'bg-blue-500 text-white border-blue-400 hover:bg-blue-600' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}>
                                {isSyncingLeet ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" /> Sync</>}
                            </button>
                        </div>
                        {leetMsg && <div className="mt-6 text-emerald-600 font-bold text-xs flex items-center bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 w-fit animate-in slide-in-from-top-2 tracking-wide uppercase"><CheckCircle className="w-4 h-4 mr-2" /> {leetMsg}</div>}
                    </div>

                </div>
            </div>
        </div>
    );
}