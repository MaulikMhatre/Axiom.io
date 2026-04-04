"use client";

import React from "react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NeuralHeroDemo() {
  return (
    // Container must have a defined height, or use h-screen
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <NeuralBackground 
            color="#818cf8" // Indigo-400
            scale={1}
            trailOpacity={0.1} // Lower = longer trails
            speed={0.8}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
            <h1 className="text-4xl font-bold flex items-center gap-2">
                Neural Background Demo <Sparkles className="text-indigo-400" />
            </h1>
            <p className="text-zinc-400 mt-2">Interactive flow-field background is active.</p>
        </div>
    </div>
  );
}
