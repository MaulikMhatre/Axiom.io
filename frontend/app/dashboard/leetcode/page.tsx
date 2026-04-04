// "use client";

// import React, { useEffect, useState, useRef } from 'react';
// import { 
//   Brain, Zap, Target, Layers, 
//   Loader2, Sun, Moon, Info,
//   Trophy, Activity, ChevronRight,
//   TrendingUp, Award, BrainCircuit
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "next-themes";
// import { fetchLeetCodeProfile } from "@/lib/api";

// // --- TYPES ---
// interface LeetCodeData {
//   username: string;
//   ranking: number;
//   acceptance: number;
//   totalSolved: number;
//   aiAudit: {
//     algorithmic_iq: number;
//     strategic_verdict: string;
//     vectors: {
//       "Data Structures": number;
//       Complexity: number;
//       Grit: number;
//     };
//     roadmap: Array<{ title: string; description: string }>;
//     easy_count: number;
//     medium_count: number;
//     hard_count: number;
//   };
// }

// export default function LeetCodeDashboard() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<LeetCodeData | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setMounted(true);
//     const storedEmail = localStorage.getItem('user_email');
//     const localUsername = localStorage.getItem('lc_username');

//     const fetchData = async () => {
//       try {
//         let finalData = null;

//         if (storedEmail) {
//             const resp = await fetch(`http://localhost:8000/api/me?email=${storedEmail}`);
//             if (resp.ok) {
//                 const profile = await resp.json();
//                 if (profile.leetcode?.aiAudit) {
//                     finalData = profile.leetcode;
//                 }
//             }
//         }

//         if (finalData) {
//             setData(finalData);
//         } else if (localUsername) {
//             // If no DB data but we have a username, fetch it fresh
//             const result = await fetchLeetCodeProfile(localUsername, storedEmail || undefined);
//             setData(result);
//         } else {
//             throw new Error("No LeetCode identity found. Please sync your account in Settings.");
//         }
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!mounted) return null;

//   return (
//     <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-500/30 overflow-x-hidden
//       ${theme === 'dark' ? 'bg-[#020202] text-white' : 'bg-[#F9FAFB] text-slate-900'}`}>
      
//       {/* --- TOP BAR --- */}
//       <div className="fixed top-0 left-0 right-0 z-50 h-20 px-8 flex justify-between items-center bg-transparent pointer-events-none">
//         <div className="pointer-events-auto">
//           <div className={`px-4 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase backdrop-blur-md
//             ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-white border-slate-200 shadow-sm text-slate-500'}`}>
//             ALGO_SYNC_ESTABLISHED // NODE_0X{Math.random().toString(16).slice(2, 6).toUpperCase()}
//           </div>
//         </div>
//         <div className="pointer-events-auto">
//           <ThemeToggle theme={theme} setTheme={setTheme} />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 pt-28 pb-20 space-y-12">
//         <AnimatePresence mode="wait">
//           {loading ? (
//             <SkeletonLoader key="skeleton" theme={theme} />
//           ) : error ? (
//             <ErrorState key="error" message={error} theme={theme} />
//           ) : (
//             <motion.div 
//               key="content"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="space-y-12"
//             >
//               <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//                 <div className="relative group flex justify-center lg:justify-start">
//                   <RadialSpeedometer iq={data?.aiAudit.algorithmic_iq || 0} theme={theme} />
//                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 lg:left-32 lg:translate-x-0 w-full text-center lg:text-left">
//                     <span className={`text-2xl font-black uppercase tracking-tight
//                       ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
//                       Algorithmic IQ
//                     </span>
//                     <div className={`h-1 w-16 mt-2 rounded-full
//                       ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
//                   </div>
//                 </div>

//                 <div className="space-y-10">
//                   <div className="space-y-3">
//                     <h2 className={`text-5xl font-black tracking-tight leading-none
//                       ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
//                       {data?.username}
//                     </h2>
//                     <p className={`font-mono text-sm tracking-widest uppercase font-bold
//                       ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
//                       Global Rank: <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>#{data?.ranking.toLocaleString()}</span>
//                     </p>
//                   </div>

