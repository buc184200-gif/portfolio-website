import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig, getWhatsAppLink } from "../data/siteConfig";
import { CheckCircle2, ChevronRight, HelpCircle, RefreshCw, Send, ArrowRight } from "lucide-react";

export const PackageRecommender: React.FC = () => {
  // Step selections
  const [businessType, setBusinessType] = useState("coaching");
  const [mainGoal, setMainGoal] = useState("leads");
  const [budgetRange, setBudgetRange] = useState("8k-12k");
  const [timeline, setTimeline] = useState("7-14days");
  
  const [features, setFeatures] = useState<string[]>(["whatsapp", "contact"]);

  const [recommended, setRecommended] = useState<any | null>(null);

  const goalOptions = [
    { id: "leads", label: "Get Phone Calls / WhatsApp Leads" },
    { id: "sales", label: "Sell Products Online (E-commerce)" },
    { id: "booking", label: "Book Appointments & Consultations" },
    { id: "trust", label: "Professional Brand Trust / Portfolio" }
  ];

  const budgetOptions = [
    { id: "4k-8k", label: "₹4,000 - ₹8,000 (Basic Setup)" },
    { id: "8k-12k", label: "₹8,000 - ₹12,000 (Growing Business)" },
    { id: "12k-30k", label: "₹12,000 - ₹30,000 (Premium Quality)" },
    { id: "30k+", label: "₹30,000+ (Luxury Custom Apps)" }
  ];

  const featureOptions = [
    { id: "whatsapp", label: "WhatsApp Enquiry Links" },
    { id: "contact", label: "Lead Capture Forms" },
    { id: "maps", label: "Google Maps integration" },
    { id: "seo", label: "Essential Local SEO Setup" },
    { id: "booking_sys", label: "Online Appointment Booking" },
    { id: "ecommerce_cart", label: "Product Catalog + Cart" },
    { id: "admin_dash", label: "Admin Content Dashboard" },
    { id: "custom_anim", label: "Custom 3D / Fluid Animations" }
  ];

  const toggleFeature = (id: string) => {
    if (features.includes(id)) {
      setFeatures(features.filter((f) => f !== id));
    } else {
      setFeatures([...features, id]);
    }
  };

  const calculateRecommendation = () => {
    // Evaluation Logic
    let tier = "business"; // default
    let reason = "";

    const hasAdvancedFeatures = features.some((f) => ["booking_sys", "ecommerce_cart", "admin_dash"].includes(f));
    const hasAnimations = features.includes("custom_anim");

    if (budgetRange === "30k+" || mainGoal === "sales" || features.includes("ecommerce_cart") || features.includes("admin_dash")) {
      tier = "luxury";
      reason = "Since you require advanced features like database catalogs, online checkout flows, admin dashboards, or booking integrations, our custom-built Luxury Website package is the perfect long-term solution.";
    } else if (budgetRange === "12k-30k" || hasAnimations || (features.includes("seo") && features.length >= 5)) {
      tier = "premium";
      reason = "You selected premium animations, copywriting assets, or multiple structured services. Our Premium Website package delivers hand-crafted, pixel-perfect user designs that outpace competitors.";
    } else if (budgetRange === "4k-8k" && !hasAdvancedFeatures && features.length <= 3) {
      tier = "basic";
      reason = "For a lean budget looking to establish an immediate local presence, our Basic Website package offers quick loading, responsive single-page visual clarity, and clean contact shortcuts.";
    } else {
      tier = "business";
      reason = "Our highly popular Business Website package perfectly balances budget and growth features. It grants you up to 5 comprehensive sections, custom contact forms, local SEO configurations, and WhatsApp enquiry automation.";
    }

    const packageDetails = (siteConfig.pricing as any)[tier];

    setRecommended({
      tier,
      name: packageDetails.name,
      range: packageDetails.range,
      bestFor: packageDetails.bestFor,
      features: packageDetails.features,
      reason,
      timeline: tier === "basic" ? "3 - 5 Days" : tier === "business" ? "7 - 10 Days" : tier === "premium" ? "10 - 14 Days" : "14 - 30 Days"
    });
  };

  const getWhatsAppMsg = () => {
    if (!recommended) return "";
    const text = `Hi Khsuwant! I just used your Package Recommender.
*Recommended Plan:* ${recommended.name} (${recommended.range})
*Timeline Goal:* ${timeline}
*Goal:* ${mainGoal}

I would love to get a free homepage wireframe demo drafted for this!`;
    return getWhatsAppLink(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {!recommended ? (
          <motion.div
            key="selector-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Step-by-step layouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goal selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs flex items-center justify-center border border-blue-500/20">1</span>
                  What is your main website goal?
                </h4>
                <div className="space-y-2">
                  {goalOptions.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setMainGoal(g.id)}
                      className={`w-full text-left p-3 rounded-xl border text-sm font-sans transition-all duration-200 cursor-pointer ${
                        mainGoal === g.id
                          ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                          : "border-white/5 bg-white/2 hover:border-white/10 text-slate-400"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget selections */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs flex items-center justify-center border border-blue-500/20">2</span>
                  What is your budget range?
                </h4>
                <div className="space-y-2">
                  {budgetOptions.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudgetRange(b.id)}
                      className={`w-full text-left p-3 rounded-xl border text-sm font-sans transition-all duration-200 cursor-pointer ${
                        budgetRange === b.id
                          ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                          : "border-white/5 bg-white/2 hover:border-white/10 text-slate-400"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features multi-select list */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs flex items-center justify-center border border-blue-500/20">3</span>
                Select features your business needs:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {featureOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFeature(f.id)}
                    className={`p-3 rounded-xl border text-[11px] md:text-xs font-mono text-center tracking-wide transition-all duration-200 cursor-pointer ${
                      features.includes(f.id)
                        ? "border-cyan-500 bg-cyan-500/15 text-cyan-300"
                        : "border-white/5 bg-white/2 hover:border-white/10 text-slate-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline selector */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs flex items-center justify-center border border-blue-500/20">4</span>
                How urgent is your website launch?
              </h4>
              <div className="flex gap-4">
                {["ultra_fast", "7-14days", "flexible"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeline(t)}
                    className={`flex-1 p-3 rounded-xl border text-xs font-mono text-center tracking-wide transition-all duration-200 cursor-pointer ${
                      timeline === t
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-white/5 bg-white/2 hover:border-white/10 text-slate-400"
                    }`}
                  >
                    {t === "ultra_fast" ? "ASAP (3-7 Days)" : t === "7-14days" ? "Standard (7-14 Days)" : "Flexible / No rush"}
                  </button>
                ))}
              </div>
            </div>

            {/* Calc trigger button */}
            <button
              onClick={calculateRecommendation}
              className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(59,130,246,0.3)] transition-all duration-300"
            >
              Get Custom Website Recommendation
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="recommendation-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 rounded-2xl border border-blue-500/20 bg-slate-950 shadow-[0_20px_50px_rgba(59,130,246,0.15)] space-y-6"
          >
            {/* Header Result */}
            <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-white/5 gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Recommended Package</span>
                <h3 className="text-3xl font-bold text-white font-sans mt-1">{recommended.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{recommended.bestFor}</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Estimated Starting Price</div>
                <div className="text-2xl font-black text-cyan-400 font-sans mt-0.5">{recommended.range}</div>
              </div>
            </div>

            {/* Why recommendation text block */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Why This Fits You</span>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{recommended.reason}</p>
            </div>

            {/* Delivery timelines & SLA checklist list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">What's Included</span>
                <div className="space-y-2">
                  {recommended.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Speed SLA */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-3 flex flex-col justify-center">
                <div className="space-y-0.5 text-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Estimated Launch Timeline</span>
                  <div className="text-xl font-bold text-white font-mono mt-1">{recommended.timeline}</div>
                  <p className="text-[9px] text-slate-400 mt-1">Includes responsive wireframing support</p>
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={getWhatsAppMsg()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Claim This Plan on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setRecommended(null)}
                className="px-5 py-4 rounded-xl cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Recalculate Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
