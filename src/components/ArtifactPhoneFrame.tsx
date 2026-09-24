import React from "react";
import { motion } from "motion/react";

interface PhoneFrameProps {
  className?: string;
}

export const ArtifactPhoneFrame: React.FC<PhoneFrameProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`w-36 h-64 rounded-2xl border-2 border-white/10 bg-slate-950/50 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden pointer-events-none select-none relative p-3 space-y-2 flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-500 ${className}`}
    >
      {/* Speaker/Camera notch */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-slate-900 border border-white/5 flex items-center justify-around px-2">
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="w-4 h-0.5 rounded-full bg-slate-700" />
      </div>

      <div className="space-y-2 pt-2">
        {/* Navigation bar row */}
        <div className="flex justify-between items-center pb-1 border-b border-white/5">
          <div className="w-8 h-1.5 rounded bg-white/10" />
          {/* Mobile hamburger menu indicator */}
          <div className="space-y-0.5">
            <span className="block w-2.5 h-0.5 bg-white/20" />
            <span className="block w-2.5 h-0.5 bg-white/20" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-1 text-center py-1">
          <div className="w-full h-2 rounded bg-gradient-to-r from-blue-400/20 to-cyan-300/20" />
          <div className="w-5/6 h-2 mx-auto rounded bg-gradient-to-r from-blue-400/20 to-cyan-300/20" />
          <div className="w-3/4 h-1 mx-auto rounded bg-white/5" />
        </div>

        {/* Floating WhatsApp CTA bubble mockup */}
        <motion.div 
          animate={{
            scale: [1, 1.05, 1],
            y: [-1, 1, -1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-1"
        >
          {/* Tiny WhatsApp icon placeholder */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[7px] font-bold text-emerald-400 font-mono tracking-wider">WhatsApp Enquiry</span>
        </motion.div>

        {/* Service cards stack */}
        <div className="space-y-1">
          <div className="p-1.5 rounded bg-white/5 border border-white/5 flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-400/20 shrink-0" />
            <div className="space-y-0.5 w-full">
              <div className="w-12 h-1 rounded bg-white/15" />
              <div className="w-6 h-0.5 rounded bg-white/5" />
            </div>
          </div>
          <div className="p-1.5 rounded bg-white/5 border border-white/5 flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-cyan-400/20 shrink-0" />
            <div className="space-y-0.5 w-full">
              <div className="w-12 h-1 rounded bg-white/15" />
              <div className="w-6 h-0.5 rounded bg-white/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright skeleton bar */}
      <div className="flex justify-between items-center text-[5px] text-slate-600 font-mono">
        <span>© Crestiva</span>
        <span className="w-4 h-1 rounded bg-white/5" />
      </div>
    </div>
  );
};
