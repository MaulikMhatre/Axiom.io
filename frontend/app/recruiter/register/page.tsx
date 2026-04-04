"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, Building, User, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function RecruiterRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company_name: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:8000/api/recruiter/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (resp.ok) {
        router.push("/recruiter/login");
      } else {
        alert("Registration failed. Email might already exist.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000a1f] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
        
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Axiom.io <span className="text-blue-500">Recruit</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60 mt-1">Talent Acquisition Terminal</p>
          </div>
        </div>

        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-none">
          Initialize <br/> <span className="text-blue-400">Authority</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="PROCURER NAME"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="CORPORATION"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="email"
                placeholder="IDENTIFIER (EMAIL)"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="password"
                placeholder="SECRET KEY"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-[0.3em] rounded-[2rem] shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            {loading ? "AUTHORIZING..." : (
              <>
                FORGE ACCOUNT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Already authorized? <Link href="/recruiter/login" className="text-blue-400 hover:text-blue-300">Enter Terminal</Link>
          </p>
        </div>
      </motion.div>

      <footer className="mt-12 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">
        © 2026 AXM_SYSTEMS. RECRUITER_PROTOCOL_V1.
      </footer>
    </div>
  );
}
