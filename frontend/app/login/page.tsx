"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Mail, Lock, User, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Registration States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: '',
    major: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Save the registration data to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_registration', JSON.stringify({
          name: formData.fullName,
          college: formData.college,
          major: formData.major,
          email: formData.email
        }));
      }

      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
          <Github className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Join Axiom</h1>
        <p className="text-slate-400 mt-2">Start building your verified developer identity.</p>
      </div>

      <div className="w-full max-w-lg bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="fullName" type="text" required onChange={handleInputChange} className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Ujjwal Rai" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Major / Branch</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input name="major" type="text" required onChange={handleInputChange} className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="AI & ML" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">College / University</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="college" type="text" required onChange={handleInputChange} className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="D.J. Sanghvi College of Engineering" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input name="email" type="email" required onChange={handleInputChange} className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="ujjwal@example.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input name="password" type="password" required onChange={handleInputChange} className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center mt-6">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" /></>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {isLogin ? "New to Axiom? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:text-indigo-300 font-bold">
            {isLogin ? 'Create one' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