//                   {/* Technical Vector Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     {data?.aiAudit.vectors && Object.entries(data.aiAudit.vectors).map(([label, value], i) => (
//                       <TechnicalVector key={label} label={label} value={value} theme={theme} index={i} />
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               {/* --- DISTRIBUTION TERMINAL: THERMAL MATRIX --- */}
//               <section className={`rounded-3xl border p-10 relative overflow-hidden transition-all
//                 ${theme === 'dark' ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
                
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
//                   <div className="space-y-2">
//                     <span className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border
//                       ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
//                       Algorithm metrics
//                     </span>
//                     <h3 className={`text-3xl font-black tracking-tight
//                       ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
//                       Problem Distribution
//                     </h3>
//                   </div>
//                   <div className={`px-6 py-3 rounded-2xl border font-mono text-xs font-bold uppercase tracking-widest
//                     ${theme === 'dark' ? 'bg-zinc-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
//                     Confirmed Solved: <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>{data?.totalSolved}</span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <ThermalBadge 
//                     label="Easy" 
//                     count={data?.aiAudit.easy_count || 0} 
//                     color="#06b6d4" 
//                     theme={theme} 
//                     icon={<Zap size={20} />}
//                   />
//                   <ThermalBadge 
//                     label="Medium" 
//                     count={data?.aiAudit.medium_count || 0} 
//                     color="#f59e0b" 
//                     theme={theme} 
//                     icon={<Activity size={20} />}
//                   />
//                   <ThermalBadge 
//                     label="Hard" 
//                     count={data?.aiAudit.hard_count || 0} 
//                     color="#f43f5e" 
//                     theme={theme} 
//                     icon={<Trophy size={20} />}
//                   />
//                 </div>
//               </section>

//               {/* --- INTERACTIVE AI VERDICT --- */}
//               <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className={`lg:col-span-2 rounded-3xl border p-12 relative overflow-hidden flex flex-col justify-between min-h-[450px]
//                   ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  
//                   <div className="space-y-10 relative z-10">
//                     <div className="flex items-center gap-4">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-600/10 text-blue-600'}`}>
//                         <Brain size={20} strokeWidth={2.5} />
//                       </div>
//                       <h4 className={`text-sm font-black uppercase tracking-[0.2em]
//                         ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
//                         AI Strategic Audit
//                       </h4>
//                     </div>

//                     <TypingVerdict text={data?.aiAudit.strategic_verdict || ""} theme={theme} />
//                   </div>

//                   <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t
//                     ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
//                     <div className={`text-xs font-mono uppercase tracking-[0.2em] font-bold
//                       ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
//                       Neural Analysis State: <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>CALIBRATED</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ROADMAP TIMELINE */}
//                 <div className={`rounded-3xl border p-10
//                   ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
//                   <div className="flex items-center gap-4 mb-10">
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-600/10 text-purple-600'}`}>
//                       <TrendingUp size={20} strokeWidth={2.5} />
//                     </div>
//                     <h4 className={`text-sm font-black uppercase tracking-[0.2em]
//                       ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
//                       Growth Roadmap
//                     </h4>
//                   </div>

