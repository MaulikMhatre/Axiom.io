"use client";

import React from 'react';
import AxiomForensicEngine from "@/components/AxiomForensicEngine";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function ForensicsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pt-32 pb-20 px-4 md:px-8 transition-colors duration-700
      ${isDark ? 'bg-[#020202]' : 'bg-slate-50'}`}>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-sm font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity
            ${isDark ? 'text-white' : 'text-slate-900'}`}
        >
          <ArrowLeft size={16} />
          Back_to_Dashboard
        </button>

        <div className={`rounded-[3rem] border p-4 md:p-12
          ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-2xl'}`}>
          <AxiomForensicEngine />
        </div>
      </div>

      {/* Decorative localized grid */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]'} bg-[size:40px_40px]`} />
      </div>
    </div>
  );
}
