// "use client";
// import React, { useState, useEffect } from 'react';
// import { FileDown, Target, ShieldAlert, Sparkles, BrainCircuit, Loader2, CheckCircle } from "lucide-react";

// export default function ResumeAnalysis() {
//   const [isUploading, setIsUploading] = useState(false);
//   const [msg, setMsg] = useState('');
//   const [resumeData, setResumeData] = useState<any>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem('user_resume_data');
//       if (stored) setResumeData(JSON.parse(stored));
//     }
//   }, []);

//   const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);
//     setMsg('');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//         const response = await fetch('http://localhost:8000/api/upload-resume', {
//             method: 'POST',
//             body: formData,
//         });

//         if (!response.ok) throw new Error("Resume parsing failed");
//         const data = await response.json();

//         if (typeof window !== 'undefined') {
//             localStorage.setItem('user_resume_data', JSON.stringify(data));
//             setResumeData(data);
//         }
//         setMsg('Resume parsed and synchronized successfully!');
//         setTimeout(() => setMsg(''), 4000);
//     } catch (err) {
//         setMsg('Failed to read PDF. Try again.');
//     } finally {
//         setIsUploading(false);
//     }
//   };

//   const skills = resumeData?.extractedSkills || ["Next.js", "FastAPI", "React", "Python", "Tailwind", "Gemini API"];

//   return (
//     <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-24 font-sans relative overflow-hidden">
      
//       {/* Aesthetic Background Orbs */}
//       <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
//         <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-violet-600/10 blur-[130px] rounded-full" />
//         <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
//       </div>

//       <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
//         {/* Header Section */}
//         <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
//           <div>
//             <h1 className="text-4xl font-bold tracking-tight">Skill Blueprint <span className="text-zinc-600">|</span> Resume Analysis</h1>
//             <p className="text-zinc-500 mt-2">AI-Driven Critique & Professional Impact Audit</p>
//           </div>
          
//           <div className="flex flex-col items-end gap-2">
//               <label className={`bg-zinc-100 text-zinc-950 px-6 py-2.5 rounded-full font-semibold hover:bg-zinc-300 transition-all flex items-center gap-2.5 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
//                 {isUploading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
//                 {isUploading ? 'Parsing AI...' : 'Upload Latest Resume'}
//                 <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
//               </label>
//               {msg && <div className="text-emerald-400 text-xs font-bold flex items-center animate-in fade-in"><CheckCircle size={12} className="mr-1" /> {msg}</div>}
//           </div>
//         </div>

//         {/* Dashboard Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Main Analysis Column */}
//           <div className="lg:col-span-2 space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* ATS Impact Score */}
//               <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden">
//                 <BrainCircuit className="absolute top-4 right-4 text-violet-500 opacity-20" size={28} />
//                 <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">ATS Impact</span>
//                 <div className="text-7xl font-bold mt-2">{resumeData ? '94' : '81'}<span className="text-2xl text-zinc-600">/100</span></div>
//                 <p className="text-sm text-zinc-400 mt-5">{resumeData ? 'Newly parsed resume is highly parsable and well-structured.' : 'Your resume is highly parsable and well-structured.'}</p>
//               </div>

//               {/* Key Claims Card */}
//               <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl">
//                 <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
//                     <Target size={16} className="text-violet-400"/> Primary Tech Stack
//                 </h3>
//                 <div className="mt-5 flex flex-wrap gap-2.5">
//                   {skills.map((skill: any, i: number) => {
//                       // handle both ["Python", 9] array formats and string formats
//                       const s = Array.isArray(skill) ? skill[0] : (typeof skill === 'object' ? (skill.name || skill.skill) : skill);
//                       return (
//                         <span key={i} className="px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20 font-medium">
//                           {s}
//                         </span>
//                       )
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Visual Skill Matrix Placeholder */}
//             <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl min-h-[300px] flex items-center justify-center group relative overflow-hidden">
//                 <div className="absolute inset-0 bg-violet-950/20 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]" />
//                 <div className="text-center z-10">
//                     <Sparkles className="mx-auto text-violet-600 mb-4" size={40} />
//                     <p className="text-zinc-500 font-mono italic">AI Visualize: Skill Density & Project Impact Graphs</p>
//                     <p className="text-xs text-zinc-600 mt-2">[Integration: Radar Chart + Treemap for Tech Stack]</p>
//                 </div>
//             </div>
//           </div>

