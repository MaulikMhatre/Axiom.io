"use client";

import React, { useState } from 'react';
import {
    FileText,
    LayoutDashboard,
    Zap,
    ShieldCheck,
    ArrowRight,
    Fingerprint,
    Globe,
    Share2,
    User,
    Loader2,
    CheckCircle
} from 'lucide-react';
import { analyzeRepo } from '@/lib/api';

export default function Dashboard() {
    const [githubUrl, setGithubUrl] = useState("");
    const [repoData, setRepoData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(false);

    const handleAnalyze = async () => {
        if (!githubUrl) return;
        setLoading(true);
        try {
            const data = await analyzeRepo(githubUrl);
            setRepoData(data);
            setIsInputVisible(false);
        } catch (err) {
            console.error(err);
            alert("Failed to analyze repository. Make sure the URL is correct and backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-28 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Top Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 uppercase italic">
                        <Fingerprint className="text-indigo-500" size={36} />
                        Phronex <span className="text-indigo-600">ID</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium tracking-tight">
                        Professional Verification Engine & Credibility Audit.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* GitHub Section */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                <Globe size={24} className="text-indigo-400" />
                            </div>
                            <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${repoData ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>
                                {repoData ? 'Linked' : 'Unlinked'}
                            </span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Source Audit</h3>

                        {repoData ? (
                            <div className="mt-4 space-y-2">
                                <p className="text-zinc-300 text-sm font-bold">{repoData.projectSummary.substring(0, 80)}...</p>
                                <div className="flex flex-wrap gap-1">
                                    {repoData.techStack.slice(0, 3).map((s: string) => (
                                        <span key={s} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-zinc-400">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                                Scanning repositories for algorithmic complexity and architectural integrity.
                            </p>
                        )}

                        {!repoData && (
                            <div className="mt-8 space-y-4">
                                {isInputVisible ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="GitHub Repo URL"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                            value={githubUrl}
                                            onChange={(e) => setGithubUrl(e.target.value)}
                                        />
                                        <button
                                            disabled={loading}
                                            onClick={handleAnalyze}
                                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Verify Repo"}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsInputVisible(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-black py-3 rounded-2xl font-bold text-sm hover:bg-white transition-colors"
                                    >
                                        Connect GitHub <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        )}

                        {repoData && (
                            <div className="mt-8 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-2 text-emerald-500 text-xs font-bold">
                                <CheckCircle size={14} /> Audit Completed Successfully
                            </div>
                        )}
                    </div>

                    {/* LinkedIn Section */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <Share2 size={24} className="text-emerald-400" />
                            </div>
                            <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                Pending
                            </span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Social Sync</h3>
                        <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                            Cross-referencing professional trajectory and industry endorsements.
                        </p>
                        <button className="mt-8 w-full flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white py-3 rounded-2xl font-bold text-sm hover:bg-zinc-700 transition-colors">
                            Upload Profile PDF
                        </button>
                    </div>

                    {/* Trust Index Section */}
                    <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-3xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-6 text-indigo-400">
                                <ShieldCheck size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Audit Status</span>
                            </div>
                            <div className="text-7xl font-black italic tracking-tighter text-white opacity-20">
                                {repoData ? repoData.complexityScore : "0.0"}
                            </div>
                        </div>
                        <p className="text-zinc-600 text-xs mt-6 font-medium uppercase tracking-wider leading-tight">
                            {repoData ? `Reliability detected at ${repoData.noveltyScore}% uniqueness.` : "Integrate sources to initialize verification."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}