//                   <div className="space-y-6">
//                     {data?.aiAudit.roadmap.map((step, i) => (
//                       <div key={i} className="flex gap-4 relative group">
//                         <div className="flex flex-col items-center">
//                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs z-10 transition-transform group-hover:scale-110
//                             ${theme === 'dark' ? 'bg-zinc-900 border border-[#111] text-purple-400' : 'bg-white border border-[#E5E7EB] text-purple-600'}`}>
//                             {i + 1}
//                           </div>
//                           {i !== (data?.aiAudit.roadmap.length - 1) && (
//                             <div className={`w-0.5 h-full -my-1 opacity-20
//                               ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'}`}></div>
//                           )}
//                         </div>
//                         <div className="pb-6">
//                           <h5 className={`font-black uppercase tracking-tight mb-1
//                             ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
//                             {step.title}
//                           </h5>
//                           <p className={`text-sm font-medium leading-relaxed
//                             ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
//                             {step.description}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* --- BACKGROUND FX --- */}
//       <div className={`fixed inset-0 pointer-events-none -z-10 transition-opacity duration-1000
//         ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
//       </div>
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function RadialSpeedometer({ iq, theme }: { iq: number, theme: string | undefined }) {
//   const isDark = theme === 'dark';
//   const radius = 95;
//   const circumference = 2 * Math.PI * radius;
//   const progress = (iq / 100) * (circumference * 0.75);

//   return (
//     <div className="relative flex items-center justify-center p-8">
//       <svg width="240" height="240" viewBox="0 0 240 240" className="transform -rotate-[225deg]">
//         {/* Track */}
//         <circle
//           cx="120" cy="120" r={radius}
//           fill="none"
//           stroke={isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"}
//           strokeWidth="8"
//           strokeDasharray={`${circumference} ${circumference}`}
//           strokeDashoffset={circumference * 0.25}
//           strokeLinecap="round"
//         />
//         {/* Progress */}
//         <motion.circle
//           cx="120" cy="120" r={radius}
//           fill="none"
//           stroke={isDark ? "url(#grad-dark)" : "url(#grad-light)"}
//           strokeWidth="8"
//           strokeDasharray={`${circumference} ${circumference}`}
//           initial={{ strokeDashoffset: circumference }}
//           animate={{ strokeDashoffset: circumference - progress + (circumference * 0.25) }}
//           transition={{ duration: 2, ease: "easeOut" }}
//           strokeLinecap="round"
//           style={{ 
//             filter: isDark ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' : 'none' 
//           }}
//         />
//         <defs>
//           <linearGradient id="grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#3b82f6" />
//             <stop offset="100%" stopColor="#a855f7" />
//           </linearGradient>
//           <linearGradient id="grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#2563eb" />
//             <stop offset="100%" stopColor="#9333ea" />
//           </linearGradient>
//         </defs>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center transform translate-y-2">
//         <motion.span 
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.5, duration: 1 }}
//           className={`text-6xl font-black tracking-tight leading-none
//             ${isDark ? 'text-white' : 'text-slate-900'}`}>
//           {iq}
//         </motion.span>
//         <span className={`text-[10px] font-mono font-bold tracking-[0.3em] uppercase mt-2
//           ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
//           Neural Index
//         </span>
//       </div>
//     </div>
//   );
// }

// function TechnicalVector({ label, value, theme, index }: { label: string, value: number, theme: string | undefined, index: number }) {
//   const isDark = theme === 'dark';
//   return (
//     <motion.div 
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 0.2 + (index * 0.1) }}
//       className="space-y-3"
//     >
//       <div className="flex justify-between items-end">
//         <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em]
//           ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
//           {label}
//         </span>
//         <span className={`text-sm font-black font-mono
//           ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
//           {value}%
//         </span>
//       </div>
//       <div className={`h-1.5 w-full rounded-full relative overflow-hidden
//         ${isDark ? 'bg-[#111]' : 'bg-[#F3F4F6]'}`}>
//         <motion.div 
//           initial={{ width: 0 }}
//           animate={{ width: `${value}%` }}
//           transition={{ duration: 1.5, delay: 0.5 + (index * 0.2), ease: "circOut" }}
//           className={`absolute inset-y-0 left-0 rounded-full
//             ${isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}
//         />
//       </div>
//     </motion.div>
//   );
// }

// function ThermalBadge({ label, count, color, theme, icon }: { label: string, count: number, color: string, theme: string | undefined, icon: React.ReactNode }) {
//   const isDark = theme === 'dark';
  
//   // Increase saturation for Light Mode as requested
//   const displayColor = isDark ? color : color; // Hex colors are already fairly saturated
  