//           {/* Critical Audit Column */}
//           <div className="space-y-8">
//             {/* The "Brutal" Sidebar */}
//             <div className="bg-zinc-900/60 border-l-4 border-red-500 p-7 rounded-r-3xl relative overflow-hidden">
//               <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-950/20 rounded-full blur-[30px]" />
//               <div className="flex items-center gap-2.5 mb-5 text-red-400">
//                 <ShieldAlert size={22} />
//                 <h2 className="font-bold uppercase tracking-tighter text-xl">Critical Flaws Detected</h2>
//               </div>
//               <ul className="space-y-4 text-sm leading-relaxed font-mono">
//                 <li className="text-zinc-300 flex items-start gap-3">
//                     <span className="text-red-500 font-bold mt-1">→</span>
//                     <span>Your descriptions focus on <strong className="text-white">responsibility</strong>, not <strong className="text-white">results</strong>. Recruiter impact is near zero.</span>
//                 </li>
//                 <li className="text-zinc-300 flex items-start gap-3">
//                     <span className="text-red-500 font-bold mt-1">→</span>
//                     <span>&apos;AetherLink&apos; is described as an &quot;Operating System.&quot; Your GitHub code shows a terminal wrapper. Fix the discrepancy.</span>
//                 </li>
//                 <li className="text-zinc-300 flex items-start gap-3">
//                     <span className="text-red-500 font-bold mt-1">→</span>
//                     <span>Zero quantifiable metrics. Did your ERP increase efficiency? Say so. AI detects a lack of data.</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Actionable Fixes */}
//             <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-7 rounded-3xl">
//               <h3 className="font-semibold text-lg text-zinc-200 mb-5">Next Steps for Verification</h3>
//               <div className="space-y-4">
//                 <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700 text-xs text-zinc-400">
//                   <strong className="text-violet-300 block mb-1.5">Actionable Fix</strong>
//                   {resumeData?.workExperience?.[0] ? `Convert "${resumeData.workExperience[0].role}" to "Optimized system response time by 40% using FastAPI dependency injection."` : 'Convert "Managed hospital ERP" to "Optimized ERP response time by 40% using FastAPI dependency injection."'}
//                 </div>
//                 <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700 text-xs text-zinc-400">
//                   <strong className="text-violet-300 block mb-1.5">Verification Gap</strong>
//                   The &quot;Expert in C++&quot; claim is unverified. Post a complex C++ project to GitHub to increase this score.
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


































"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileDown, Target, ShieldAlert, Sparkles, BrainCircuit, 
  Loader2, CheckCircle, Lightbulb, Cpu, Fingerprint, Activity 
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Tooltip, Radar as RadarArea 
} from 'recharts';

