"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Fingerprint, 
  Activity, 
  Code2, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Cpu, 
  Zap,
  ChevronRight,
  Search,
  TrendingUp
} from 'lucide-react';
import { useTheme } from 'next-themes';

type ScanState = 'IDLE' | 'SCANNING' | 'COMPLETED';

interface Metrics {
  cleanCodeIndex: number;
  securityLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
  maintainabilityScore: number;
  authenticityPercent: number;
  totalLoc: string;
  complexity: number;
  duplicateCode: number;
  dependencyHealth: number;
  aiVerdict: string;
}

const LOG_MESSAGES = [
  "[BOOTING_SANDBOX_ENVIRONMENT...]",
  "[EXTRACTING_RADON_COMPLEXITY...]",
  "[PERFORMING_SECURITY_PATTERN_MATCH...]",
  "[VERIFYING_COMMIT_AUTHENTICITY...]",
  "[HEURISTIC_ANALYSIS_IN_PROGRESS...]",
  "[GENERATING_NEURAL_FINGERPRINT...]",
  "[FINALIZING_FORENSIC_REPORT...]"
];

export default function AxiomForensicEngine() {
  const { theme } = useTheme();
  const [repoUrl, setRepoUrl] = useState('');
  const [scanState, setScanState] = useState<ScanState>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [displayedVerdict, setDisplayedVerdict] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setScanState('SCANNING');
    setLogs([]);
    setMetrics(null);
    setDisplayedVerdict('');

    // Simulate logs for aesthetic stream
    const logSimulator = async () => {
      for (let i = 0; i < LOG_MESSAGES.length; i++) {
        if (scanState === 'COMPLETED') break;
        await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
        setLogs(prev => [...prev, LOG_MESSAGES[i]]);
      }
    };
    logSimulator();

    try {
      const response = await fetch('http://localhost:8000/api/forensic-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        const errorMessage = errorData.detail || 'Forensic sync failed';
        setLogs(prev => [...prev, `[ERROR_STATUS_${response.status}]`, `[${errorMessage}]`]);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Artificial delay to let logs finish
      await new Promise(r => setTimeout(r, 2000));

      setMetrics({
        cleanCodeIndex: data.cleanCodeIndex,
        securityLevel: data.securityLevel,
        maintainabilityScore: data.maintainabilityScore,
        authenticityPercent: data.authenticityPercent,
        totalLoc: data.detailedMetrics?.totalLoc || '0',
        complexity: data.detailedMetrics?.complexity || 0,
        duplicateCode: data.detailedMetrics?.duplicateCode || 0,
        dependencyHealth: data.detailedMetrics?.dependencyHealth || 0,
        aiVerdict: data.aiVerdict
      });
      setScanState('COMPLETED');
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "[ERROR_NEURAL_LINK_SEVERED]", "[ABORTING_SCAN]"]);
      setScanState('IDLE');
    }
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs]);

  useEffect(() => {
    if (scanState === 'COMPLETED' && metrics) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedVerdict(metrics.aiVerdict.slice(0, i));
        i++;
        if (i > metrics.aiVerdict.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [scanState, metrics]);

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 transition-all duration-700
      ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600 border border-cyan-100'}`}>
              <Cpu size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Axiom Forensic Engine</h1>
          </div>
          <p className={`text-sm font-mono tracking-widest uppercase opacity-50`}>
            V_4.2 // Deep_Repository_Auditor
          </p>
        </div>

        {/* SCANNING TERMINAL INPUT */}
        <form onSubmit={startScan} className="relative group w-full md:w-auto">
          <div className={`flex items-center gap-4 border rounded-2xl px-6 py-4 transition-all duration-500
            ${isDark ? 'bg-[#0A0A0A] border-white/10 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                   : 'bg-white border-slate-200 shadow-xl focus-within:border-slate-800'}`}>
            <span className="font-mono text-cyan-500 font-bold hidden sm:inline">axiom_audit &gt; run_deep_scan --repo</span>
            <input 
              type="text" 
              placeholder="[URL]" 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-transparent border-none outline-none font-mono text-sm w-full sm:w-64"
            />
            <button type="submit" disabled={scanState === 'SCANNING'} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
              <Search size={20} className={scanState === 'SCANNING' ? 'animate-spin opacity-50' : ''} />
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: TERMINAL LOGS & AI VERDICT */}
        <div className="lg:col-span-4 space-y-8">
          {/* TERMINAL UI */}
          <div className={`h-64 rounded-3xl border border-white/5 overflow-hidden font-mono text-[11px] relative
            ${isDark ? 'bg-black shadow-2xl' : 'bg-slate-900 shadow-xl'}`}>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Forensic_Stream</span>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto h-52 scrollbar-none">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-cyan-400 group flex gap-2"
                  >
                    <span className="opacity-30">[{i}]</span>
                    <span className="group-hover:text-white transition-colors">{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
              {scanState === 'IDLE' && (
                <div className="opacity-20 italic">Waiting for command input...</div>
              )}
            </div>
          </div>

          {/* AI NEURAL SUMMARY */}
          <div className={`p-8 rounded-3xl border min-h-[220px] transition-all duration-700
            ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6 opacity-50">
              <Terminal size={16} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Summary</h3>
            </div>
            <p className="text-sm font-medium leading-relaxed italic opacity-80">
              {displayedVerdict || (scanState === 'IDLE' ? "Awaiting repository analysis for neural fingerprinting..." : "Decrypting architectural patterns...")}
              {scanState !== 'IDLE' && (
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-4 ml-1 bg-cyan-500 translate-y-0.5"
                />
              )}
            </p>
          </div>
        </div>

        {/* RIGHT: THE FOUR PILLARS & METRIC TILES */}
        <div className="lg:col-span-8 space-y-8">
          {/* THE FOUR FORENSIC PILLARS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PillarCard 
              label="Clean Code Index"
              value={metrics?.cleanCodeIndex}
              glowColor="cyan"
              icon={<Code2 size={24} />}
              isDark={isDark}
              type="gauge"
              delay={0}
            />
            <PillarCard 
              label="Security Perimeter"
              status={metrics?.securityLevel}
              glowColor="red"
              icon={<Shield size={24} />}
              isDark={isDark}
              type="shield"
              delay={0.1}
            />
            <PillarCard 
              label="Maintainability"
              value={metrics?.maintainabilityScore}
              glowColor="amber"
              icon={<Activity size={24} />}
              isDark={isDark}
              type="thermometer"
              delay={0.2}
            />
            <PillarCard 
              label="Code Authenticity"
              value={metrics?.authenticityPercent}
              glowColor="purple"
              icon={<Fingerprint size={24} />}
              isDark={isDark}
              type="signature"
              delay={0.3}
            />
          </div>

          {/* POST-SCAN METRIC TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <MetricTile label="Total LOC" value={metrics?.totalLoc || '0'} subValue="+2k weekly" isDark={isDark} delay={0.4} />
            <MetricTile label="Complexity" value={metrics?.complexity ? `${metrics.complexity} avg` : '---'} subValue="Low Risk" isDark={isDark} delay={0.5} />
            <MetricTile label="Duplication" value={metrics?.duplicateCode ? `${metrics.duplicateCode}%` : '---'} subValue="Optimized" isDark={isDark} delay={0.6} />
            <MetricTile label="Dependencies" value={metrics?.dependencyHealth ? `${metrics.dependencyHealth}%` : '---'} subValue="Up to date" isDark={isDark} delay={0.7} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PillarCard({ label, value, status, glowColor, icon, isDark, type, delay }: any) {
  const colors: any = {
    cyan: 'from-cyan-500/20 to-cyan-500/0 text-cyan-400 border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]',
    red: 'from-rose-500/20 to-rose-500/0 text-rose-400 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]',
    amber: 'from-amber-500/20 to-amber-500/0 text-amber-400 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]',
    purple: 'from-purple-500/20 to-purple-500/0 text-purple-400 border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]'
  };

  const isActive = value !== undefined || status !== undefined;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "circOut" }}
      className={`relative p-6 rounded-3xl border flex flex-col items-center text-center gap-6 overflow-hidden transition-all duration-700
        ${isDark ? `bg-white/[0.03] border-white/5` : 'bg-white border-slate-200 shadow-lg'}
        ${isActive ? colors[glowColor] : ''}`}
    >
      <div className={`p-4 rounded-2xl relative z-10 transition-transform duration-500 ${isActive ? 'scale-110' : 'opacity-20'}`}>
        {icon}
      </div>

      <div className="space-y-1 relative z-10 w-full">
        <h4 className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">{label}</h4>
        <div className="flex flex-col items-center min-h-[80px] justify-center">
          {type === 'gauge' && (
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-10" />
                <motion.circle 
                  cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (value || 0) * 2.512 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xl">
                {value || '--'}
              </div>
            </div>
          )}

          {type === 'shield' && (
            <div className="w-full space-y-4">
              <div className="flex justify-center gap-1">
                {['CRITICAL', 'WARNING', 'SAFE'].map((lvl) => (
                  <div key={lvl} className={`h-1.5 w-6 rounded-full transition-all duration-700
                    ${status === lvl ? (lvl === 'SAFE' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                                       lvl === 'WARNING' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                                       'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]') 
                                     : 'bg-white/10'}`} />
                ))}
              </div>
              <span className={`text-[10px] font-mono font-black tracking-widest ${!status && 'opacity-0'}`}>
                {status || '---'}
              </span>
            </div>
          )}

          {type === 'thermometer' && (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-3 h-20 rounded-full border border-white/10 relative overflow-hidden ${!value && 'opacity-20'}`}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${value || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-amber-600 to-amber-300"
                />
              </div>
              <span className="font-mono font-black text-lg">{value || '--'}</span>
            </div>
          )}

          {type === 'signature' && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                 {Array.from({length: 8}).map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={{ height: value ? [10, 20 + Math.random() * 20, 10] : 4 }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    className="w-1 bg-current rounded-full"
                   />
                 ))}
              </div>
              <span className="font-mono font-black text-lg">{value ? `${value}%` : '--'}</span>
              <span className="text-[9px] uppercase tracking-widest opacity-40">Originality_PoW</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MetricTile({ label, value, subValue, isDark, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`p-6 rounded-3xl border transition-all duration-500 overflow-hidden relative group
        ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] uppercase font-black tracking-widest opacity-40">{label}</h4>
          <ChevronRight size={12} className="opacity-20 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black tracking-tighter">{value}</div>
          <div className={`text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 
            ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            <TrendingUp size={10} />
            {subValue}
          </div>
        </div>
      </div>

      {/* Gloss effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}




