//   return (
//     <motion.div 
//       whileHover={{ y: -4 }}
//       className={`relative p-8 rounded-3xl border transition-all cursor-default overflow-hidden
//         ${isDark ? 'bg-zinc-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}
//     >
//       <div className="relative z-10 flex flex-col justify-between h-28">
//         <div className="flex justify-between items-start">
//           <div className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`} style={{ color: displayColor }}>
//             {icon}
//           </div>
//           <div className="text-right">
//              <div className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
//                {count}
//              </div>
//              <div className={`text-[9px] font-mono font-bold uppercase tracking-widest opacity-60 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
//                Completed
//              </div>
//           </div>
//         </div>
//         <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: displayColor }}>
//           {label} Level
//         </h4>
//       </div>
//     </motion.div>
//   );
// }

// function TypingVerdict({ text, theme }: { text: string, theme: string | undefined }) {
//   const [displayedText, setDisplayedText] = useState("");
//   const isDark = theme === 'dark';

//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       setDisplayedText(text.slice(0, index));
//       index++;
//       if (index > text.length) clearInterval(interval);
//     }, 20);
//     return () => clearInterval(interval);
//   }, [text]);

//   return (
//     <div className="relative">
//       <p className={`text-3xl font-bold tracking-tight leading-snug
//         ${isDark ? 'text-white' : 'text-slate-900'}`}>
//         {displayedText}
//         <motion.span 
//           animate={{ opacity: [1, 0] }}
//           transition={{ repeat: Infinity, duration: 0.8 }}
//           className={`inline-block w-1.5 h-8 ml-1 translate-y-1
//             ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
//         />
//       </p>
//     </div>
//   );
// }

// function ThemeToggle({ theme, setTheme }: any) {
//   return (
//     <motion.button
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//       className={`p-4 rounded-2xl border backdrop-blur-md pointer-events-auto
//         ${theme === 'dark' ? 'bg-white/5 border-[#111] text-zinc-400' : 'bg-black/5 border-[#E5E7EB] text-zinc-600'}`}
//     >
//       {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//     </motion.button>
//   );
// }

// function SkeletonLoader({ theme }: { theme: string | undefined }) {
//   const isDark = theme === 'dark';
//   return (
//     <div className="space-y-12 animate-pulse">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//         <div className="aspect-square w-64 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-800 opacity-20" />
//         <div className="space-y-8">
//            <div className="h-16 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl opacity-20" />
//            <div className="grid grid-cols-3 gap-6">
//              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl opacity-20" />
//              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl opacity-20" />
//              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl opacity-20" />
//            </div>
//         </div>
//       </div>
//       <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] opacity-20" />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 h-96 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] opacity-20" />
//         <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] opacity-20" />
//       </div>
//     </div>
//   );
// }

// function ErrorState({ message, theme }: { message: string, theme: string | undefined }) {
//   const isDark = theme === 'dark';
//   return (
//     <div className={`p-12 rounded-[2.5rem] border text-center space-y-6
//       ${isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-200'}`}>
//       <Info size={48} className="mx-auto text-red-500" />
//       <h3 className={`text-2xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
//         Neural Link Error
//       </h3>
//       <p className="text-zinc-500 font-mono">
//         {message}
//       </p>
//       <button 
//         onClick={() => window.location.reload()}
//         className={`px-6 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-widest border transition-all
//           ${isDark ? 'bg-zinc-900 border-[#111] hover:bg-zinc-800 text-white' : 'bg-white border-[#E5E7EB] hover:bg-zinc-50 text-zinc-900'}`}>
//         Retry Initialization
//       </button>
//     </div>
//   );
// }



















"use client";