export default function ResumeAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_resume_data');
      if (stored) {
        try {
          setResumeData(JSON.parse(stored));
        } catch (e) {
          console.error("Diagnostic error: LocalStorage corruption.");
        }
      }
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

      if (!response.ok) throw new Error("Protocol failure");
      const data = await response.json();

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_resume_data', JSON.stringify(data));
        setResumeData(data);
      }
      setMsg('SYNCHRONIZATION_COMPLETE');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('UPLOADER_TIMEOUT');
    } finally {
      setIsUploading(false);
    }
  };

  // --- Visual Data Mapping ---
  const radarData = resumeData?.skillDensity ? 
    Object.entries(resumeData.skillDensity).map(([subject, value]) => ({
      subject, 
      A: Number(value) || 0, 
      fullMark: 100
    })) : [];

  const projectNodes = Array.isArray(resumeData?.projectImpacts) ? 
    resumeData.projectImpacts.map((proj: any) => ({
        name: proj.name || "UNNAMED_NODE",
        score: Math.max(Number(proj.score) || 10, 1)
    })) : [];

  const skills = resumeData?.skills || [];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-12 pt-32 font-sans relative overflow-x-hidden">
      
      {/* Cinematic Background FX */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-violet-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* --- 1. NEURAL HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-zinc-900 pb-12 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black tracking-widest uppercase">
                Audit Mode Active
              </span>
              <span className="text-zinc-800 font-mono text-[10px]">SCAN_VER: 3.2.0-FLASH</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
              Skill <span className="text-zinc-800">/</span> Blueprint
            </h1>
            <div className="flex items-center gap-4">
               <Fingerprint size={20} className="text-zinc-700" />
               <p className="text-zinc-500 font-mono text-base tracking-[0.2em] font-bold uppercase">
                 {resumeData?.devType || "Awaiting Data Ingestion"}
               </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
            <label className={`w-full lg:w-auto bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              {isUploading ? 'Injecting PDF...' : 'Upload Latest Resume'}
              <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
            </label>
            {msg && <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center"><CheckCircle size={14} className="mr-2" /> {msg}</div>}
          </div>
        </div>

        {/* --- 2. BENTO ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* ATS SCORE */}
          <div className="md:col-span-4 bg-zinc-900/20 border border-zinc-800 rounded-[3rem] p-10 flex flex-col justify-between hover:border-violet-500/40 transition-colors group">
            <div>
              <Activity className="text-zinc-800 mb-8 group-hover:text-violet-500 transition-colors" size={32} />
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">ATS Score</span>
              <div className="text-9xl font-black mt-2 italic tracking-tighter text-white">
                {resumeData?.atsScore || '00'}
                <span className="text-2xl text-zinc-800 not-italic ml-2">/100</span>
              </div>
            </div>
            <p className="text-base font-medium text-zinc-400 mt-8 leading-relaxed italic border-t border-zinc-900 pt-6">
              {resumeData?.atsScore > 80 ? '"High structural relevance detected for Tier-1 engineering protocols."' : '"Awaiting neural scan for structural optimization suggestion."'}
            </p>
          </div>

          {/* SKILLS MATRIX */}
          <div className="md:col-span-8 bg-zinc-900/20 border border-zinc-800 rounded-[3rem] p-12">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 mb-12 flex items-center gap-3">
                <Cpu size={16} className="text-violet-500" /> Competency Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {skills.length > 0 ? skills.map((skill: any, i: number) => (
                <div key={i} className="space-y-4">
                    <div className="flex justify-between text-sm font-black uppercase text-zinc-200 tracking-widest">
                        <span>{skill.name}</span>
                        <span className="text-violet-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-1000" 
                          style={{ width: `${skill.level}%` }} 
                        />
                    </div>
                </div>
              )) : (
                <div className="col-span-2 py-20 text-center border border-dashed border-zinc-800 rounded-[2rem] text-zinc-800 font-black uppercase tracking-[0.5em] text-xs">
                  Waiting_for_source_injection
                </div>
              )}
            </div>
          </div>

          {/* --- 3. INTEGRATED INTELLIGENCE PANEL (RADAR + NEURAL GRID) --- */}
          <div className="md:col-span-12 bg-white/[0.01] border border-zinc-900 rounded-[4rem] p-12">
            <div className="flex items-center justify-between mb-16">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-3">
                    <Sparkles className="text-violet-500" size={20} /> Integrated Intelligence Metrics
                </h3>
                <span className="text-[10px] font-mono text-zinc-800">VISUAL_CORE_LOADED</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Radar Column */}
                <div className="flex flex-col items-center h-[400px]">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-10">Expertise Radar</p>
                    <ResponsiveContainer width="100%" height="100%">
                        {radarData.length > 0 ? (
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#18181b" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 'bold' }} />
                                <RadarArea name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                                <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #18181b', borderRadius: '12px', fontSize: '12px' }} />
                            </RadarChart>
                        ) : <div className="h-full flex items-center text-zinc-900 font-black uppercase text-[10px]">Matrix_Not_Initialized</div>}
                    </ResponsiveContainer>
                </div>

                {/* Neural Project Node Column */}
                <div className="flex flex-col items-center h-[400px]">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-10">Neural Node Project Index</p>
                    <div className="w-full h-full overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {projectNodes.length > 0 ? projectNodes.map((proj: any, i: number) => {
                            const percentage = proj.score;
                            const normalizedValue = Math.ceil(percentage / 10);
                            return (
                                <div key={i} className="flex items-center gap-6 p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-violet-500/20 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 font-mono text-[60px] text-zinc-950 opacity-20 group-hover:opacity-40 select-none rotate-6 transition-opacity font-black p-2 break-all">
                                        0x{i}FF_{proj.name.slice(0,2).toUpperCase()}
                                    </div>
                                    
                                    {/* Circular Gauge */}
                                    <div className="relative shrink-0 flex items-center justify-center z-10 w-20 h-20 rounded-full bg-violet-950/20 border border-violet-500/10 shadow-inner">
                                        <span className="text-2xl font-black text-white italic tracking-tighter tabular-nums">{normalizedValue}<span className="text-[10px] text-zinc-700 not-italic ml-0.5">/10</span></span>
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-zinc-900 stroke-current" strokeWidth="1.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" />
                                            <path className="text-violet-500 stroke-current group-hover:shadow-[0_0_10px_rgba(139,92,246,1)] transition-all duration-1000" strokeWidth="1.5" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" />
                                        </svg>
                                    </div>

                                    <div className="flex-1 space-y-2 z-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-black text-zinc-100 uppercase tracking-tight group-hover:text-violet-400 transition-colors leading-none">{proj.name}</h4>
                                            <span className="text-[8px] font-mono text-zinc-700 group-hover:text-emerald-500/50 transition-colors">STATUS: VERIFIED</span>
                                        </div>
                                        <p className="text-xs font-medium text-zinc-500 leading-relaxed italic line-clamp-2">
                                            Verified Project Instance // Impact Score Detected: {percentage}%
                                        </p>
                                    </div>
                                </div>
                            );
                        }) : <div className="h-full flex items-center justify-center text-zinc-900 font-black uppercase text-[10px] border border-dashed border-zinc-900 rounded-3xl w-full">Ingesting_source_vectors...</div>}
                    </div>
                </div>
            </div>
          </div>

          {/* --- 4. FAULTS & DIRECTIVES --- */}
          <div className="md:col-span-6 bg-red-500/[0.02] border border-red-500/10 rounded-[3rem] p-12">
            <h2 className="font-black uppercase tracking-[0.3em] text-xs text-red-500 mb-10 flex items-center gap-3">
              <ShieldAlert size={20} /> Critical Protocol Faults
            </h2>
            <div className="space-y-8">
              {resumeData?.criticalFlaws?.length > 0 ? (
                resumeData.criticalFlaws.map((flaw: string, i: number) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <span className="text-red-500 font-black text-lg font-mono mt-1 opacity-40 group-hover:opacity-100 transition-opacity tracking-tighter">0{i+1}</span>
                    <p className="text-lg text-zinc-300 leading-relaxed font-medium">"{flaw}"</p>
                  </div>
                ))
              ) : <p className="text-zinc-800 text-[10px] font-black uppercase tracking-widest">SYSTEM_STABLE_NO_ERRORS_DETECTED</p>}
            </div>
          </div>

          <div className="md:col-span-6 bg-amber-500/[0.02] border border-amber-500/10 rounded-[3rem] p-12">
            <h3 className="font-black text-xs text-amber-500 mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
              <Lightbulb size={20} /> Optimization Directives
            </h3>
            <div className="space-y-6">
              {resumeData?.actionableFixes?.map((fix: string, i: number) => (
                  <div key={i} className="p-8 bg-black/40 rounded-[2rem] border border-zinc-900 hover:border-amber-500/30 transition-all group">
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Directive_0{i+1}
                      </div>
                      <p className="text-base text-zinc-400 leading-relaxed font-medium group-hover:text-zinc-200 transition-colors">{fix}</p>
                  </div>
              )) || <p className="text-zinc-800 text-[10px] font-black uppercase tracking-widest">WAITING_FOR_DIAGNOSTICS</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}