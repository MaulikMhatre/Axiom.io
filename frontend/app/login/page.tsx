// frontend/app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
const router = useRouter(); // Import from 'next/navigation'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email, // Backend expects 'username'
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* --- CRAZY BACKGROUND ANIMATION --- */}
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* --- GLASS CARD --- */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-8">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 mb-4 transform hover:rotate-12 transition-transform duration-300">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AXIOM.IO
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Verify your identity. Own your code.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="vivaan@axiom.io"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
                Secret Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors">
                FORGOT ACCESS?
              </a>
            </div>

            {/* CRAZY SUBMIT BUTTON */}
            <button
              type="submit"
              className="group relative w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-black text-sm uppercase tracking-widest overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Enter Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500 font-medium">
              NO ACCOUNT?{' '}
              <Link href="/register" className="text-white hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-indigo-500/50">
                INITIALIZE IDENTITY
              </Link>
            </p>
          </div>
        </div>
        
        {/* Verification Badge Footer */}
        <div className="mt-8 flex justify-center items-center gap-2 text-slate-600">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified by Axiom Neural Link</span>
        </div>
      </div>
    </div>
  );
}