import React, { useEffect, useState } from "react";
import {
  Brain, Zap, Sun, Moon, Info,
  Trophy, Activity, TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { fetchLeetCodeProfile } from "@/lib/api";

// --- TYPES ---
interface LeetCodeData {
  username: string;
  ranking: number;
  acceptance: number;
  totalSolved: number;
  aiAudit: {
    algorithmic_iq: number;
    strategic_verdict: string;
    vectors: {
      "Data Structures": number;
      Complexity: number;
      Grit: number;
    };
    roadmap: Array<{ title: string; description: string }>;
    easy_count: number;
    medium_count: number;
    hard_count: number;
  };
}

export default function LeetCodeDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    const storedEmail = localStorage.getItem("user_email");
    const localUsername = localStorage.getItem("lc_username");

    const fetchData = async () => {
      try {
        let finalData = null;
        if (storedEmail) {
          const resp = await fetch(`http://localhost:8000/api/me?email=${storedEmail}`);
          if (resp.ok) {
            const profile = await resp.json();
            if (profile.leetcode?.aiAudit) finalData = profile.leetcode;
          }
        }

        if (finalData) {
          setData(finalData);
        } else if (localUsername) {
          const result = await fetchLeetCodeProfile(localUsername, storedEmail || undefined);
          setData(result);
        } else {
          throw new Error("No LeetCode identity found. Please sync in Settings.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 selection:bg-blue-500/30 overflow-x-hidden 
      ${isDark ? 'bg-[#020202] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full z-50 h-20 px-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          {/* <div className={`px-4 py-1.5 rounded-full border text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-md 
            ${isDark ? 'bg-white/5 border-white/10 text-zinc-500' : 'bg-white/80 border-slate-200 text-slate-400 shadow-sm'}`}>
            ALGO_SYNC_ESTABLISHED // NODE_{Math.random().toString(16).slice(2, 6).toUpperCase()}
          </div> */}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pt-28 pb-20 space-y-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <SkeletonLoader key="skeleton" theme={theme} />
          ) : error ? (
            <ErrorState key="error" message={error} theme={theme} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              {/* --- HERO SECTION --- */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative flex justify-center lg:justify-start">
                  <RadialSpeedometer iq={data?.aiAudit.algorithmic_iq || 0} theme={theme} />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:left-32 lg:translate-x-0 w-full text-center lg:text-left">
                    <span className="text-2xl font-black uppercase tracking-tighter">Algorithmic IQ</span>
                    <div className={`h-1 w-16 mt-2 rounded-full mx-auto lg:mx-0 ${isDark ? "bg-blue-500" : "bg-blue-600"}`} />
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-6xl font-black tracking-tighter leading-none">{data?.username}</h2>
                    <p className="font-mono text-xs tracking-[0.3em] uppercase font-bold opacity-50">
                      Global Rank: <span className={isDark ? "text-blue-400" : "text-blue-600"}>#{data?.ranking.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data?.aiAudit.vectors &&
                      Object.entries(data.aiAudit.vectors).map(([label, value], i) => (
                        <TechnicalVector key={label} label={label} value={value} theme={theme} index={i} />
                      ))}
                  </div>
                </div>
              </section>

              {/* --- METRICS GRID --- */}
              <section className={`rounded-[2.5rem] border p-10 relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                      Verified Distribution
                    </span>
                    <h3 className="text-3xl font-black tracking-tighter">Problem Distribution</h3>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl border font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    Total Solved: <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>{data?.totalSolved}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ThermalBadge label="Easy" count={data?.aiAudit.easy_count || 0} color={isDark ? "#06b6d4" : "#0891b2"} theme={theme} icon={<Zap size={20} />} />
                  <ThermalBadge label="Medium" count={data?.aiAudit.medium_count || 0} color={isDark ? "#f59e0b" : "#d97706"} theme={theme} icon={<Activity size={20} />} />
                  <ThermalBadge label="Hard" count={data?.aiAudit.hard_count || 0} color={isDark ? "#f43f5e" : "#e11d48"} theme={theme} icon={<Trophy size={20} />} />
                </div>
              </section>

              {/* --- VERDICT & ROADMAP --- */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-2 rounded-[2.5rem] border p-12 flex flex-col justify-between min-h-[400px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 opacity-50">
                      <Brain size={20} />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">AI Strategic Audit</h4>
                    </div>
                    <TypingVerdict text={data?.aiAudit.strategic_verdict || ""} theme={theme} />
                  </div>
                  <div className="pt-8 border-t border-white/10 dark:border-slate-100">
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">System State: <span className="text-green-500">CALIBRATED</span></span>
                  </div>
                </div>

                <div className={`rounded-[2.5rem] border p-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center gap-4 mb-10 opacity-50">
                    <TrendingUp size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Growth Roadmap</h4>
                  </div>
                  <div className="space-y-8">
                    {data?.aiAudit.roadmap.map((step, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${isDark ? 'bg-zinc-900 border-white/10 text-purple-400' : 'bg-slate-50 border-slate-200 text-purple-600'}`}>
                            {i + 1}
                          </div>
                          {i !== data?.aiAudit.roadmap.length - 1 && <div className="w-px h-full bg-current opacity-10 mt-2" />}
                        </div>
                        <div>
                          <h5 className="font-black uppercase tracking-tight text-sm mb-1">{step.title}</h5>
                          <p className="text-xs leading-relaxed opacity-60">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- REFINED SUB-COMPONENTS ---

function RadialSpeedometer({ iq, theme }: { iq: number; theme: string | undefined }) {
  const isDark = theme === "dark";
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (iq / 100) * (circumference * 0.75);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="240" height="240" viewBox="0 0 240 240" className="transform -rotate-[225deg]">
        <circle cx="120" cy="120" r={radius} fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="12" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * 0.25} strokeLinecap="round" />
        <motion.circle cx="120" cy="120" r={radius} fill="none" stroke={isDark ? "url(#lc-dark)" : "url(#lc-light)"} strokeWidth="12" strokeDasharray={`${circumference} ${circumference}`} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress + circumference * 0.25 }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" />
        <defs>
          <linearGradient id="lc-dark" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
          <linearGradient id="lc-light" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#9333ea" /></linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-2">
        <span className="text-7xl font-black tracking-tighter leading-none">{iq}</span>
        <span className={`text-[10px] font-mono font-bold tracking-[0.4em] uppercase mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>NEURAL</span>
      </div>
    </div>
  );
}

function TechnicalVector({ label, value, theme, index }: { label: string; value: number; theme: string | undefined; index: number }) {
  const isDark = theme === "dark";
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40">{label}</span>
        <span className="text-xs font-black font-mono">{value}%</span>
      </div>
      <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-200/50'}`}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>
    </motion.div>
  );
}

function ThermalBadge({ label, count, color, theme, icon }: { label: string; count: number; color: string; theme: string | undefined; icon: React.ReactNode }) {
  const isDark = theme === "dark";
  return (
    <div className={`p-8 rounded-3xl border transition-all ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`} style={{ color }}>{icon}</div>
        <div className="text-right">
          <div className="text-4xl font-black tracking-tighter">{count}</div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-30">Solved</div>
        </div>
      </div>
      <h4 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{label} Level</h4>
    </div>
  );
}

function TypingVerdict({ text, theme }: { text: string; theme: string | undefined }) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-3xl font-bold tracking-tight leading-snug">
      {displayedText}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1 h-8 ml-2 bg-blue-500 translate-y-1" />
    </p>
  );
}

function ThemeToggle({ theme, setTheme }: any) {
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-4 rounded-2xl border backdrop-blur-md pointer-events-auto transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

function SkeletonLoader({ theme }: any) {
  return <div className="space-y-12 animate-pulse opacity-20"><div className="h-64 w-full bg-current rounded-[3rem]" /><div className="h-96 w-full bg-current rounded-[3rem]" /></div>;
}

function ErrorState({ message, theme }: any) {
  return <div className="p-20 text-center border border-red-500/20 rounded-[3rem] bg-red-500/5"><Info size={40} className="mx-auto text-red-500 mb-6" /><h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Neural Link Failed</h3><p className="opacity-50 font-mono text-sm">{message}</p></div>;
}