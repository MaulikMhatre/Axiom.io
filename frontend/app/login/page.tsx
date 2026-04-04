// frontend/app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Sparkles, Lock, Mail, Hexagon, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NeuralBackground from "@/components/ui/flow-field-background";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Success! Store user info and redirect
      localStorage.setItem('user', data.username);
      window.location.href = '/dashboard'; 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent font-sans">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 bg-black">
        <NeuralBackground 
          color="#818cf8" 
          trailOpacity={0.15} 
          particleCount={500} 
          speed={0.7} 
          scale={0.8}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* --- BLENDED GLASS CARD --- */}
        <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.15)] rounded-[3rem] overflow-hidden p-10 md:p-16">
          
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="relative mb-6 group cursor-default">
              <Hexagon className="w-16 h-16 text-indigo-500 fill-indigo-500/5 group-hover:rotate-6 transition-transform duration-500" strokeWidth={1.5} />
              <Cpu className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tighter mb-2 uppercase italic leading-none">
              Axiom.io
            </h2>
            <p className="text-indigo-500/60 text-[10px] font-black uppercase tracking-[0.4em] ml-1">
              Digital Identity Audit
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors">
                Identity Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="vivaan@axiom.io"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-indigo-400 transition-colors">
                Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center px-4 animate-pulse uppercase tracking-widest">{error}</p>
            )}

            <div className="text-right">
              <a href="#" className="text-[10px] font-black text-slate-600 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                Recover Access?
              </a>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="group relative w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden shadow-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter Interface <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              UNAUTHORIZED?{' '}
              <Link href="/register" className="text-white hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-indigo-500/50">
                Initialize New ID
              </Link>
            </p>
          </div>
        </div>
        
        {/* Verification Badge Footer */}
        <div className="mt-8 flex justify-center items-center gap-2 text-slate-700">
            <Sparkles size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Verified by Axiom Neural Link</span>
        </div>
      </div>
    </div>
  );
}
