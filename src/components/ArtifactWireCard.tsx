import React from "react";
import { motion } from "motion/react";

interface WireCardProps {
  type: "seo" | "speed" | "leads" | "cursor";
  label: string;
  className?: string;
}

export const ArtifactWireCard: React.FC<WireCardProps> = ({
  type,
  label,
  className = "",
}) => {
  return (
    <div
      className={`p-3 rounded-lg border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg pointer-events-none select-none flex items-center gap-3 hover:border-blue-500/20 transition-all duration-300 ${className}`}
    >
      {/* Icon visual container */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border border-white/10">
        {type === "seo" && (
          <span className="text-blue-400 font-mono text-[10px] font-bold">#1</span>
        )}
        {type === "speed" && (
          <span className="text-cyan-400 font-mono text-[9px] font-bold">99%</span>
        )}
        {type === "leads" && (
          <span className="w-2.5 h-2.5 rounded bg-emerald-400 animate-pulse" />
        )}
        {type === "cursor" && (
          <svg className="w-4.5 h-4.5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2l12 11.2-5.8.8L17 20l-2.5 1-4-6.4-3.5 3.4z" />
          </svg>
        )}
      </div>

      {/* Label and mini indicator stack */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          {label}
        </div>
        
        {type === "seo" && (
          <div className="flex gap-1">
            <span className="w-5 h-1 rounded-full bg-blue-500/30" />
            <span className="w-8 h-1 rounded-full bg-blue-400/40" />
            <span className="w-3 h-1 rounded-full bg-blue-400" />
          </div>
        )}

        {type === "speed" && (
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="w-11/12 h-full bg-cyan-400" />
            </div>
            <span className="text-[7px] font-mono text-cyan-400">0.4s</span>
          </div>
        )}

        {type === "leads" && (
          <div className="text-[8px] font-mono text-slate-500">
            Active Enquiry Triggered
          </div>
        )}

        {type === "cursor" && (
          <div className="text-[8px] font-mono text-indigo-400">
            Magnetic Mode Active
          </div>
        )}
      </div>
    </div>
  );
};
