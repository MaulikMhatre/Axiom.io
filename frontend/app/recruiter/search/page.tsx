"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Cpu, Mail, Terminal, ShieldCheck, 
  Zap, ArrowUpRight, Sparkles, Database 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// --- TYPES ---
interface Project {
  name: string;
  stack: string[];
  one_line_impact: string;
}

interface StudentResult {
  student_name: string;
  student_email: string;
  skill: string;
  category: string;
  signal_score: number;
  years_used: number;
  neural_score: number;
  student_profile: {
    college: string;
    major: string;
    top_3_projects: Project[];
  };
}

export default function RecruiterSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recruiter, setRecruiter] = useState<{username: string, company: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recruiter");
    if (saved) setRecruiter(JSON.parse(saved));
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:8000/api/search-skills?skill=${query}`);
      if (resp.ok) {
        const data = await resp.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000615] text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      
      {/* 🌌 HUD HEADER */}
      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-[#000615]/90 backdrop-blur-xl px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight uppercase italic text-white leading-none">
              AXIOM <span className="text-blue-500">HUNTER</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400/80 mt-1">Talent Procurement Node</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {recruiter && (
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Operator Status</p>
              <p className="text-xs font-black uppercase text-blue-400 italic tracking-tight leading-none mt-1">
                {recruiter.username} // {recruiter.company}
              </p>
            </div>
          )}
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
             <Terminal size={18} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 text-white">
        {/* 🚀 SEARCH SECTION */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              LOCATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">VERIFIED ASSETS.</span>
            </h1>
            
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="PROMPT ENGINE (E.G. REACT, RUST, AWS)..."
                className="w-full h-20 bg-[#000d2b] border border-white/10 rounded-3xl px-8 text-lg font-bold tracking-wide focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 uppercase shadow-2xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-10 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg flex items-center gap-3"
              >
                {loading ? "SCANNING..." : <><Search size={18}/> EXECUTE</>}
              </button>
            </form>
          </div>
        </div>

        {/* 📊 RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {results.map((student, idx) => (
              <StudentCard key={student.student_email} student={student} idx={idx} />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .scanline { width: 100%; height: 1px; background: rgba(59, 130, 246, 0.2); position: absolute; top: 0; pointer-events: none; }
        .group:hover .scanline { animation: scan 4s linear infinite; }
        @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
      `}} />
    </div>
  );
}

// --- SUB-COMPONENT: PORTFOLIO CARD ---
function StudentCard({ student, idx }: { student: StudentResult; idx: number }) {
  const router = useRouter();

  const handleAudit = () => {
    router.push(`/portfolio?email=${student.student_email}`);
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group relative bg-[#000d2b]/80 border border-white/10 p-10 rounded-[3rem] transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl overflow-hidden"
    >
      <div className="scanline" />
      
      {/* AXIOM SCORE */}
      <div className="absolute top-10 right-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[100px] backdrop-blur-md">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1 text-white">Neural Rank</p>
          <div className="text-4xl font-black italic text-white leading-none">
            {student.neural_score || '00'}
          </div>
          <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${student.neural_score}%` }} />
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12 pr-28 text-white">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black italic text-xl shadow-xl">
          {student.student_name.substring(0, 2).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
            {student.student_name}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {student.student_profile.college}
          </p>
          <p className="text-[9px] font-mono text-blue-500/60 uppercase italic tracking-tight">
            NODE_ID: {student.student_email}
          </p>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 gap-4 mb-10 text-white">
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expertise</span>
          </div>
          <p className="text-base font-black uppercase italic leading-none">{student.skill}</p>
          <p className="text-[10px] font-bold text-slate-600 uppercase mt-2">{student.years_used}Y Tenure</p>
        </div>

        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Domain</span>
          </div>
          <p className="text-base font-black uppercase italic leading-none">{student.category}</p>
          <p className="text-[10px] font-bold text-slate-600 uppercase mt-2">Verified Node</p>
        </div>
      </div>

      {/* Project Matrix - READABILITY UPGRADE HERE */}
      <div className="space-y-5 mb-12">
         <div className="flex items-center gap-3 mb-2">
            <Sparkles size={12} className="text-blue-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Proof of Capability</p>
            <div className="flex-1 h-[1px] bg-white/5" />
         </div>

         {student.student_profile.top_3_projects?.slice(0, 3).map((proj, pIdx) => (
           <div key={pIdx} className="p-6 bg-black/40 rounded-[1.5rem] border border-white/5 hover:border-blue-500/40 transition-all group/proj shadow-lg">
             <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black uppercase italic text-white tracking-tight group-hover/proj:text-blue-400 transition-colors">
                  {proj.name}
                </h4>
                <div className="flex gap-2">
                  {proj.stack.slice(0, 3).map((st, sIdx) => (
                    <span key={sIdx} className="text-[7px] px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-black uppercase tracking-widest">
                      {st}
                    </span>
                  ))}
                </div>
             </div>
             {/* Readability Fix: Larger text, better line height, and color contrast */}
             <p className="text-[13px] text-slate-300 leading-relaxed font-bold italic opacity-90 group-hover/proj:opacity-100 transition-opacity">
               "{proj.one_line_impact}"
             </p>
           </div>
         ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-8 border-t border-white/5">
        <a 
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${student.student_email}`}
          target="_blank"
          className="flex-1 h-14 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-400 hover:text-white transition-all shadow-xl active:scale-95"
        >
          <Mail size={16} /> CONTACT_PROTOCOL
        </a>
        <button 
          onClick={handleAudit}
          className="h-14 px-8 border border-white/10 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 text-[11px] font-black uppercase tracking-widest active:scale-95"
        >
          AUDIT <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}






