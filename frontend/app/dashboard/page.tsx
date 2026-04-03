"use client";

import React, { useState } from 'react';
import { 
   FileText, 
   LayoutDashboard, 
   Zap, 
   ShieldCheck, 
   ArrowRight, 
   Fingerprint,
   Globe,      // Replacement for GitHub
   Share2,     // Replacement for LinkedIn
   User        // General Profile Icon
} from 'lucide-react';

export default function Dashboard() {
   const [connected, setConnected] = useState({ 
      github: false, 
      linkedin: false, 
      resume: false 
   });

   return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 pt-28 font-sans">
         <div className="max-w-7xl mx-auto">
            
            {/* Top Section */}
            <div className="mb-12">
               <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 uppercase italic">
                  <Fingerprint className="text-indigo-500" size={36} />
                  Phronex <span className="text-indigo-600">ID</span>
               </h1>
               <p className="text-zinc-500 mt-2 font-medium tracking-tight">
                  Professional Verification Engine & Credibility Audit.
               </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* GitHub Section (Using Globe Icon) */}
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] transition-all group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                        <Globe size={24} className="text-indigo-400" />
                     </div>
                     <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Unlinked
                     </span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Source Audit</h3>
                  <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                     Scanning repositories for algorithmic complexity and architectural integrity.
                  </p>
                  <button className="mt-8 w-full flex items-center justify-center gap-2 bg-zinc-100 text-black py-3 rounded-2xl font-bold text-sm hover:bg-white transition-colors">
                     Connect GitHub <ArrowRight size={16} />
                  </button>
               </div>

               {/* LinkedIn Section (Using Share2 Icon) */}
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <Share2 size={24} className="text-emerald-400" />
                     </div>
                     <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Pending
                     </span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Social Sync</h3>
                  <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                     Cross-referencing professional trajectory and industry endorsements.
                  </p>
                  <button className="mt-8 w-full flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white py-3 rounded-2xl font-bold text-sm hover:bg-zinc-700 transition-colors">
                     Upload Profile PDF
                  </button>
               </div>

               {/* Trust Index Section */}
               <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                     <div className="flex items-center gap-2 mb-6 text-indigo-400">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Audit Status</span>
                     </div>
                     <div className="text-7xl font-black italic tracking-tighter text-white opacity-20">0.0</div>
                  </div>
                  <p className="text-zinc-600 text-xs mt-6 font-medium uppercase tracking-wider">
                     Integrate sources to initialize verification.
                  </p>
               </div>

            </div>
         </div>
      </div>
   );
}