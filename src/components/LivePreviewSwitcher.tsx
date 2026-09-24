import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { livePreviews } from "../data/mockData";
import { Smartphone, Monitor, ChevronRight, CheckCircle, MessageSquare } from "lucide-react";

export const LivePreviewSwitcher: React.FC = () => {
  const [activeTab, setActiveTab] = useState("coaching");

  const currentPreview = livePreviews.find((p) => p.id === activeTab) || livePreviews[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Category Selection Tabs row */}
      <div className="flex flex-wrap justify-center gap-2">
        {livePreviews.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono border tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === p.id
                ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "border-white/5 bg-slate-900/40 text-slate-400 hover:text-white"
            }`}
          >
            {p.industry}
          </button>
        ))}
      </div>

      {/* Laptop & Smartphone Mockups Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Mockups Column (Large column) */}
        <div className="lg:col-span-8 flex justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Simulated Browser Frame (Laptop style) */}
              <div className="w-full rounded-2xl border border-white/10 bg-slate-950 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="w-3/5 px-3 py-1 rounded bg-black/40 text-[10px] font-mono text-slate-500 truncate text-center">
                    https://my-business-demo.crestiva.app/
                  </div>
                  <div className="w-10" />
                </div>

                {/* Mock Content Body with dynamic values */}
                <div className="p-6 md:p-8 space-y-8 bg-slate-950 font-sans text-left">
                  {/* Site Header */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      DemoBusiness
                    </div>
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span>Services</span>
                      <span>Pricing</span>
                      <span>About Us</span>
                    </div>
                  </div>

                  {/* Dynamic Mock Hero */}
                  <div className="space-y-4 max-w-xl">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${currentPreview.accentColor}`}>
                      Premium Draft Preview
                    </span>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                      {currentPreview.heroHeadline}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                      {currentPreview.tagline}
                    </p>
                    <div className="pt-2 flex gap-3">
                      <div className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md">
                        {currentPreview.ctaText}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 text-xs">
                        Call Our Office
                      </div>
                    </div>
                  </div>

                  {/* Section wireframes based on activeTab */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    {currentPreview.mockSections.map((sec, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-slate-900/30 space-y-2.5">
                        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold border-b border-white/5 pb-1">
                          {sec.title}
                        </div>
                        <ul className="space-y-1.5">
                          {sec.items.map((it, itemIdx) => (
                            <li key={itemIdx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <span className="truncate">{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side Floating Smartphone mock frame overlapping on right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 25, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              exit={{ opacity: 0, x: 25, rotate: 2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="absolute -right-4 -bottom-6 hidden md:block w-40 h-72 rounded-2xl border-4 border-slate-900 bg-slate-950 overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
            >
              {/* Notch */}
              <div className="h-4 bg-slate-900 w-full flex items-center justify-center">
                <span className="w-12 h-2.5 rounded-full bg-black" />
              </div>

              {/* Mobile Content switcher */}
              <div className="p-3 space-y-4 text-left">
                <div className="w-full flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[8px] font-bold text-white">DemoMobile</span>
                  <span className="w-4 h-2 rounded bg-white/10" />
                </div>

                <div className="space-y-1.5 text-center">
                  <h3 className="text-[9px] font-black text-white leading-tight">
                    {currentPreview.heroHeadline}
                  </h3>
                  <p className="text-[7px] text-slate-400 leading-normal">
                    {currentPreview.tagline}
                  </p>
                </div>

                {/* Simulated Floating WhatsApp lead click CTA */}
                <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <div className="text-[7px] font-mono font-bold text-emerald-400 truncate">Tap to Inquire (WhatsApp)</div>
                </div>

                {/* Simple columns stack */}
                <div className="space-y-1">
                  <div className="p-1 rounded bg-white/5 text-[7px] text-slate-300 truncate">
                    ✓ Clean treatment setups
                  </div>
                  <div className="p-1 rounded bg-white/5 text-[7px] text-slate-300 truncate">
                    ✓ Zero waiting queues
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Informational Sidebar text Column (Small column) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <span className="px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 font-mono text-[10px] uppercase tracking-wider">
            Interactive Showcase
          </span>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Designed for Instant Customer Trust
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            These mockups represent the precise quality, structure, and spacing that we draft for our clients. We use layout principles suited for your local industry, ensuring maximum engagement.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex gap-2.5 items-start text-xs text-slate-300">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Custom localized high-converting headings</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs text-slate-300">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Visible pricing tables & operating schedules</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs text-slate-300">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Integrated WhatsApp quick triggers on cards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
