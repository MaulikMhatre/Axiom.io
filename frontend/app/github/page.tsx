// frontend/app/audit/github/page.tsx
import { 
  GitPullRequest, Activity, Code2, ShieldCheck, 
  Terminal, Layers, GitCommit, ExternalLink, Calendar, Info
} from "lucide-react";

export default function GitHubAudit() {
  const activityData = [
    {
      month: "April 2026",
      events: [
        { repo: "MaulikMhatre/Axiom.io", commits: 1, color: "bg-emerald-500" },
        { repo: "kunalkashelkar/SYNERGY-3.0", commits: 1, color: "bg-emerald-500" },
      ]
    },
    {
      month: "March 2026",
      events: [
        { repo: "Vivaan2756/rewardpage", commits: 2, color: "bg-emerald-400/60" },
        { repo: "Vivaan2756/Vivaan2756", commits: 2, color: "bg-emerald-400/60" },
        { repo: "MaulikMhatre/ZenHack_2026", commits: 1, color: "bg-emerald-400/40" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-24 font-sans relative selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">Repo Intelligence</h1>
            </div>
            <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase">
              Deep-Scan: commit_history // architectural_audit // auth_v3
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">System: Online</span>
             </div>
             <span className="text-[9px] font-mono text-zinc-600">ID: AX-7742-VERIFIED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Primary Insights */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Logic Depth" value="84" sub="Rank: Elite" icon={<Code2 />} color="text-indigo-400" />
              <MetricCard title="Commit Cadence" value="High" sub="Streak: 22d" icon={<Activity />} color="text-emerald-400" />
              <MetricCard title="Stack Bias" value="TS" sub="64% Weight" icon={<Layers />} color="text-blue-400" />
            </div>

            {/* Repository Audit Feed */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm">
              <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Structural Integrity Audit</span>
                <Terminal size={14} className="text-zinc-600" />
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { name: 'Phrelis_ERP', score: 92, tag: 'EXCEPTIONAL' },
                  { name: 'Axiom.io', score: 88, tag: 'OPTIMIZED' },
                  { name: 'PokeQuest', score: 78, tag: 'MODULAR' },
                ].map((repo, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">{repo.name}</h4>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase">Node_Hash: {Math.random().toString(36).substring(7)}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-black px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">{repo.tag}</span>
                      <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" style={{ width: `${repo.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Analysis */}
          <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <h2 className="text-sm font-black uppercase tracking-tighter text-indigo-400 mb-6 flex items-center gap-2">
               <ShieldCheck size={18} /> Axiom AI Verdict
            </h2>
            <ul className="space-y-6 text-[13px] leading-relaxed text-zinc-400">
              <li>
                <span className="text-white font-bold block mb-1">Architecture Depth</span>
                Usage of <span className="text-indigo-300">FastAPI</span> and <span className="text-indigo-300">Next.js</span> shows high asynchronous proficiency.
              </li>
              <li>
                <span className="text-white font-bold block mb-1">Collaboration Risk</span>
                78% of commits are solo. Platform recommends integrating <span className="text-indigo-300">Peer Reviews</span> for Credibility Score boost.
              </li>
              <li>
                <span className="text-white font-bold block mb-1">Optimization Note</span>
                Predictive models in <span className="text-white">Phrelis</span> show 94% accuracy in bed-management logic.
              </li>
            </ul>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">114 Verified Interactions / LTM</h3>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                LESS <div className="w-3 h-3 bg-zinc-900 rounded-sm" />
                <div className="w-3 h-3 bg-emerald-900/40 rounded-sm" />
                <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> MORE
              </div>
            </div>
            <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
              {[...Array(371)].map((_, i) => (
                <div key={i} className={`aspect-square w-full rounded-sm transition-all hover:scale-150 hover:z-10 cursor-crosshair ${
                  i % 14 === 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 
                  i % 9 === 0 ? 'bg-emerald-700/50' : 
                  i % 5 === 0 ? 'bg-emerald-900/20' : 'bg-zinc-900/50'
                }`} title={`Activity Index: ${i}`} />
              ))}
            </div>
          </div>
          
          {/* Timeline */}
          <div className="grid grid-cols-1 gap-8">
            {activityData.map((section, idx) => (
              <div key={idx} className="relative pl-12 border-l border-zinc-800 pb-4">
                <div className="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-500 rounded-full border-4 border-[#09090b] shadow-[0_0_15px_indigo]" />
                <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">{section.month}</h2>
                <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.03] transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.events.map((event, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-default">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-zinc-300 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                             {event.repo} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                          </p>
                          <p className="text-[10px] font-mono text-zinc-600">INTEGRITY_CHECK: PASSED</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-zinc-400">{event.commits} COMMIT</p>
                          <div className="w-16 h-1 bg-zinc-900 mt-2 rounded-full overflow-hidden">
                             <div className={`h-full ${event.color} rounded-full`} style={{ width: '80%' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub, icon, color }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-white/20 transition-all group">
      <div className={`${color} mb-4 opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</span>
      <div className="text-4xl font-black mt-1 tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold text-zinc-600 uppercase mt-2 tracking-tighter">{sub}</div>
    </div>
  );
}