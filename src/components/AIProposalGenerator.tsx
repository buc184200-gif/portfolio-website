import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getWhatsAppLink } from "../data/siteConfig";
import { FileText, Calendar, CheckSquare, Layers, DollarSign, Send, ArrowRight, RefreshCw } from "lucide-react";

export const AIProposalGenerator: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedTier, setSelectedTier] = useState("Business Website");
  const [launchSpeed, setLaunchSpeed] = useState("ASAP");

  const [proposal, setProposal] = useState<any | null>(null);

  const tierPrices = {
    "Basic Website": "₹6,000",
    "Business Website": "₹10,000",
    "Premium Website": "₹18,000",
    "Luxury Web App": "₹45,000"
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !businessName.trim()) return;

    const price = (tierPrices as any)[selectedTier];
    const sitemap = selectedTier === "Basic Website" 
      ? ["Homepage Landing View", "Services section", "WhatsApp floating lead trigger"]
      : selectedTier === "Business Website"
      ? ["Modern Homepage Layout", "Services Breakdown section", "Doctor/Faculty/Trainer profile", "Lead Capture form", "Google Maps embed", "WhatsApp CTA"]
      : ["Premium Homepage Layout", "About Our Founders/Team", "Individual Service Detail pages", "Interactive Cost Estimator widget", "Lead capture forms", "Advanced localized SEO schema markup"];

    setProposal({
      clientName,
      businessName,
      selectedTier,
      price,
      sitemap,
      timeline: launchSpeed === "ASAP" ? "4 to 7 Days" : "10 to 14 Days",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    });
  };

  const getWhatsAppProposal = () => {
    if (!proposal) return "";
    const text = `Hi Khsuwant! I just generated a Website Proposal for my business.
*Client:* ${proposal.clientName} (${proposal.businessName})
*Selected Plan:* ${proposal.selectedTier} (${proposal.price})
*Timeline Goal:* ${proposal.timeline}

Here is the draft proposal. I'd love to chat on WhatsApp to finalize things and look at your custom demo!`;
    return getWhatsAppLink(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {!proposal ? (
          <motion.form
            key="proposal-form"
            onSubmit={handleGenerate}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rohit Verma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smile Dental Clinic"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Who are your main clients/target customers?</label>
              <input
                type="text"
                placeholder="e.g. Local families in Sector 15 looking for painless treatments"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Suggested Package tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option>Basic Website</option>
                  <option>Business Website</option>
                  <option>Premium Website</option>
                  <option>Luxury Web App</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">How soon do you want to launch?</label>
                <select
                  value={launchSpeed}
                  onChange={(e) => setLaunchSpeed(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="ASAP">ASAP / Urgent (within 1 week)</option>
                  <option value="Standard">Standard pace (2 weeks)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              Generate Mini Proposal Blueprint
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="proposal-render"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950 shadow-2xl space-y-6 text-left"
          >
            {/* Header branding block */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <h4 className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Crestiva Proposal Blueprint</h4>
                <div className="text-xl font-bold text-white font-sans mt-0.5">Project Scope: {proposal.businessName}</div>
                <div className="text-xs text-slate-400 mt-0.5">Drafted for: {proposal.clientName}</div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right">{proposal.date}</div>
            </div>

            {/* Sitemap Outline list */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Proposed Page / Section Outline
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {proposal.sitemap.map((page: string, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg border border-white/5 bg-white/2 flex gap-2.5 items-center text-xs text-slate-300">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{page}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timelines and estimated totals grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Speed Card */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-2">
                <h5 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Target Delivery timeline
                </h5>
                <div className="text-lg font-bold text-white font-mono">{proposal.timeline}</div>
                <p className="text-[10px] text-slate-500">Includes live testing & custom support</p>
              </div>

              {/* Total Card */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-2">
                <h5 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                  Calculated Estimate
                </h5>
                <div className="text-lg font-bold text-white font-mono">{proposal.price}</div>
                <p className="text-[10px] text-slate-500">Excludes standard third-party domain costs</p>
              </div>
            </div>

            {/* Actions panel */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <a
                href={getWhatsAppProposal()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Submit Proposal to WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  setProposal(null);
                  setClientName("");
                  setBusinessName("");
                  setTargetAudience("");
                }}
                className="px-5 py-4 rounded-xl cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                New Blueprint
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
