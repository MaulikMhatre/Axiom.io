"use client";

import React from "react";
import Link from "next/link";
import NeuralBackground from "@/components/ui/flow-field-background";
import { ShieldCheck, Zap, TrendingUp, ArrowRight, Sparkles, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-zinc-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* 🌌 BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 bg-black">
        <NeuralBackground 
          color="#818cf8" 
          trailOpacity={0.12} 
          particleCount={600} 
          speed={0.7} 
          scale={1}
        />
        {/* Subtle radial mask to create depth and keep focus centered */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* 🧭 NAVIGATION HEADER */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="p-2.5 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:scale-105 transition-all duration-500">
               <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase italic leading-none text-white">
                Axiom.io <span className="text-indigo-500">ID</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-[0.4em] uppercase mt-1 opacity-70">
                Audit Engine v1.0
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-all hover:tracking-widest uppercase tracking-widest duration-300">
              Archives Access
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-3 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/20"
            >
              Initialize Identity
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <main className="flex-1 max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-6 pt-48 pb-32 relative">
        
        {/* Decorative Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 p-2 px-5 rounded-full bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-3xl text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 inline-flex items-center gap-3 shadow-2xl"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_15px_rgba(99,102,241,1)]" />
          Neural Integrity Verification Active
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-2xl">
  VERIFY YOUR <br/>
  <span className="text-indigo-400 relative">
    DIGITAL IDENTITY
    {/* Adjusted sparkle position for smaller text */}
    <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-indigo-400 animate-pulse delay-700" />
  </span>
</h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-3xl text-xl md:text-2xl text-zinc-500 mb-16 font-medium leading-relaxed tracking-tight"
        >
          Axiom ID deploys advanced neural auditing to cross-verify professional assertions across GitHub, LinkedIn, and Portfolios. <span className="text-zinc-200 underline decoration-indigo-500/50 underline-offset-8">Eliminate ambiguity.</span> Build absolute trust.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-8 w-full max-w-xl"
        >
          <Link
            href="/dashboard"
            className="group flex-2 h-20 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] relative overflow-hidden"
          >
            <span className="relative z-10">Launch Neural Core</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          <Link
            href="/resume"
            className="flex-1 h-20 bg-transparent border-2 border-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center hover:bg-white/5 transition-all hover:border-white/30 backdrop-blur-lg"
          >
            Upload Resume
          </Link>
        </motion.div>

        {/* 🛠️ FEATURE GRID */}
        <div className="mt-60 grid grid-cols-1 md:grid-cols-3 gap-12 w-full border-t border-white/10 pt-24">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8" />}
            title="Brutal Audit"
            description="AI that reconstructs your professional timeline to find inconsistencies recruiters despise."
            color="indigo"
            delay={1.2}
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8" />}
            title="Trust Index"
            description="A multidimensional credibility score derived from multi-platform data triangulation."
            color="violet"
            delay={1.4}
          />
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8" />}
            title="Growth Path"
            description="Algorithmic recommendations to bridge experience gaps and amplify your market value."
            color="emerald"
            delay={1.6}
          />
        </div>
      </main>
      
      {/* 📜 FOOTER */}
      <footer className="w-full py-20 border-t border-white/5 mt-20 relative bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center font-black text-white text-xs italic">A</div>
            <div className="flex flex-col">
                <span className="font-black tracking-tighter text-lg text-white">Axiom.io</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural Verification System</span>
            </div>
          </div>
          
          <div className="flex gap-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
             <a href="#" className="hover:text-white transition-colors">Privacy Protocal</a>
             <a href="#" className="hover:text-white transition-colors">Data Integrity</a>
             <a href="#" className="hover:text-white transition-colors">Governance</a>
          </div>

          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
            © 2026 AXM_SYSTEMS. ALL DATA ENCRYPTED.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: { icon: React.ReactNode, title: string, description: string, color: string, delay: number }) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)]",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.05)]",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-6 group cursor-default"
    >
       <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg]", colorMap[color])}>
          {icon}
       </div>
       <div className="space-y-3">
          <h3 className="font-black text-2xl text-white tracking-tight uppercase italic">{title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px] font-medium">{description}</p>
       </div>
    </motion.div>
  );
}