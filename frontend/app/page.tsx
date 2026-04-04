"use client";

import React from "react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { ShieldCheck, Zap, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-zinc-100 font-sans relative overflow-x-hidden">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 bg-black">
        <NeuralBackground 
          color="#818cf8" 
          trailOpacity={0.12} 
          particleCount={600} 
          speed={0.8} 
          scale={1}
        />
        {/* Subtle radial mask to create depth and keep focus centered */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* HERO CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative">
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 p-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 inline-flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          Powered by Axiom Audit Engine
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-2xl">
            VERIFY YOUR <br/>
            <span className="text-indigo-500 relative">
              DIGITAL IDENTITY
              <Sparkles className="absolute -top-6 -right-10 w-8 h-8 text-indigo-400 animate-pulse delay-700" />
            </span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12 font-medium leading-relaxed"
        >
          Phronex ID uses advanced LLM auditing to verify your professional claims across LinkedIn, Github, and Portfolios. Stop guessing. Get brutal, honest feedback that builds trust.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
        >
          <a
            href="/dashboard"
            className="group flex-1 h-16 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] relative overflow-hidden"
          >
            <span className="relative z-10">Launch Dashboard</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </a>
          <a
            href="/resume"
            className="flex-1 h-16 bg-transparent border-2 border-white/10 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-white/5 transition-all hover:border-white/20"
          >
            Upload Resume
          </a>
        </motion.div>

        {/* Feature Grid with staggering animations */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-white/5 pt-16">
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Brutal Audit"
            description="AI that doesn't hold back. We find the inconsistencies recruiters hate."
            color="indigo"
            delay={1.0}
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Trust Score"
            description="Calculated from verifiable data across your entire digital footprint."
            color="violet"
            delay={1.2}
          />
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="Growth Roadmap"
            description="Actionable steps to fix discrepancy gaps and improve your value index."
            color="emerald"
            delay={1.4}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: { icon: React.ReactNode, title: string, description: string, color: string, delay: number }) {
  const colorMap: any = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center gap-3 group"
    >
       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border mb-2 transition-transform group-hover:scale-110 group-hover:rotate-3", colorMap[color])}>
          {icon}
       </div>
       <h3 className="font-bold text-xl">{title}</h3>
       <p className="text-sm text-zinc-500 leading-relaxed max-w-[240px]">{description}</p>
    </motion.div>
  );
}