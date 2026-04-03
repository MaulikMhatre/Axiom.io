"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Github, RefreshCw, Loader2, CheckCircle, ArrowLeft,
    User, Briefcase, Trash2, Save, FileText, UploadCloud, Edit2, X
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();

    const [github, setGithub] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [msg, setMsg] = useState('');

    const [profileData, setProfileData] = useState({ name: '', college: '', major: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [resumeMsg, setResumeMsg] = useState('');

    const [manualProjects, setManualProjects] = useState<any[]>([]);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        name: '', description: '', language: '', author: '', collaborators: '', videoUrl: ''
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setGithub(localStorage.getItem('gh_username') || '');
            const regData = JSON.parse(localStorage.getItem('user_registration') || '{}');
            setProfileData({ name: regData.name || '', college: regData.college || '', major: regData.major || '' });
            setManualProjects(JSON.parse(localStorage.getItem('manual_projects') || '[]'));
        }
    }, []);

    const syncIdentity = async () => {
        if (!github) return;
        setIsSyncing(true);
        try {
            const resp = await fetch(`http://localhost:8000/api/github/${github}`);
            const data = await resp.json();
            if (typeof window !== 'undefined') {
                localStorage.setItem('gh_username', github);
                localStorage.setItem('user_profile', JSON.stringify(data));
            }
            setMsg(`Synced identity for ${github}!`);
            setTimeout(() => setMsg(''), 3000);
        } catch (e) {
            setMsg('Sync Failed.');
        } finally {
            setIsSyncing(false);
        }
    };

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

    const deleteProject = (index: number) => {
        const updated = manualProjects.filter((_, i) => i !== index);
        setManualProjects(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem('manual_projects', JSON.stringify(updated));
        }
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
        if (typeof window !== 'undefined') {
            localStorage.setItem('manual_projects', JSON.stringify(updated));
        }
        setEditingIndex(null);
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingResume(true);
        setResumeMsg('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/upload-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("Resume parsing failed");
            const data = await response.json();

            if (typeof window !== 'undefined') {
                localStorage.setItem('user_resume_data', JSON.stringify(data));
            }
            setResumeMsg('Resume parsed and synchronized successfully!');
            setTimeout(() => setResumeMsg(''), 4000);
        } catch (err) {
            setResumeMsg('Failed to read PDF. Try again.');
        } finally {
            setIsUploadingResume(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b]">
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pt-32 pb-20 px-8 text-foreground">
                <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-indigo-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>

                <h1 className="text-4xl font-black text-white mb-2">Identity Settings</h1>
                <p className="text-slate-500 mb-10 font-light">Manage your connected accounts, academic profile, and portfolio.</p>

                <div className="space-y-6">
                    {/* Resume Upload Card */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20"><FileText className="w-6 h-6" /></div>
                                <div><h3 className="text-xl font-bold text-white">AI Resume Sync</h3><p className="text-sm text-slate-500">Extracts Experience & Skills.</p></div>
                            </div>
                            <label className={`bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl font-bold flex items-center transition-all border border-emerald-500/20 cursor-pointer ${isUploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                                {isUploadingResume ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                {isUploadingResume ? 'Parsing AI...' : 'Upload PDF'}
                                <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
                            </label>
                        </div>
                        {resumeMsg && (
                            <div className="text-emerald-400 font-bold text-sm flex items-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 animate-in fade-in">
                                <CheckCircle className="w-4 h-4 mr-2" /> {resumeMsg}
                            </div>
                        )}
                    </div>

                    {/* Personal Profile Card */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20"><User className="w-6 h-6" /></div>
                                <div><h3 className="text-xl font-bold text-white">Personal Profile</h3></div>
                            </div>
                            <button onClick={handleProfileSave} disabled={isSavingProfile} className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-4 py-2 rounded-xl font-bold flex items-center transition-all border border-purple-500/20">
                                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input name="name" type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-colors" placeholder="Full Name" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="college" type="text" value={profileData.college} onChange={(e) => setProfileData({ ...profileData, college: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-colors" placeholder="College" />
                                <input name="major" type="text" value={profileData.major} onChange={(e) => setProfileData({ ...profileData, major: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-colors" placeholder="Major" />
                            </div>
                        </div>
                    </div>

                    {/* Manage Projects Card */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20"><Briefcase className="w-6 h-6" /></div>
                            <div><h3 className="text-xl font-bold text-white">Manage Projects</h3><p className="text-sm text-slate-500">Edit or remove your portfolio items.</p></div>
                        </div>

                        <div className="space-y-3">
                            {manualProjects.length > 0 ? manualProjects.map((project: any, index: number) => (
                                editingIndex === index ? (
                                    <div key={index} className="bg-black/80 p-6 rounded-2xl border border-indigo-500/40 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Project Name" />
                                                <input type="text" value={editForm.language} onChange={(e) => setEditForm({ ...editForm, language: e.target.value })} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Tech Stack" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Author" />
                                                <input type="text" value={editForm.collaborators} onChange={(e) => setEditForm({ ...editForm, collaborators: e.target.value })} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Collaborators" />
                                            </div>
                                            <input type="url" value={editForm.videoUrl} onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Video Demo URL" />
                                            <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:border-indigo-500 outline-none" rows={2} placeholder="Short description..." />

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button onClick={() => setEditingIndex(null)} className="flex items-center text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><X className="w-3 h-3 mr-1" /> Cancel</button>
                                                <button onClick={saveProjectEdit} className="flex items-center text-xs font-bold text-white px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"><Save className="w-3 h-3 mr-1" /> Save</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={index} className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                                        <div>
                                            <h4 className="font-bold text-indigo-400">{project.name}</h4>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{project.language}</p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEditing(index, project)} className="text-slate-400 hover:text-indigo-400 p-2.5 bg-white/5 hover:bg-indigo-500/10 rounded-lg transition-all" title="Edit Project"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteProject(index)} className="text-red-400 hover:text-red-300 p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/20" title="Remove Project"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                )
                            )) : (
                                <div className="text-center py-6 border border-dashed border-white/5 rounded-xl bg-black/20">
                                    <p className="text-sm text-slate-500">No personal projects added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GitHub Integration Card */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20"><Github className="w-6 h-6" /></div>
                            <div><h3 className="text-xl font-bold text-white">GitHub Integration</h3></div>
                        </div>
                        <div className="flex gap-4">
                            <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="flex-1 bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="GitHub Username" />
                            <button onClick={syncIdentity} disabled={isSyncing} className="bg-indigo-500 hover:bg-indigo-600 px-8 rounded-xl font-bold flex items-center text-white transition-colors border border-indigo-400/20 shadow-lg shadow-indigo-500/20">
                                {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" /> Sync</>}
                            </button>
                        </div>
                        {msg && <div className="mt-4 text-emerald-400 font-bold text-sm flex items-center bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 w-fit"><CheckCircle className="w-4 h-4 mr-2" /> {msg}</div>}
                    </div>

                </div>
            </div>
        </div>
    );
}