"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function RecruiterLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:8000/api/recruiter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (resp.ok) {
        const data = await resp.json();
        // Store session or just redirect for this demo
        localStorage.setItem("recruiter", JSON.stringify(data));
        router.push("/recruiter/search");
      } else {
        alert("Unauthorized access. Check your credentials.");
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
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-blue-400 to-cyan-600" />
        
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-cyan-600 rounded-2xl shadow-[0_0_20px_rgba(8,145,178,0.5)]">
            <Cpu size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Axiom.io <span className="text-cyan-500">Recruit</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 mt-1">Acquisition Terminal Access</p>
          </div>
        </div>

        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-none">
          Establish <br/> <span className="text-cyan-400">Neural Link</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="email"
                placeholder="IDENTIFIER (EMAIL)"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/20"
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
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/20"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-[0.3em] rounded-[2rem] shadow-[0_10px_30px_rgba(8,145,178,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            {loading ? "LINKING..." : (
              <>
                SYNC TERMINAL <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            No authority yet? <Link href="/recruiter/register" className="text-cyan-400 hover:text-cyan-300">Request Forge</Link>
          </p>
        </div>
      </motion.div>

      <footer className="mt-12 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">
        © 2026 AXM_SYSTEMS. AUTH_PROTOCOL_SECURED.
      </footer>
    </div>
  );
}
