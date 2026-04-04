"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, TrendingUp, ShieldAlert, Zap, 
  BarChart3, Loader2, Target, Award, 
  Cpu, ArrowUpRight, Search 
} from "lucide-react";

export default function LinkedInAudit() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem('linkedin_audit_data');
    // Simulated delay for "Scanning" feel
    const timer = setTimeout(() => {
      if (savedData) setData(JSON.parse(savedData));
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Cpu size={40} className="text-violet-500" />
      </motion.div>
      <p className="text-zinc-500 font-mono text-sm animate-pulse tracking-widest uppercase">Initializing Neural Audit...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
        <Search size={32} className="opacity-20" />
      </div>
      <h2 className="text-zinc-100 font-bold text-xl mb-2">No Profile Detected</h2>
      <p className="max-w-xs text-sm mb-8">Upload your LinkedIn PDF in settings to generate a professional credibility audit.</p>
      <button className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:invert transition-all">
        Go to Settings
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 p-4 md:p-8 pt-24 font-sans selection:bg-violet-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Grid */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-ping" />
              Live Audit System
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase italic">
              Professional <span className="text-zinc-500">Intelligence</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="group flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-all">
              <FileText size={18} className="group-hover:text-violet-400 transition-colors" />
              <span className="text-sm font-semibold">Full Report</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Left Stats (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trust Index Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative group bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 rounded-[2.5rem] overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Trust Index</span>
                    <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-black tracking-tighter">{data.credibility_score}</span>
                    <span className="text-2xl text-zinc-600 font-bold">/100</span>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                    <TrendingUp size={14} /> High Credibility Growth
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Zap size={240} />
                </div>
              </motion.div>

              {/* Identity Snapshot Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-zinc-900/50 border border-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <Award size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{data.name}</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-wider">{data.headline}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {data.verification_tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] border border-zinc-700 font-bold uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Brutal Insights Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="group relative bg-[#0d0d0e] border border-violet-500/20 rounded-[2.5rem] p-1 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]"
            >
              <div className="bg-black rounded-[2.3rem] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-violet-500 rounded-lg">
                    <ShieldAlert size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">AI Reality Check</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.brutal_feedback?.map((feedback: string, i: number) => (
                    <div key={i} className="flex gap-4 group/item">
                      <span className="text-violet-500 font-mono text-lg font-bold">0{i+1}</span>
                      <p className="text-zinc-400 text-sm leading-relaxed group-hover/item:text-zinc-100 transition-colors">
                        {feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Roadmap (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col"
            >
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 italic">
                <Target size={20} className="text-zinc-500" /> Improvement Roadmap
              </h3>
              
              <div className="space-y-6 flex-grow">
                {data.roadmap?.map((item: any, i: number) => (
                  <div key={i} className="relative pl-6 border-l border-zinc-800 group/road">
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-zinc-800 group-hover/road:bg-violet-500 transition-colors" />
                    <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2 group-hover/road:text-violet-400 transition-colors">
                      {item.title} <ArrowUpRight size={14} className="opacity-0 group-hover/road:opacity-100 transition-all" />
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}