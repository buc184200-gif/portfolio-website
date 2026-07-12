import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getWhatsAppLink } from "../data/siteConfig";
import { ChevronRight, ChevronLeft, HelpCircle, RefreshCw, Send, CheckCircle2, ArrowRight } from "lucide-react";

export const BuilderQuiz: React.FC = () => {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState("Coaching Institute");
  const [mainGoal, setMainGoal] = useState("More WhatsApp Enquiries");
  const [vibe, setVibe] = useState("Premium / Futuristic");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["WhatsApp Button", "Contact Form"]);
  const [budgetRange, setBudgetRange] = useState("₹8,000 - ₹12,000");

  const [finished, setFinished] = useState(false);

  const stepsCount = 5;

  const featuresList = [
    "WhatsApp Button",
    "Contact Form",
    "Google Maps Embed",
    "Essential Local SEO",
    "Appointment Scheduling",
    "Product Shopping Cart",
    "Admin Dashboard",
    "Custom Animations",
    "AI Chatbot Agent"
  ];

  const handleNext = () => {
    if (step < stepsCount) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const getWhatsAppQuizLink = () => {
    const text = `Hi Khsuwant! I just built a Website Plan in 30s:
*Category:* ${businessType}
*Vibe:* ${vibe}
*Main Goal:* ${mainGoal}
*Features:* ${selectedFeatures.join(", ")}
*Budget Choice:* ${budgetRange}

I'd love to discuss this and get a free homepage wireframe demo drafted!`;
    return getWhatsAppLink(text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
      {/* Progress header bar */}
      {!finished && (
        <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 text-left">
          <span className="text-xs font-mono text-slate-400">Step {step} of {stepsCount}</span>
          <div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(step / stepsCount) * 100}%` }} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-left"
          >
            {/* Step 1: Category */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  What is your business category?
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Coaching Institute", "Healthcare Clinic", "Gym & Fitness",
                    "Restaurant / Cafe", "Local Retail Shop", "Real Estate Agent",
                    "Beauty Salon / Spa", "Professional Service", "Startup / Agency", "E-commerce Store"
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBusinessType(cat)}
                      className={`p-3 rounded-xl border text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                        businessType === cat
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/5 bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Main Goal */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  What is your main website goal?
                </h4>
                <div className="space-y-2">
                  {[
                    "More Calls & WhatsApp Enquiries",
                    "Direct Online Product Sales (Cart/COD)",
                    "Online Booking & Appointments",
                    "Professional Brand Trust & Portfolio",
                    "Student batch enrollment triggers"
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setMainGoal(goal)}
                      className={`w-full p-3 rounded-xl border text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                        mainGoal === goal
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/5 bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Preferred Style */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  What style vibe do you prefer?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Premium / Futuristic (Cinematic darks, glows)",
                    "Modern & Corporate (Clean whites, navy accents)",
                    "Simple & Minimalist (Generous white negative space)",
                    "Bold & Energetic (High contrast neon accents)",
                    "Warm & Welcoming (Soft cream background sections)"
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setVibe(style)}
                      className={`p-3 rounded-xl border text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                        vibe === style
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/5 bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Required Features */}
            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  Select features you absolutely need:
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {featuresList.map((f) => {
                    const isChecked = selectedFeatures.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`p-3 rounded-xl border text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                            : "border-white/5 bg-slate-900/40 text-slate-400"
                        }`}
                      >
                        {isChecked ? "✓ " : ""} {f}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Budget */}
            {step === 5 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  Select your expected budget range:
                </h4>
                <div className="space-y-2">
                  {[
                    "₹4,000 - ₹8,000 (Basic online presence)",
                    "₹8,000 - ₹12,000 (Highly Recommended Business package)",
                    "₹12,000 - ₹30,000 (Premium bespoke animations & copy)",
                    "₹30,000 - ₹1,00,000+ (Custom e-commerce or smart apps)"
                  ].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`w-full p-3.5 rounded-xl border text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                        budgetRange === b
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/5 bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons footer row */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                {step === stepsCount ? "Finish & Generate Plan" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 rounded-2xl border border-blue-500/20 bg-slate-950 shadow-2xl space-y-6 text-left"
          >
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">30-Second Builder Plan</span>
              <h3 className="text-2xl font-bold text-white font-sans mt-1">Your Website Blueprint Is Ready!</h3>
              <p className="text-slate-400 text-xs mt-1">Configured for category: **{businessType}**</p>
            </div>

            {/* Dynamic visual results summary grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Style Card */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-1.5">
                <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">Aesthetic Style</span>
                <div className="text-sm font-bold text-white">{vibe}</div>
              </div>

              {/* Goal Card */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-1.5">
                <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">Primary Conversion Goal</span>
                <div className="text-sm font-bold text-white">{mainGoal}</div>
              </div>
            </div>

            {/* Checklist of features */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Selected Integrations list</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedFeatures.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md border border-white/5 bg-white/2 text-[10px] text-slate-300 font-mono">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Estimated Total Card */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Suggested Budget Range</span>
                <div className="text-lg font-black text-cyan-400 font-sans mt-0.5">{budgetRange}</div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right">Draft wireframe demo: **FREE**</div>
            </div>

            {/* Bottom Actions button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <a
                href={getWhatsAppQuizLink()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Discuss Draft Plan on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  setFinished(false);
                  setStep(1);
                  setSelectedFeatures(["WhatsApp Button", "Contact Form"]);
                }}
                className="px-5 py-4 rounded-xl cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
