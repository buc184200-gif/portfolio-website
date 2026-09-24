import React from "react";
import { motion } from "motion/react";

interface BrowserFrameProps {
  title?: string;
  className?: string;
}

export const ArtifactBrowserFrame: React.FC<BrowserFrameProps> = ({
  title = "Website Wireframe",
  className = "",
}) => {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden pointer-events-none select-none transition-all duration-500 hover:border-blue-500/20 ${className}`}
    >
      {/* Window Chrome Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-500 tracking-wider">
          {title}.html
        </div>
        <div className="w-10" />
      </div>

      {/* Browser Skeleton Content */}
      <div className="p-4 space-y-3">
        {/* Navigation row */}
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="w-16 h-2 rounded bg-white/10" />
          <div className="flex gap-2">
            <div className="w-6 h-1.5 rounded bg-white/5" />
            <div className="w-6 h-1.5 rounded bg-white/5" />
            <div className="w-10 h-3 rounded-full bg-blue-500/30" />
          </div>
        </div>

        {/* Hero mockup */}
        <div className="space-y-2 py-1 text-center">
          <div className="w-3/4 h-3 mx-auto rounded bg-gradient-to-r from-blue-400/20 to-cyan-300/20" />
          <div className="w-1/2 h-2 mx-auto rounded bg-white/5" />
          <div className="w-16 h-4 mx-auto rounded-full bg-blue-500/40" />
        </div>

        {/* Bento/column items */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded bg-white/5 border border-white/5 space-y-1">
            <div className="w-4 h-4 rounded bg-blue-400/20" />
            <div className="w-full h-1.5 rounded bg-white/10" />
            <div className="w-2/3 h-1 rounded bg-white/5" />
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/5 space-y-1">
            <div className="w-4 h-4 rounded bg-cyan-400/20" />
            <div className="w-full h-1.5 rounded bg-white/10" />
            <div className="w-2/3 h-1 rounded bg-white/5" />
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/5 space-y-1">
            <div className="w-4 h-4 rounded bg-indigo-400/20" />
            <div className="w-full h-1.5 rounded bg-white/10" />
            <div className="w-2/3 h-1 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
};
