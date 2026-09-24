import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { transformationCase } from "../data/mockData";
import { AlertCircle, CheckCircle2, ChevronRight, X, ArrowRight } from "lucide-react";

export const BeforeAfter: React.FC = () => {
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* View Toggle Trigger buttons */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl bg-slate-900 border border-white/5 inline-flex">
          <button
            onClick={() => setView("before")}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              view === "before"
                ? "bg-red-500/15 border border-red-500/30 text-red-400 font-semibold"
                : "border border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Low Trust (Before)
          </button>
          <button
            onClick={() => setView("after")}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              view === "after"
                ? "bg-blue-500/15 border border-blue-500/30 text-blue-400 font-semibold shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lead Engine (After)
          </button>
        </div>
      </div>

      {/* Comparison Grid container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2"
        >
          {/* List items block (7 columns) */}
          <div className="md:col-span-7 space-y-4 text-left">
            <h4 className="text-sm font-mono tracking-wider uppercase text-slate-500">
              Online Business Realities
            </h4>
            <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {view === "before" 
                ? "Why standard old templates lose customers:" 
                : "How modern conversion code scales enquiries:"}
            </h3>
            
            <div className="space-y-3.5 pt-2">
              {view === "before" ? (
                transformationCase.before.map((b, i) => (
                  <div key={i} className="flex gap-3 items-start text-sm text-slate-400">
                    <X className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))
              ) : (
                transformationCase.after.map((a, i) => (
                  <div key={i} className="flex gap-3 items-start text-sm text-slate-300">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <span>{a}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive visual mockup card (5 columns) */}
          <div className="md:col-span-5 p-6 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[300px] text-left relative overflow-hidden">
            <div className="space-y-3.5 z-10">
              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-widest uppercase ${
                view === "before" 
                  ? "border-red-500/20 bg-red-500/10 text-red-400" 
                  : "border-blue-500/20 bg-blue-500/10 text-blue-400"
              }`}>
                {view === "before" ? "Status: Leakage" : "Status: Optimal Conversion"}
              </span>

              <h4 className="text-lg font-bold text-white font-sans mt-2">
                {view === "before" ? " Apollo Dental Care (Static View)" : "Apollo Dental Care (Conversion Engine)"}
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                {view === "before" 
                  ? "A basic wall of clinical text. Loading takes 6.5s. No direct quick WhatsApp buttons."
                  : "Clear pricing rate cards, MDS doctor achievements, location details, and a floating 'Book via WhatsApp' button."}
              </p>
            </div>

            {/* Simulated CTA button at bottom of mockup */}
            <div className="z-10 pt-4">
              {view === "before" ? (
                <div className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-500 text-center text-[10px] font-mono">
                  No Direct Contact Trigger
                </div>
              ) : (
                <motion.div
                  animate={{
                    scale: [1, 1.03, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                  className="w-full py-3 rounded-lg bg-emerald-500 text-white font-bold text-center text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  Book Appointment (WhatsApp)
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </div>

            {/* Glowing background circles */}
            <div className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full blur-3xl ${
              view === "before" ? "bg-red-500/10" : "bg-blue-500/10"
            }`} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
