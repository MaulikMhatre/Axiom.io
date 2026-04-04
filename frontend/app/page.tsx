// "use client";

// import React from "react";
// import Link from "next/link";
// import NeuralBackground from "@/components/ui/flow-field-background";
// import { ShieldCheck, Zap, TrendingUp, ArrowRight, Sparkles, Activity } from "lucide-react";
// import SkyToggle from "@/components/ui/sky-toggle";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-transparent text-foreground font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-foreground">
      
//       {/* 🌌 BACKGROUND LAYER */}
//       <div className="fixed inset-0 -z-10 bg-background">
//         <NeuralBackground 
//           color="#818cf8" 
//           trailOpacity={0.12} 
//           particleCount={600} 
//           speed={0.7} 
//           scale={1}
//         />
//         {/* Dynamic radial mask to create depth and keep focus centered - changes based on theme */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(252,252,255,0.7)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
//       </div>

//       {/* 🧭 NAVIGATION HEADER */}
//       <nav className="fixed top-0 w-full z-50 border-b border-white dark:border-black shadow-lg dark:shadow-none/5 dark:border-white/5 bg-black/5 dark:bg-black/10 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-4 group">
//             <div className="p-2.5 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:scale-105 transition-all duration-500">
//                <Activity className="w-5 h-5 text-foreground" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xl font-black tracking-tighter uppercase italic leading-none text-foreground">
//                 Axiom.io <span className="text-indigo-700 dark:text-indigo-500">ID</span>
//               </span>
//               <span className="text-base text-indigo-600 dark:text-indigo-400 font-extrabold tracking-[0.4em] uppercase mt-1 opacity-70">
//                 Audit Engine v1.0
//               </span>
//             </div>
//           </Link>
          
//           <div className="flex items-center gap-8">
//             <Link href="/login" className="text-base font-extrabold text-zinc-800 dark:text-zinc-300 hover:text-foreground transition-all hover:tracking-widest uppercase tracking-widest duration-300">
//               Archives Access
//             </Link>
//             <Link 
//               href="/register" 
//               className="px-6 py-3 bg-zinc-900 border border-zinc-800 dark:bg-white text-zinc-100 dark:text-black rounded-2xl text-base font-black uppercase tracking-[0.2em] hover:bg-zinc-800 dark:hover:bg-indigo-50 dark:hover:text-indigo-600 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/20"
//             >
//               Initialize Identity
//             </Link>
//             <div className="scale-75 origin-right">
//               <SkyToggle />
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* 🚀 HERO SECTION */}
//       <main className="flex-1 max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-6 pt-48 pb-32 relative">
        
//         {/* Decorative Badge */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="mb-10 p-2 px-5 rounded-full bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-3xl text-base font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-3 shadow-2xl"
//         >
//           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_15px_rgba(99,102,241,1)]" />
//           Neural Integrity Verification Active
//         </motion.div>

//         <motion.div
//            initial={{ opacity: 0, scale: 0.98 }}
//            animate={{ opacity: 1, scale: 1 }}
//            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
//         >
//           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground italic tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 dark:from-white via-zinc-200 to-zinc-600 drop-shadow-2xl">
//   VERIFY YOUR <br/>
//   <span className="text-indigo-600 dark:text-indigo-400 relative">
//     DIGITAL IDENTITY
//     {/* Adjusted sparkle position for smaller text */}
//     <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse delay-700" />
//   </span>
// </h1>
//         </motion.div>
        
//         <motion.p 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 0.8 }}
//           className="max-w-3xl text-xl md:text-2xl text-zinc-800 dark:text-zinc-300 font-bold mb-16 leading-relaxed tracking-tight"
//         >
//           Axiom ID deploys advanced neural auditing to cross-verify professional assertions across GitHub, LinkedIn, and Portfolios. <span className="text-zinc-800 dark:text-zinc-200 underline decoration-indigo-500/50 underline-offset-8">Eliminate ambiguity.</span> Build absolute trust.
//         </motion.p>

//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1 }}
//           className="flex flex-col sm:flex-row gap-8 w-full max-w-xl"
//         >
//           <Link
//             href="/dashboard"
//             className="group flex-2 h-20 bg-white text-black rounded-[2rem] font-black text-base uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] relative overflow-hidden"
//           >
//             <span className="relative z-10">Launch Neural Core</span>
//             <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" />
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//           </Link>
//           <Link
//             href="/resume"
//             className="flex-1 h-20 bg-transparent border-2 border-border text-foreground rounded-[2rem] font-black text-base uppercase tracking-[0.3em] flex items-center justify-center hover:bg-zinc-100/50 dark:bg-white/5 transition-all hover:border-white/30 backdrop-blur-lg"
//           >
//             Upload Resume
//           </Link>
//         </motion.div>

