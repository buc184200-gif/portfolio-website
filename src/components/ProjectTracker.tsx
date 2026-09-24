import React, { useState } from "react";
import { motion } from "motion/react";
import { Layers, CheckCircle2, Circle, Clock, Check } from "lucide-react";

interface TrackerStep {
  id: number;
  label: string;
  status: "completed" | "active" | "pending";
  description: string;
}

export const ProjectTracker: React.FC = () => {
  const [activeStep, setActiveStep] = useState(3); // Mocking step 3 as active

  const steps: TrackerStep[] = [
    {
      id: 1,
      label: "Business Discovery & Goals",
      status: "completed",
      description: "Chat on WhatsApp to understand business type, target clients, services, and pricing outlines."
    },
    {
      id: 2,
      label: "Sitemap & Copywriting Outline",
      status: "completed",
      description: "Drafting layout structures, meta tags, heading outlines, and WhatsApp call-to-actions."
    },
    {
      id: 3,
      label: "Interactive Layout Design Preview",
      status: "active",
      description: "Drafting the visual homepage preview mockup to verify style, layouts, and typography."
    },
    {
      id: 4,
      label: "Website Coding & Responsiveness",
      status: "pending",
      description: "Completing full frontend design builds, CSS grids, database setups, and mobile responsive checkups."
    },
    {
      id: 5,
      label: "Review, Edits & Meta Setup",
      status: "pending",
      description: "Sharing private review link with client to incorporate edits, set on-page SEO, compress assets."
    },
    {
      id: 6,
      label: "SSL Deployment & Live Launch",
      status: "pending",
      description: "Connecting domains, setting hosting, verifying SSL certificates, speed scores, and launching public site!"
    }
  ];

  // Calculate percentage progress
  const completedStepsCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round(((completedStepsCount + 0.5) / steps.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md space-y-8">
      {/* Tracker Title & Global Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-white/5 gap-4 text-left">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Interactive Delivery Roadmap</span>
          <h3 className="text-2xl font-bold text-white font-sans">Simulated Project Tracker Dashboard</h3>
          <p className="text-xs text-slate-400 font-sans">See how our studio organizes, tracks, and delivers your website project.</p>
        </div>

        {/* Global Progress circle gauge */}
        <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2.5 rounded-xl border border-white/5">
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
            <div className="h-full bg-blue-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-xs font-bold text-white font-mono shrink-0">{progressPercent}% Done</span>
        </div>
      </div>

      {/* Steps List Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Step-by-step milestones list */}
        <div className="space-y-4">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => s.status === "completed" || s.id === 3 ? setActiveStep(s.id) : null}
              className={`w-full text-left p-3.5 rounded-xl border flex gap-3.5 items-start transition-all duration-300 ${
                activeStep === s.id
                  ? "border-blue-500 bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.15)] text-white"
                  : "border-white/5 bg-slate-900/30 text-slate-400"
              }`}
            >
              {/* Checkbox Visual */}
              <div className="mt-1 shrink-0">
                {s.status === "completed" ? (
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                  </div>
                ) : s.status === "active" ? (
                  <div className="w-4.5 h-4.5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center animate-pulse">
                    <Clock className="w-3 h-3 text-blue-400" />
                  </div>
                ) : (
                  <Circle className="w-4.5 h-4.5 text-slate-600" />
                )}
              </div>

              {/* Text metadata */}
              <div className="space-y-1">
                <div className="text-xs font-semibold font-sans flex items-center gap-2">
                  <span className={activeStep === s.id ? "text-white" : "text-slate-300"}>{s.label}</span>
                  {s.status === "active" && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/20 text-[8px] font-mono font-bold uppercase tracking-wider text-blue-400">
                      In Progress
                    </span>
                  )}
                  {s.status === "completed" && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/20 text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-1">{s.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Milestone Detail Pane (Overlapped) */}
        <div className="p-6 rounded-xl border border-white/5 bg-slate-900/40 space-y-4 flex flex-col justify-center text-left">
          {(() => {
            const current = steps.find((s) => s.id === activeStep) || steps[2];
            return (
              <>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">Milestone Focus</span>
                  <h4 className="text-lg font-bold text-white font-sans">{current.label}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{current.description}</p>
                
                {/* Visual outline checklist list inside details */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Deliverables Checklist</div>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Transparent layouts review link</span>
                    </div>
                    <div className="flex gap-2 items-center text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Typography hierarchy & mobile preview scaling</span>
                    </div>
                    <div className="flex gap-2 items-center text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp action testing verification</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
