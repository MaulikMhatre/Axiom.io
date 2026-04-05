// frontend/app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Sparkles, Lock, Mail, Hexagon, Cpu,
  User, Briefcase, Building2, Eye, EyeOff, CheckCircle2
} from 'lucide-react';
import NeuralBackground from "@/components/ui/flow-field-background";
import SkyToggle from "@/components/ui/sky-toggle";

type Role = 'user' | 'recruiter';
type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('user');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setSuccess('');
    setForm({ fullName: '', email: '', password: '', confirmPassword: '', companyName: '' });
  };

  const switchRole = (r: Role) => {
    setRole(r);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Access keys do not match.');
          setLoading(false);
          return;
        }

        const endpoint =
          role === 'recruiter'
            ? 'http://localhost:8000/api/recruiter/register'
            : 'http://localhost:8000/api/register';

        const body =
          role === 'recruiter'
            ? {
                username: form.fullName.replace(/\s+/g, '').toLowerCase(),
                email: form.email,
                password: form.password,
                company_name: form.companyName,
              }
            : {
                username: form.fullName.replace(/\s+/g, '').toLowerCase(),
                email: form.email,
                password: form.password,
              };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.detail || 'Registration failed.');
        }

        setSuccess('Identity initialized. Switching to login...');
        setTimeout(() => switchMode('login'), 1500);
      } else {
        // LOGIN
        const endpoint =
          role === 'recruiter'
            ? 'http://localhost:8000/api/recruiter/login'
            : 'http://localhost:8000/api/login';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Authentication failed.');

        localStorage.setItem('user_role', role);
        localStorage.setItem('user_email', form.email);
        localStorage.setItem('user', data.username);

        if (role === 'recruiter') {
          localStorage.setItem('recruiter_company', data.company || '');
          window.location.href = '/recruiter/search';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isUser = role === 'user';
  const accent = isUser ? 'indigo' : 'violet';

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50 scale-90 opacity-80 hover:opacity-100 transition-opacity">
        <SkyToggle />
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <NeuralBackground
          color={isUser ? '#818cf8' : '#a78bfa'}
          trailOpacity={0.13}
          particleCount={450}
          speed={0.65}
          scale={0.85}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* --- GLASS CARD --- */}
        <div className="backdrop-blur-3xl bg-white/[0.03] dark:bg-white/[0.02] border border-white/10 shadow-[0_0_80px_-20px_rgba(99,102,241,0.2)] rounded-[2.5rem] overflow-hidden">

          {/* Header Brand */}
          <div className="pt-10 pb-6 px-10 text-center flex flex-col items-center">
            <div className="relative mb-4 group cursor-default">
              <Hexagon
                className={`w-14 h-14 ${isUser ? 'text-indigo-500 fill-indigo-500/10' : 'text-violet-500 fill-violet-500/10'} group-hover:rotate-12 transition-transform duration-700`}
                strokeWidth={1.5}
              />
              <Cpu
                className={`absolute inset-0 m-auto w-7 h-7 ${isUser ? 'text-indigo-400' : 'text-violet-400'} animate-pulse`}
              />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 dark:from-white via-indigo-100 to-indigo-400 tracking-tighter uppercase italic leading-none">
              Axiom.io
            </h1>
            <p className={`text-xs font-black uppercase tracking-[0.35em] mt-1 ${isUser ? 'text-indigo-500/60' : 'text-violet-500/60'}`}>
              Digital Identity Audit
            </p>
          </div>

          {/* MODE TABS */}
          <div className="px-8 mb-6">
            <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 gap-1">
              {(['login', 'register'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    mode === m
                      ? isUser
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {m === 'login' ? 'Access' : 'Initialize'}
                </button>
              ))}
            </div>
          </div>

          {/* ROLE SELECTOR */}
          <div className="px-8 mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-1">
              Identity Class
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => switchRole('user')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                  role === 'user'
                    ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-400'
                    : 'border-white/10 bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/20'
                }`}
              >
                <User size={16} className="shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">Developer</span>
                {role === 'user' && <CheckCircle2 size={14} className="ml-auto text-indigo-400" />}
              </button>
              <button
                type="button"
                onClick={() => switchRole('recruiter')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                  role === 'recruiter'
                    ? 'border-violet-500/60 bg-violet-500/10 text-violet-400'
                    : 'border-white/10 bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/20'
                }`}
              >
                <Briefcase size={16} className="shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">Recruiter</span>
                {role === 'recruiter' && <CheckCircle2 size={14} className="ml-auto text-violet-400" />}
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            {/* Full Name — register only */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-1">
                  {role === 'recruiter' ? 'Full Name' : 'Identity Name'}
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  placeholder={role === 'recruiter' ? 'Arjun Mehta' : 'Vivaan Patel'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm font-semibold"
                  onChange={e => update('fullName', e.target.value)}
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-1">
                {role === 'recruiter' ? 'Corporate Address' : 'Identity Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="email"
                  required
                  value={form.email}
                  placeholder={role === 'recruiter' ? 'arjun@corp.io' : 'vivaan@axiom.io'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm font-semibold"
                  onChange={e => update('email', e.target.value)}
                />
              </div>
            </div>

            {/* Company — recruiter register only */}
            {mode === 'register' && role === 'recruiter' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-1">
                  Organization
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    placeholder="Nexus Corp"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm font-semibold"
                    onChange={e => update('companyName', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-1">
                Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm font-semibold"
                  onChange={e => update('password', e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — register only */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-1">
                  Confirm Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm font-semibold"
                    onChange={e => update('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    onClick={() => setShowConfirm(p => !p)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <p className="text-xs font-extrabold text-red-400 text-center uppercase tracking-widest animate-pulse px-2">
                ⚠ {error}
              </p>
            )}
            {success && (
              <p className="text-xs font-extrabold text-emerald-400 text-center uppercase tracking-widest px-2">
                ✓ {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.3em] overflow-hidden transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl mt-2 ${
                isUser
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30'
                  : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-violet-600/30'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : mode === 'login' ? (
                  <>Enter Interface <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                ) : (
                  <>Initialize ID <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>

            {/* Divider hint */}
            <p className="text-center text-[11px] text-zinc-600 font-semibold tracking-widest uppercase pt-1">
              {mode === 'login' ? (
                <>No ID?{' '}
                  <button type="button" onClick={() => switchMode('register')} className={`${isUser ? 'text-indigo-400 hover:text-indigo-300' : 'text-violet-400 hover:text-violet-300'} transition-colors underline underline-offset-4`}>
                    Initialize Now
                  </button>
                </>
              ) : (
                <>Already initialized?{' '}
                  <button type="button" onClick={() => switchMode('login')} className={`${isUser ? 'text-indigo-400 hover:text-indigo-300' : 'text-violet-400 hover:text-violet-300'} transition-colors underline underline-offset-4`}>
                    Access Archives
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-center items-center gap-2 text-zinc-600">
          <Sparkles size={13} />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Verified by Axiom Neural Link</span>
        </div>
      </div>
    </div>
  );
}
