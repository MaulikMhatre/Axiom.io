// frontend/app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, ArrowRight, Shield, Globe, Cpu, Fingerprint, Hexagon } from 'lucide-react';
import NeuralBackground from "@/components/ui/flow-field-background";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.fullName.replace(/\s+/g, '').toLowerCase(), // Create a username
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        alert(errorData.detail);
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent font-sans">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 bg-black">
        <NeuralBackground 
          color="#818cf8" 
          trailOpacity={0.15} 
          particleCount={600} 
          speed={0.7} 
          scale={1}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-12">
        {/* --- MAIN BLENDED GLASS CONTAINER --- */}
        <div className="backdrop-blur-3xl bg-white/[0.01] border border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] rounded-[3rem] overflow-hidden">
          
          <div className="flex flex-col md:flex-row divide-x divide-white/5">
            {/* Left Sidebar: Brand/Visuals */}
            <div className="md:w-2/5 p-12 flex flex-col justify-between relative overflow-hidden bg-white/[0.02]">
              <div className="relative z-10">
                <div className="relative w-16 h-16 mb-10 group cursor-default">
                  <Hexagon className="absolute inset-0 w-16 h-16 text-indigo-500 fill-indigo-500/10 group-hover:rotate-12 transition-transform duration-700" strokeWidth={1.5} />
                  <Cpu className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tighter leading-[0.8] mb-6 uppercase italic">
                  INITIALIZE <br /> <span className="text-indigo-500">IDENTITY.</span>
                </h2>
                <div className="h-1 w-16 bg-indigo-500 mb-8" />
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
                  Analyze code. <br />Verify skills. <br />Proof of merit.
                </p>
              </div>
              
              <div className="space-y-6 pt-16 relative z-10">
                <div className="flex items-center gap-4 text-slate-500 transition-colors hover:text-indigo-400 group cursor-default">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20">
                    <Cpu size={20} className="text-indigo-400" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Neural Audit Engine</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 transition-colors hover:text-purple-400 group cursor-default">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20">
                    <Globe size={20} className="text-purple-400" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Global Talent Index</span>
                </div>
              </div>

              {/* Subtle light leak for the sidebar */}
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>

            {/* Right Side: Form */}
            <div className="md:w-3/5 p-12 md:p-20 bg-white/[0.01]">
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-indigo-500 transition-colors">Project Identity Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Vivaan Patel"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 px-6 text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all mt-3 text-sm font-medium"
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div className="group">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-indigo-500 transition-colors">Institutional Address</label>
                    <input
                      type="email"
                      required
                      placeholder="vivaan@axiom.io"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 px-6 text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all mt-3 text-sm font-medium"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-indigo-500 transition-colors">Secure Key</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 px-6 text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all mt-3 text-sm font-medium"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    <div className="group">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 group-focus-within:text-indigo-500 transition-colors">Confirm Key</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 px-6 text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all mt-3 text-sm font-medium"
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    className="group relative w-full py-5.5 bg-white text-black rounded-2xl font-black text-[13px] uppercase tracking-[0.4em] overflow-hidden transition-all hover:bg-indigo-600 hover:text-white active:scale-[0.98] shadow-2xl shadow-indigo-600/10"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Initialize <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </button>
                </div>

                <p className="text-center text-[11px] text-slate-600 font-bold uppercase tracking-[0.2em] transition-colors hover:text-slate-400">
                  Already Initialized? <Link href="/login" className="text-indigo-400 hover:text-white transition-colors underline underline-offset-8 decoration-indigo-500/30">Archives Access</Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-12 flex justify-between items-center px-10">
            <div className="flex items-center gap-3 text-slate-700">
                <Fingerprint size={16} />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">No Biometric Data Collected</span>
            </div>
            <span className="text-[10px] font-black text-slate-700 tracking-[0.3em] uppercase opacity-40">AXIOM_PLATFORM_CORE</span>
        </div>
      </div>
    </div>
  );
}