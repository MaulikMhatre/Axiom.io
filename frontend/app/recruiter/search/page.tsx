"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Users, Star, Cpu, Globe, Mail, 
  Terminal, ShieldCheck, Zap, ArrowUpRight, 
  Filter, Sparkles, Database, LayoutGrid, List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    atsScore?: number;
    top_3_projects: Array<{
      name: string;
      stack: string[];
      one_line_impact: string;
    }>;
  };
}

export default function RecruiterSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recruiter, setRecruiter] = useState<any>(null);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000615] text-white font-sans selection:bg-blue-500/30 pb-20">
      
      {/* 🌌 HUD HEADER */}
      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-[#000615]/80 backdrop-blur-xl px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
              Axiom <span className="text-blue-500">Hunter</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-400">Talent Procurement Node</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {recruiter && (
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase text-white/40 mb-0.5 tracking-widest">Signed In As</p>
              <p className="text-xs font-black uppercase text-blue-400 tracking-tighter italic">{recruiter.username} @ {recruiter.company}</p>
            </div>
          )}
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
             <Terminal size={18} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* 🚀 SEARCH COMMANDER */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-10">
              Locate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Verified Talent.</span>
            </h1>
            
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="PROMPT ENGINE (e.g. XGBoost, Next.js, Rust)..."
                className="w-full h-20 bg-white/5 border-2 border-white/10 rounded-3xl px-8 text-xl font-black italic tracking-tight focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-2xl placeholder:text-white/10 uppercase"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-8 bg-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2"
              >
                {loading ? "SEARCHING..." : <><Search size={20}/> EXECUTE</>}
              </button>
            </form>
          </div>
        </div>

        {/* 📊 RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((student, idx) => (
                <StudentCard key={idx} student={student} idx={idx} />
              ))
            ) : query && !loading ? (
              <div className="col-span-full py-32 text-center">
                 <Database className="w-16 h-16 text-white/10 mx-auto mb-6 animate-pulse" />
                 <p className="text-xl font-black uppercase tracking-[0.2em] text-white/30 italic">No assets located in the current node.</p>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .glow-blue:hover { 
          border-color: rgba(59, 130, 246, 0.4) !important; 
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.15); 
          transform: translateY(-4px);
        }
        .scanline { width: 100%; height: 2px; background: rgba(59, 130, 246, 0.2); position: absolute; transition: all 0.5s; top: 0; pointer-events: none; }
        .group:hover .scanline { animation: scan 3s linear infinite; }
        @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
      `}} />
    </div>
  );
}

function StudentCard({ student, idx }: { student: StudentResult; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="group relative bg-[#000d2b]/95 border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all duration-500 glow-blue cursor-default shadow-2xl"
    >
      <div className="scanline" />
      
      {/* HUD Score Overlay - Axiom Neural Score */}
      <div className="absolute top-8 right-8 text-right">
        <div className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-500 leading-none">
          {student.neural_score || '00'}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mt-1">AXIOM NEURAL SCORE</p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/20 flex items-center justify-center font-black italic shadow-xl text-white text-xl">
          {student.student_name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white group-hover:text-blue-400 transition-colors">
            {student.student_name}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/30">
            {student.student_profile.college} • {student.student_profile.major}
          </p>
          <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest mt-1 italic">
            Node_ID: {student.student_email}
          </p>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 transition-all group-hover:bg-blue-600/5 group-hover:border-blue-500/20">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Zap size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Matched Skill</span>
          </div>
          <p className="text-sm font-black uppercase italic text-white">{student.skill}</p>
          <p className="text-[9px] text-blue-400/60 font-black uppercase mt-1">{student.years_used} YEARS EXP_LOAD</p>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 transition-all group-hover:bg-cyan-600/5 group-hover:border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <Cpu size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Category</span>
          </div>
          <p className="text-sm font-black uppercase italic text-white">{student.category}</p>
          <p className="text-[9px] text-cyan-400/60 font-black uppercase mt-1">NEURAL_DOMAIN_VERIFIED</p>
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4 mb-8">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
           <Sparkles size={12} /> PROOF OF CAPABILITY (TOP_3)
         </p>
         {student.student_profile.top_3_projects && student.student_profile.top_3_projects.length > 0 ? (
           student.student_profile.top_3_projects.map((proj, pIdx) => (
             <div key={pIdx} className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                   <h4 className="text-xs font-black uppercase italic text-white">{proj.name}</h4>
                   <div className="flex gap-1">
                      {proj.stack.slice(0, 3).map((st, sIdx) => (
                        <span key={sIdx} className="text-[7px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-black">{st}</span>
                      ))}
                   </div>
                </div>
                <p className="text-[9px] text-blue-100/40 leading-relaxed font-bold">{proj.one_line_impact}</p>
             </div>
           ))
         ) : (
           <p className="text-[9px] italic text-white/20 uppercase tracking-widest">No project metadata retrieved from neural audit.</p>
         )}
      </div>

      {/* Footer Action */}
      <div className="flex items-center gap-4 pt-6 border-t border-white/5">
        <a 
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${student.student_email}&su=Proprietary Interest: Axiom.io Talent Protocol`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-blue-400 transition-all active:scale-95 shadow-xl"
        >
          <Mail size={14} /> DIRECT_MAIL_PROTOCOL
        </a>
        <button className="h-12 px-6 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          AUDIT PORTFOLIO <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
