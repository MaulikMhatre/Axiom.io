"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileDown, ShieldAlert, Sparkles, BrainCircuit, 
  Loader2, CheckCircle, Lightbulb, Cpu, Target 
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Radar as RadarArea } from 'recharts';
import { useTheme } from 'next-themes';

export default function ResumeAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user_resume_data');
    if (stored) {
      try {
        const raw = JSON.parse(stored);
        setResumeData(raw);
      } catch (e) { console.error("Cache corrupted."); }
    }
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', localStorage.getItem('user_email') || '');
    try {
      const response = await fetch('http://localhost:8000/api/upload-resume', { method: 'POST', body: formData });
      const data = await response.json();
      localStorage.setItem('user_resume_data', JSON.stringify(data));
      setResumeData(data);
      setMsg('SYNC_SUCCESS');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) { setMsg('SYNC_ERR'); } finally { setIsUploading(false); }
  };

  if (!mounted) return null;

  const eliteSkills = (Array.isArray(resumeData?.skills) ? resumeData.skills : [])
    .filter((s: any) => (Number(s.level) || 0) >= 80).slice(0, 6);

  const radarData = resumeData?.skillDensity ? 
    Object.entries(resumeData.skillDensity).map(([subject, value]: any) => ({
      subject, A: Number(value) || 50, fullMark: 100
    })) : [];

  const projects = Array.isArray(resumeData?.projectImpacts) ? resumeData.projectImpacts : [];

  return (
    <div className="min-h-screen bg-white dark:bg-background text-foreground p-8 md:p-16 pt-40 font-sans relative overflow-x-hidden selection:bg-violet-500/30">
      
      {/* Cinematic FX */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 dark:border-zinc-900 pb-12 gap-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-foreground tracking-tighter uppercase italic text-foreground leading-none">
              Neural <span className="text-violet-500">Resume</span> Audit
            </h1>
            <div className="flex items-center gap-6">
              <span className="px-4 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-base font-black uppercase tracking-widest rounded-md">
                {resumeData?.devType || "Core Systems Architect"}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <label className="bg-white text-black px-10 py-4 rounded-2xl font-black text-base uppercase tracking-widest hover:invert transition-all cursor-pointer flex items-center gap-4">
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              {isUploading ? 'INGESTING...' : 'Upload Records'}
              <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
            </label>
            {msg && <div className="text-emerald-500 text-base font-black uppercase tracking-widest">{msg}</div>}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- MAIN COLUMN --- */}
          <div className="lg:col-span-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* ATS SCORE */}
              <div className="bg-zinc-100 dark:bg-zinc-900/20 border border-border shadow-sm p-10 rounded-[2.5rem] relative group overflow-hidden">
                <BrainCircuit className="absolute top-6 right-6 text-violet-500 opacity-20" size={32} />
                <span className="text-base font-black text-zinc-800 dark:text-zinc-300 uppercase tracking-[0.4em]">Audit Integrity</span>
                <div className="text-8xl font-black text-foreground mt-4 italic tracking-tighter text-foreground leading-none">
                  {Number(resumeData?.atsScore) || '00'}
                  <span className="text-3xl text-zinc-900 dark:text-zinc-300 not-italic ml-2">/100</span>
                </div>
              </div>

              {/* TECHNICAL VECTOR */}
              <div className="md:col-span-2 bg-zinc-100 dark:bg-zinc-900/20 border border-border shadow-sm p-10 rounded-[2.5rem]">
                <h3 className="text-base font-black text-zinc-800 dark:text-zinc-300 uppercase tracking-[0.4em] mb-8 flex items-center gap-3 italic">
                    <Cpu size={16} className="text-violet-500" /> Technical Vector
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {eliteSkills.map((skill: any, i: number) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between text-base font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-widest">
                            <span>{skill.name}</span>
                            <span className="text-violet-600 dark:text-violet-400 font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-border shadow-sm shadow-inner">
                            <div className="h-full bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.6)]" style={{ width: `${Number(skill.level) || 0}%` }} />
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NEURAL MATRIX (Radar & Project Grid) */}
            <div className="bg-white border-zinc-200 shadow-sm dark:bg-white/[0.01] border dark:border-white/5 rounded-[3.5rem] p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="flex flex-col items-center h-[350px]">
                        <p className="text-base font-black text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-[0.4em] mb-12 italic leading-none text-center">Expertise Density radar</p>
                        <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke={isDark ? "#18181b" : "#e4e4e7"} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#52525b' : '#27272a', fontSize: 10, fontWeight: 'bold' }} />
                                    <RadarArea name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#050505' : '#fff', border: isDark ? '1px solid #18181b' : '1px solid #e4e4e7', borderRadius: '12px', fontSize: '11px' }} />
                                </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col items-center h-[350px]">
                        <p className="text-base font-black text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-[0.4em] mb-12 italic leading-none text-center">Neural Project node grid</p>
                        <div className="w-full overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
                            {projects.map((proj: any, i: number) => (
                                <div key={i} className="flex items-center gap-6 p-6 bg-background/40 rounded-[2rem] border border-border shadow-sm group transition-all hover:border-violet-500/20">
                                    <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-violet-950/20 border border-violet-500/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                        <span className="text-xl font-black text-foreground italic tabular-nums">{Math.ceil((Number(proj.score) || 0) / 10)}</span>
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-violet-500 stroke-current group-hover:shadow-[0_0_15px_rgba(139,92,246,1)] transition-all" strokeWidth="1.5" strokeDasharray={`${Number(proj.score) || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-[15px] font-black text-foreground uppercase truncate group-hover:text-violet-600 dark:text-violet-400 transition-colors tracking-tight leading-none">{proj.name}</h4>
                                        <p className="text-base font-mono font-extrabold text-zinc-800 dark:text-zinc-300 uppercase tracking-[0.2em] mt-1 italic">Impact: {Number(proj.score || 0)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NEW HORIZONTAL OPTIMIZATION DIRECTIVES --- */}
            <div className="bg-amber-500/5 dark:bg-amber-500/[0.02] border border-amber-500/10 p-10 rounded-[3rem]">
              <h3 className="font-black text-base text-amber-500 mb-10 uppercase tracking-[0.4em] flex items-center gap-3 italic leading-none">
                <Lightbulb size={22} /> Optimization Directives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(resumeData?.actionableFixes || []).map((fix: any, i: number) => (
                    <div key={i} className="p-7 bg-background/40 rounded-3xl border border-border shadow-sm group hover:border-amber-500/20 transition-all">
                        <div className="text-base font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" /> Directive_0{i+1}
                        </div>
                        <p className="text-base text-zinc-800 dark:text-zinc-300 font-bold leading-relaxed group-hover:text-zinc-800 dark:text-zinc-200 transition-colors italic">"{fix}"</p>
                    </div>
                ))}
              </div>
            </div>

            {/* --- PROTOCOL FAULTS (BOTTOM BAR) --- */}
            <div className="bg-red-500/5 dark:bg-red-500/[0.02] border border-red-500/10 p-10 rounded-[3rem]">
                <h2 className="font-black uppercase tracking-[0.4em] text-base text-red-500 mb-10 flex items-center gap-3 italic">
                    <ShieldAlert size={18} /> Protocol Faults
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(resumeData?.criticalFlaws || []).map((flaw: string, i: number) => (
                        <div key={i} className="flex gap-5 p-6 bg-background/40 rounded-2xl border border-red-500/10">
                            <span className="text-red-500 font-black text-base font-mono mt-0.5">!</span>
                            <p className="text-[14px] font-bold text-zinc-800 dark:text-zinc-300 leading-relaxed italic">"{flaw}"</p>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}