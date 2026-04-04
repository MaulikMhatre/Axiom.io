import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 font-sans relative overflow-hidden">
      
      {/* 🧭 Navigation Header */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white italic">P</div>
            <span className="font-bold tracking-tighter text-xl">PHRONEX <span className="text-indigo-500">ID</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Login
            </a>
            <a 
              href="/register" 
              className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Aesthetic Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="flex-1 max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-6 pt-32">
        
        {/* Branding badge */}
        <div className="mb-8 p-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Powered by Axiom Audit Engine
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
          VERIFY YOUR <br/><span className="text-indigo-500">DIGITAL IDENTITY</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12 font-medium leading-relaxed">
          Phronex ID uses advanced LLM auditing to verify your professional claims across LinkedIn, Github, and Portfolios. Stop guessing. Get brutal, honest feedback that builds trust.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <a
            href="/dashboard"
            className="flex-1 h-14 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Launch Dashboard
          </a>
          <a
            href="/resume"
            className="flex-1 h-14 bg-transparent border-2 border-white/10 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-white/5 transition-all"
          >
            Upload Resume
          </a>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-white/5 pt-16 mb-20">
          <div className="flex flex-col items-center gap-3">
             <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>
             </div>
             <h3 className="font-bold text-lg">Brutal Audit</h3>
             <p className="text-sm text-zinc-500">AI that doesn&apos;t hold back. We find the inconsistencies recruiters hate.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
             <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 border border-violet-500/20 mb-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m11 4 3 3-3 3M3 8h11"/></svg>
             </div>
             <h3 className="font-bold text-lg">Trust Score</h3>
             <p className="text-sm text-zinc-500">Calculated from verifiable data across your entire digital footprint.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
             </div>
             <h3 className="font-bold text-lg">Growth Roadmap</h3>
             <p className="text-sm text-zinc-500">Actionable steps to fix discrepancy gaps and improve your value index.</p>
          </div>
        </div>

      </main>
    </div>
  );
}