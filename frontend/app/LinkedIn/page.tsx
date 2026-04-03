import { FileText, TrendingUp, ShieldAlert, Zap, BarChart3 } from "lucide-react";

export default function LinkedInAudit() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-24 font-sans">
      {/* Background Orbs for Aesthetic */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Professional Audit</h1>
            <p className="text-zinc-500 mt-2">LinkedIn PDF Analysis & Credibility Verification</p>
          </div>
          <button className="bg-zinc-100 text-zinc-950 px-6 py-2 rounded-full font-medium hover:bg-zinc-300 transition-all flex items-center gap-2">
            <FileText size={18} /> Re-upload PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1: Summary & Score */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credibility Score Card */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Trust Index</span>
                  <Zap size={20} className="text-emerald-400" />
                </div>
                <div className="text-6xl font-bold">72<span className="text-2xl text-zinc-600">/100</span></div>
                <p className="text-sm text-emerald-400 mt-4">↑ 12% Growth since last audit</p>
              </div>

              {/* Identity Snapshot */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Maulik Mhatre</h3>
                <p className="text-zinc-400">Fullstack Developer | React & FastAPI</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs border border-emerald-500/20">Verified Identity</span>
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs border border-violet-500/20">Active Growth</span>
                </div>
              </div>
            </div>

            {/* Graphs Placeholder */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <BarChart3 className="absolute opacity-5 text-zinc-100" size={200} />
              <div className="text-center z-10">
                <p className="text-zinc-500 font-mono italic">Visualize: Career Momentum & Skill Density Graphs</p>
                <p className="text-xs text-zinc-600 mt-2">[Integration: Recharts RadarChart & AreaChart]</p>
              </div>
            </div>
          </div>

          {/* Column 2: The "Brutal" Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 border-l-4 border-violet-500 p-6 rounded-r-3xl">
              <div className="flex items-center gap-2 mb-4 text-violet-400">
                <ShieldAlert size={20} />
                <h2 className="font-bold uppercase tracking-tighter">AI Reality Check</h2>
              </div>
              <ul className="space-y-4 text-sm leading-relaxed">
                <li className="text-zinc-300"><span className="text-violet-400 font-bold">●</span> Your &quot;Senior&quot; titles at personal projects are hurting your credibility with real recruiters.</li>
                <li className="text-zinc-300"><span className="text-violet-400 font-bold">●</span> 85% of your skill endorsements are from peers, not industry seniors. Value is low.</li>
                <li className="text-zinc-300"><span className="text-violet-400 font-bold">●</span> Your profile summary is generic AI-generated fluff. It lacks human &quot;impact&quot; metrics.</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-zinc-400" /> Improvement Roadmap
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700 text-xs text-zinc-400">
                  <strong className="text-zinc-100 block mb-1">Immediate Fix</strong>
                  Update headline to include &quot;FastAPI&quot; and &quot;Next.js&quot; explicitly.
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700 text-xs text-zinc-400">
                  <strong className="text-zinc-100 block mb-1">Skill Gap</strong>
                  Acquire AWS Cloud Practitioner to back up your &quot;Cloud&quot; claims.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}