//         {/* 🛠️ FEATURE GRID */}
//         <div className="mt-60 grid grid-cols-1 md:grid-cols-3 gap-12 w-full border-t border-border pt-24">
//           <FeatureCard 
//             icon={<ShieldCheck className="w-8 h-8" />}
//             title="Brutal Audit"
//             description="AI that reconstructs your professional timeline to find inconsistencies recruiters despise."
//             color="indigo"
//             delay={1.2}
//           />
//           <FeatureCard 
//             icon={<Zap className="w-8 h-8" />}
//             title="Trust Index"
//             description="A multidimensional credibility score derived from multi-platform data triangulation."
//             color="violet"
//             delay={1.4}
//           />
//           <FeatureCard 
//             icon={<TrendingUp className="w-8 h-8" />}
//             title="Growth Path"
//             description="Algorithmic recommendations to bridge experience gaps and amplify your market value."
//             color="emerald"
//             delay={1.6}
//           />
//         </div>
//       </main>
      
//       {/* 📜 FOOTER */}
//       <footer className="w-full py-20 border-t border-white dark:border-black shadow-lg dark:shadow-none/5 dark:border-white/5 mt-20 relative bg-background/20 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
//           <div className="flex items-center gap-4">
//             <div className="w-8 h-8 bg-background/50 border border-border rounded-lg flex items-center justify-center font-black text-foreground text-base italic">A</div>
//             <div className="flex flex-col">
//                 <span className="font-black tracking-tighter text-lg text-foreground">Axiom.io</span>
//                 <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest">Neural Verification System</span>
//             </div>
//           </div>
          
//           <div className="flex gap-10 text-base font-black text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-[0.2em]">
//              <a href="#" className="hover:text-foreground transition-colors">Privacy Protocal</a>
//              <a href="#" className="hover:text-foreground transition-colors">Data Integrity</a>
//              <a href="#" className="hover:text-foreground transition-colors">Governance</a>
//           </div>

//           <p className="text-base text-zinc-800 dark:text-zinc-300 font-black uppercase tracking-[0.3em]">
//             © 2026 AXM_SYSTEMS. ALL DATA ENCRYPTED.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function FeatureCard({ icon, title, description, color, delay }: { icon: React.ReactNode, title: string, description: string, color: string, delay: number }) {
//   const colorMap: Record<string, string> = {
//     indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)]",
//     violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-500 dark:text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.05)]",
//     emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]",
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
//       className="flex flex-col items-center gap-6 group cursor-default"
//     >
//        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg]", colorMap[color])}>
//           {icon}
//        </div>
//        <div className="space-y-3">
//           <h3 className="font-black text-2xl text-foreground tracking-tight uppercase italic">{title}</h3>
//           <p className="text-base text-zinc-800 dark:text-zinc-300 font-bold leading-relaxed max-w-[280px]">{description}</p>
//        </div>
//     </motion.div>
//   );
// }

























"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Github, Cpu, Layers, Code, Award, Zap, 
  AlertCircle, CheckCircle2, ArrowDown, LogIn, UserPlus,
  Terminal, Activity, FileSignature, Linkedin, Globe, Mail,
  Lock, Search, Check, Shield, SearchCode, Boxes, History, BarChart3, Fingerprint, Database, Sparkles, RefreshCcw, PlusCircle, ChevronRight
} from 'lucide-react';

