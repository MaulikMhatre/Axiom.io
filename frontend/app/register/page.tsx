// frontend/app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, ArrowRight, Shield, Globe, Cpu, Fingerprint } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Initializing Identity:", formData.email);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      
      {/* --- REUSED CRAZY BACKGROUND --- */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-2xl px-4 py-12">
        {/* --- MAIN GLASS CONTAINER --- */}
        <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
          
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar: Brand/Visuals */}
            <div className="md:w-1/3 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
                  <UserPlus className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter leading-tight">
                  START YOUR <br /> <span className="text-indigo-400">AUDIT.</span>
                </h2>
                <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                  Connect your GitHub. <br />Verify your skills. <br />Get hired by merit.
                </p>
              </div>
              
              <div className="space-y-4 pt-8">
                <div className="flex items-center gap-3 text-slate-500">
                  <Cpu size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI Verification</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Globe size={14} className="text-purple-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Global Ranking</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="md:w-2/3 p-8 md:p-12 bg-slate-900/40">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Identity Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Vivaan Patel"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all mt-1"
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Institutional Email</label>
                    <input
                      type="email"
                      required
                      placeholder="vivaan@djsce.edu.in"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all mt-1"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Pass</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all mt-1"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all mt-1"
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="group relative w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-xl shadow-white/5"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Initialize Identity <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Already Initialized? <Link href="/login" className="text-indigo-400 hover:text-white transition-colors">Login Archive</Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-slate-700">
                <Fingerprint size={14} />
                <span className="text-[9px] font-bold tracking-widest uppercase">Biometric Proof Not Required</span>
            </div>
            <span className="text-[9px] font-bold text-slate-700 tracking-widest uppercase">AXIOM_SYSTEM_v1.0.4</span>
        </div>
      </div>
    </div>
  );
}