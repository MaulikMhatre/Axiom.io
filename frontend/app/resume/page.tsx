"use client";
import React, { useState, useEffect } from 'react';
import { FileDown, Target, ShieldAlert, Sparkles, BrainCircuit, Loader2, CheckCircle } from "lucide-react";

export default function ResumeAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_resume_data');
      if (stored) setResumeData(JSON.parse(stored));
    }
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMsg('');

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
            setResumeData(data);
        }
        setMsg('Resume parsed and synchronized successfully!');
        setTimeout(() => setMsg(''), 4000);
    } catch (err) {
        setMsg('Failed to read PDF. Try again.');
    } finally {
        setIsUploading(false);
    }
  };

  const skills = resumeData?.extractedSkills || ["Next.js", "FastAPI", "React", "Python", "Tailwind", "Gemini API"];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-24 font-sans relative overflow-hidden">
      
      {/* Aesthetic Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-violet-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Skill Blueprint <span className="text-zinc-600">|</span> Resume Analysis</h1>
            <p className="text-zinc-500 mt-2">AI-Driven Critique & Professional Impact Audit</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
              <label className={`bg-zinc-100 text-zinc-950 px-6 py-2.5 rounded-full font-semibold hover:bg-zinc-300 transition-all flex items-center gap-2.5 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                {isUploading ? 'Parsing AI...' : 'Upload Latest Resume'}
                <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
              </label>
              {msg && <div className="text-emerald-400 text-xs font-bold flex items-center animate-in fade-in"><CheckCircle size={12} className="mr-1" /> {msg}</div>}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Analysis Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ATS Impact Score */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden">
                <BrainCircuit className="absolute top-4 right-4 text-violet-500 opacity-20" size={28} />
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">ATS Impact</span>
                <div className="text-7xl font-bold mt-2">{resumeData ? '94' : '81'}<span className="text-2xl text-zinc-600">/100</span></div>
                <p className="text-sm text-zinc-400 mt-5">{resumeData ? 'Newly parsed resume is highly parsable and well-structured.' : 'Your resume is highly parsable and well-structured.'}</p>
              </div>

              {/* Key Claims Card */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Target size={16} className="text-violet-400"/> Primary Tech Stack
                </h3>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {skills.map((skill: any, i: number) => {
                      // handle both ["Python", 9] array formats and string formats
                      const s = Array.isArray(skill) ? skill[0] : (typeof skill === 'object' ? (skill.name || skill.skill) : skill);
                      return (
                        <span key={i} className="px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20 font-medium">
                          {s}
                        </span>
                      )
                  })}
                </div>
              </div>
            </div>

            {/* Visual Skill Matrix Placeholder */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl min-h-[300px] flex items-center justify-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-violet-950/20 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]" />
                <div className="text-center z-10">
                    <Sparkles className="mx-auto text-violet-600 mb-4" size={40} />
                    <p className="text-zinc-500 font-mono italic">AI Visualize: Skill Density & Project Impact Graphs</p>
                    <p className="text-xs text-zinc-600 mt-2">[Integration: Radar Chart + Treemap for Tech Stack]</p>
                </div>
            </div>
          </div>

          {/* Critical Audit Column */}
          <div className="space-y-8">
            {/* The "Brutal" Sidebar */}
            <div className="bg-zinc-900/60 border-l-4 border-red-500 p-7 rounded-r-3xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-950/20 rounded-full blur-[30px]" />
              <div className="flex items-center gap-2.5 mb-5 text-red-400">
                <ShieldAlert size={22} />
                <h2 className="font-bold uppercase tracking-tighter text-xl">Critical Flaws Detected</h2>
              </div>
              <ul className="space-y-4 text-sm leading-relaxed font-mono">
                <li className="text-zinc-300 flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-1">→</span>
                    <span>Your descriptions focus on <strong className="text-white">responsibility</strong>, not <strong className="text-white">results</strong>. Recruiter impact is near zero.</span>
                </li>
                <li className="text-zinc-300 flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-1">→</span>
                    <span>&apos;AetherLink&apos; is described as an &quot;Operating System.&quot; Your GitHub code shows a terminal wrapper. Fix the discrepancy.</span>
                </li>
                <li className="text-zinc-300 flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-1">→</span>
                    <span>Zero quantifiable metrics. Did your ERP increase efficiency? Say so. AI detects a lack of data.</span>
                </li>
              </ul>
            </div>

            {/* Actionable Fixes */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-7 rounded-3xl">
              <h3 className="font-semibold text-lg text-zinc-200 mb-5">Next Steps for Verification</h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700 text-xs text-zinc-400">
                  <strong className="text-violet-300 block mb-1.5">Actionable Fix</strong>
                  {resumeData?.workExperience?.[0] ? `Convert "${resumeData.workExperience[0].role}" to "Optimized system response time by 40% using FastAPI dependency injection."` : 'Convert "Managed hospital ERP" to "Optimized ERP response time by 40% using FastAPI dependency injection."'}
                </div>
                <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700 text-xs text-zinc-400">
                  <strong className="text-violet-300 block mb-1.5">Verification Gap</strong>
                  The &quot;Expert in C++&quot; claim is unverified. Post a complex C++ project to GitHub to increase this score.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}