export default function AxiomFinal() {
  const [subject, setSubject] = useState('');

  // --- INTERNAL PARTICLES LOGIC ---
  const initParticles = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).particlesJS) {
      (window as any).particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#00f5ff" },
          shape: { type: "circle" },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#00d9ff",
            opacity: 0.2,
            width: 1
          },
          move: { enable: true, speed: 1, direction: "none", out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "grab" } },
          modes: { grab: { distance: 200 } }
        },
        retina_detect: true
      });
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = initParticles;
    return () => {
      const scriptTag = document.querySelector(`script[src*="particles.min.js"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, [initParticles]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* 1. BACKGROUND IMAGE LAYER */}
      <div 
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')" 
        }}
      />
      
      {/* 2. DARK OVERLAY */}
      <div className="fixed inset-0 -z-25 bg-[#000a1f]/85 backdrop-blur-[2px]" />

      {/* 3. PARTICLES LAYER */}
      <div id="particles-js" className="fixed inset-0 -z-20" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan { 0% { top: -10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        
        /* Unified Glow & Transition System */
        .glow-box { 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid rgba(255,255,255,0.1); 
        }
        
        .glow-blue:hover { 
          border-color: #60a5fa !important; 
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3); 
          transform: translateY(-4px);
        }
        
        .glow-red:hover { 
          border-color: #f87171 !important; 
          box-shadow: 0 0 30px rgba(248, 113, 113, 0.2); 
          transform: translateY(-4px);
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page1-img-container {
          transition: all 0.5s ease;
          opacity: 0.8;
          filter: contrast(1.1) brightness(0.9);
        }
        .page1-img-container:hover {
          transform: translateY(-8px);
          opacity: 1;
          filter: contrast(1.1) brightness(1.1);
        }
        .page1-img {
          width: 100%;
          height: 380px; 
          object-fit: cover;
          border-radius: 0.5rem; 
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
        }
        .page1-img-container:hover .page1-img {
          box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .scanline { width: 100%; height: 2px; background: rgba(59, 130, 246, 0.2); position: absolute; animation: scan 4s linear infinite; }
      `}} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col pt-10 pb-20 px-6 max-w-7xl mx-auto fade-in-up">
        
         <div className="flex justify-between items-center w-full z-10 mb-20">
             <div className="flex gap-4">
               <Link href="/login" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all backdrop-blur-sm shadow-md glow-box glow-blue">
                 <LogIn size={16} className="text-blue-400" /> Log In
               </Link>
               <Link href="/register" className="px-6 py-3 bg-blue-600 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                 <UserPlus size={16} /> Register
               </Link>
             </div>
         </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">AXIOM.IO</h2>
                </div>
                <h1 className="text-5xl md:text-8xl font-black italic tracking-tight leading-[0.9] uppercase">
                    Proof of <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    CAPABILITY.
                    </span>
                </h1>
                <p className="text-blue-100/70 text-lg max-w-lg leading-relaxed font-medium">
                    Bridging the gap between student talent and recruiter trust. One verified score for your <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">GitHub</span>, <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">LinkedIn</span>, and <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">Projects</span>.
                </p>
                
                <div className="flex w-full max-w-lg gap-4 pt-4">
                    <Link href="/register" className="flex-1 h-16 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-2xl group">
                        Initialize Identity <ChevronRight size={18} className="transition-transform group-hover:translate-x-2"/>
                    </Link>
                    <Link href="/login" className="flex-1 h-16 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-white/10 transition-all">
                        Portal Login
                    </Link>
                </div>
            </div>

            <div className="relative z-10 flex gap-4 items-start">
                <div className="page1-img-container flex-1">
                    <img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop" className="page1-img" alt="GitHub" />
                </div>
                <div className="page1-img-container flex-1 pt-6"> 
                    <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop" className="page1-img" alt="Portfolio" />
                </div>
                <div className="page1-img-container flex-1">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" className="page1-img" alt="Code" />
                </div>
            </div>
        </div>
      </section>

      {/* --- PAGE 2: UNIFIED PROFILE --- */}
      <section id="student-protocol" className="relative py-32 px-6 bg-black/40 backdrop-blur-3xl border-t border-white/5 fade-in-up">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-stretch">
          
          <div className="relative group h-full flex flex-col">
             <div className="absolute -inset-10 bg-blue-500/10 blur-[120px] rounded-full opacity-50" />
             <div className="relative bg-[#000d2b]/95 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-blue-500/20 glow-box glow-blue shadow-2xl flex-1 flex flex-col overflow-hidden">
                <div className="scanline" />
                
                <div className="flex items-center gap-5 justify-between mb-8">
                  <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/20 flex items-center justify-center font-black italic shadow-xl text-white text-xl relative z-10">RS</div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#000d2b] rounded-full z-20 animate-pulse" />
                      </div>
                      <div>
                          <p className="text-lg font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                            Rahul Sharma <Lock size={12} className="text-blue-400" />
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400/80">VCET Student • Node: MUM-01</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400 tracking-tighter">842.09</p>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-100/30">H-Index Hash: 0x9f22</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 glow-box glow-blue">
                        <div className="flex items-center gap-2 mb-2 text-cyan-400">
                          <SearchCode size={14} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Project Audit</span>
                        </div>
                        <p className="text-xs font-bold text-white mb-1">AetherLink OS</p>
                        <p className="text-[9px] text-green-500 font-black uppercase">Verified S-Tier</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 glow-box glow-blue">
                        <div className="flex items-center gap-2 mb-2 text-orange-400">
                          <Activity size={14} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Assessed Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                           <span className="text-[7px] px-1.5 py-0.5 bg-blue-500/20 rounded border border-blue-500/30">C++</span>
                           <span className="text-[7px] px-1.5 py-0.5 bg-blue-500/20 rounded border border-blue-500/30">Haskell</span>
                           <span className="text-[7px] px-1.5 py-0.5 bg-blue-500/20 rounded border border-blue-500/30">React</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border-l-2 border-blue-500 glow-box glow-blue">
                      <div className="flex items-center gap-3">
                         <Shield className="text-blue-400" size={16}/>
                         <p className="text-[10px] font-black uppercase tracking-wider">NPTEL: Design Thinking</p>
                      </div>
                      <Check className="text-green-500" size={14}/>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border-l-2 border-purple-500 glow-box glow-blue">
                      <div className="flex items-center gap-3">
                         <Boxes className="text-purple-400" size={16}/>
                         <p className="text-[10px] font-black uppercase tracking-wider">Milestone: 1st Place Hackathon</p>
                      </div>
                      <Award className="text-purple-400 animate-pulse" size={14}/>
                   </div>
                </div>

                <div className="bg-black/60 rounded-2xl border border-white/10 p-5 font-mono text-[9px] flex-1 mb-6 glow-box glow-blue">
                   <div className="flex items-center gap-2 text-blue-400/60 mb-3 border-b border-white/5 pb-2 uppercase font-black tracking-widest">
                      <Terminal size={12} /> Sync_Protocol_Active
                   </div>
                   <div className="space-y-2 opacity-60">
                      <p><span className="text-blue-500">[FETCH]</span> Validating Repository "Phrelis"...</p>
                      <p><span className="text-green-500">[OK]</span> GRC Compliance Logic Verified</p>
                      <p><span className="text-blue-500">[SYNC]</span> Pulling Academic Nodes...</p>
                      <p className="animate-pulse">_</p>
                   </div>
                </div>

                <div className="h-20 bg-blue-600/5 rounded-2xl border border-blue-500/10 p-5 flex items-end gap-1.5 overflow-hidden">
                    {[30, 60, 45, 80, 100, 65, 75, 40, 55, 85, 95, 70, 90, 40, 80, 60, 50, 70, 40, 90, 100].map((h, i) => (
                       <div key={i} className="flex-1 bg-blue-600/10 rounded-sm" style={{ height: `${h}%` }}>
                          <div className="h-full bg-blue-500/30 group-hover:bg-blue-400 transition-colors duration-500" />
                       </div>
                    ))}
                </div>
             </div>
          </div>

          <div className="space-y-8 flex flex-col justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest w-fit">
                <Terminal size={14} /> Simplified Talent Mapping
             </div>
             <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">
                Unified <span className="text-blue-400">Student</span> Profile.
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 glow-box glow-blue flex flex-col justify-between">
                   <div className="flex gap-4 mb-3">
                      <div className="p-2.5 bg-blue-600/20 rounded-xl h-fit text-blue-400"><FileSignature size={20}/></div>
                      <h4 className="text-md font-black italic uppercase text-white leading-tight">Academic <br/>Core</h4>
                   </div>
                   <p className="text-xs text-blue-100/40 mb-3">Verified GPA from university nodes and NPTEL achievements.</p>
                   <div className="flex flex-col gap-1.5 text-[8px] font-black uppercase text-blue-400 border-t border-white/5 pt-3">
                      <span>Node Status: Synced</span>
                      <span>Confidence: 99.8%</span>
                   </div>
                </div>

                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 glow-box glow-blue flex flex-col justify-between">
                   <div className="flex gap-4 mb-3">
                      <div className="p-2.5 bg-cyan-600/20 rounded-xl h-fit text-cyan-400"><Github size={20}/></div>
                      <h4 className="text-md font-black italic uppercase text-white leading-tight">Code <br/>Verifier</h4>
                   </div>
                   <p className="text-xs text-blue-100/40 mb-3">GitHub activity audit and commit-to-logic flow analysis.</p>
                   <div className="flex flex-col gap-1.5 text-[8px] font-black uppercase text-cyan-400 border-t border-white/5 pt-3">
                      <span>120+ Verified Commits</span>
                      <span>Quality Grade: Platinum</span>
                   </div>
                </div>

                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 glow-box glow-blue flex flex-col justify-between">
                   <div className="flex gap-4 mb-3">
                      <div className="p-2.5 bg-purple-600/20 rounded-xl h-fit text-purple-400"><Layers size={20}/></div>
                      <h4 className="text-md font-black italic uppercase text-white leading-tight">Project <br/>Audit</h4>
                   </div>
                   <p className="text-xs text-blue-100/40 mb-3">Proof of work validation for unforgeable quality control.</p>
                   <div className="flex flex-col gap-1.5 text-[8px] font-black uppercase text-purple-400 border-t border-white/5 pt-3">
                      <span>Verified: Phrelis AI</span>
                      <span>GRC Protocol Checked</span>
                   </div>
                </div>

                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 glow-box glow-blue flex flex-col justify-between">
                   <div className="flex gap-4 mb-3">
                      <div className="p-2.5 bg-green-600/20 rounded-xl h-fit text-green-400"><Cpu size={20}/></div>
                      <h4 className="text-md font-black italic uppercase text-white leading-tight">Skill <br/>Matrix</h4>
                   </div>
                   <p className="text-xs text-blue-100/40 mb-3">Neural mapping of cross-domain technical competencies.</p>
                   <div className="flex flex-col gap-1.5 text-[8px] font-black uppercase text-green-400 border-t border-white/5 pt-3">
                      <span>C++ / React / Haskell</span>
                      <span>Logic Depth: High</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- PAGE 3: PROBLEM & RESOLUTION --- */}
      <section id="problem-statement" className="relative py-32 px-6 border-y border-white/10 bg-[#000d2b]/30 backdrop-blur-lg overflow-hidden fade-in-up">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-stretch">
            
            <div className="space-y-6 flex flex-col justify-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <AlertCircle size={14} /> The Industry Crisis
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight mb-4">
                  Marks are <span className="text-red-500 underline decoration-red-900 underline-offset-8">Lying.</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                 <div className="flex gap-5 p-5 rounded-3xl bg-white/5 border border-white/10 glow-box glow-red">
                    <div className="p-3 bg-red-600/20 rounded-xl h-fit text-red-500"><BarChart3 size={20}/></div>
                    <div>
                       <h4 className="text-md font-black italic uppercase text-white mb-1 leading-tight">The Merit Gap</h4>
                       <p className="text-xs text-blue-100/40">Hackathon skills have no unified verification node. Practical brilliance remains invisible.</p>
                       <p className="text-[9px] text-red-400 mt-2 font-black uppercase">Detection: 85% Talent Blindness</p>
                    </div>
                 </div>

                 <div className="flex gap-5 p-5 rounded-3xl bg-white/5 border border-white/10 glow-box glow-red">
                    <div className="p-3 bg-red-600/20 rounded-xl h-fit text-red-500"><ShieldCheck size={20}/></div>
                    <div>
                       <h4 className="text-md font-black italic uppercase text-white mb-1 leading-tight">Recruiter Blindness</h4>
                       <p className="text-xs text-blue-100/40">Traditional degrees fail to prove production-grade capabilities. Recruitment relies on hearsay.</p>
                       <p className="text-[9px] text-red-400 mt-2 font-black uppercase">Impact: High Hiring Risks</p>
                    </div>
                 </div>

                 <div className="flex gap-5 p-5 rounded-3xl bg-white/5 border border-white/10 glow-box glow-red">
                    <div className="p-3 bg-red-600/20 rounded-xl h-fit text-red-500"><Fingerprint size={20}/></div>
                    <div>
                       <h4 className="text-md font-black italic uppercase text-white mb-1 leading-tight">Fragmented Identity</h4>
                       <p className="text-xs text-blue-100/40">GitHub, LinkedIn, and Grades are disconnected nodes. Verification is manual and slow.</p>
                       <p className="text-[9px] text-red-400 mt-2 font-black uppercase">Node Error: Lack of Sync</p>
                    </div>
                 </div>

                 <div className="flex gap-5 p-5 rounded-3xl bg-white/5 border border-white/10 glow-box glow-red">
                    <div className="p-3 bg-red-600/20 rounded-xl h-fit text-red-500"><Database size={20}/></div>
                    <div>
                       <h4 className="text-md font-black italic uppercase text-white mb-1 leading-tight">Static Data Decay</h4>
                       <p className="text-xs text-blue-100/40">Skills evolve every week, but PDF resumes stay frozen. Platforms fail to track growth cycles.</p>
                       <p className="text-[9px] text-red-400 mt-2 font-black uppercase">Latency: High Skill Misalignment</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="relative group flex flex-col h-full">
               <div className="absolute -inset-4 bg-red-500/10 blur-3xl rounded-full opacity-50" />
               <div className="relative bg-[#000a1f] border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-2xl flex-1 flex flex-col justify-between glow-box glow-blue">
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">Axiom <span className="text-blue-400">Resolution</span></h3>
                    <div className="space-y-6">
                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 glow-box glow-blue">
                          <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} />
                          <div>
                             <p className="text-sm font-bold text-white uppercase tracking-tight mb-1">Unified Proof Node</p>
                             <p className="text-[10px] text-blue-100/40 leading-relaxed">Real-time sync between academic scores and live repo commits.</p>
                             <div className="flex gap-2 mt-2">
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded">LIVE SYNC</span>
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded">ACADEMIC-CHECKED</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 glow-box glow-blue">
                          <Sparkles className="text-blue-400 shrink-0 mt-1" size={24} />
                          <div>
                             <p className="text-sm font-bold text-white uppercase tracking-tight mb-1">Neural Code Audit</p>
                             <p className="text-[10px] text-blue-100/40 leading-relaxed">Mathematical verification of technical logic and architecture.</p>
                             <div className="flex gap-2 mt-2">
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">LOGIC-MAP</span>
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">S-TIER VERIFIED</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 glow-box glow-blue">
                          <RefreshCcw className="text-purple-400 shrink-0 mt-1" size={24} />
                          <div>
                             <p className="text-sm font-bold text-white uppercase tracking-tight mb-1">Auto-Update Engine</p>
                             <p className="text-[10px] text-blue-100/40 leading-relaxed">Axiom updates your capability index as your skills grow.</p>
                             <div className="flex gap-2 mt-2">
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">24/7 MONITORING</span>
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">DYNAMIC SCORE</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 glow-box glow-blue">
                          <Lock className="text-cyan-400 shrink-0 mt-1" size={24} />
                          <div>
                             <p className="text-sm font-bold text-white uppercase tracking-tight mb-1">Cryptographic Trust</p>
                             <p className="text-[10px] text-blue-100/40 leading-relaxed">Unforgeable public profile secured by distributed nodes.</p>
                             <div className="flex gap-2 mt-2">
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">ZERO-TRUST PROTOCOL</span>
                                <span className="text-[7px] font-black px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">PUBLIC HASH</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-8 p-6 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-center glow-box glow-blue">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Protocol Status</p>
                    <p className="text-2xl font-black italic uppercase tracking-tighter">Verified Capability Node</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative pt-20 pb-10 px-6 bg-[#000a1f]/80 backdrop-blur-xl border-t border-white/10 overflow-hidden z-10 fade-in-up">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-500" size={32} />
                <span className="text-2xl font-black italic tracking-tighter uppercase text-white">AXIOM.IO</span>
              </div>
              <p className="text-blue-100/40 text-sm max-w-sm leading-relaxed font-medium">
                The world's first proof-of-capability protocol for students. Built for Mumbai's engineering ecosystem.
              </p>
              <div className="flex gap-4">
                  {[Github, Linkedin, Globe, Mail].map((Icon, i) => (
                   <a key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all glow-box glow-blue">
                      <Icon size={18} />
                   </a>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">Navigation</h4>
              <ul className="space-y-4 text-xs font-bold text-blue-100/40 uppercase tracking-widest">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Protocol Dashboard</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Problem Statement</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">VCET Pilot Program</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">Status</h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 glow-box glow-blue">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live Syncing</span>
                 </div>
                 <p className="text-[10px] font-bold text-blue-100/30 uppercase tracking-widest">Node: MUM-01</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-100/20 italic">
              Developed by AXIOM Team • VCET Mumbai • 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}