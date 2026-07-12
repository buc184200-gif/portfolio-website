import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldCheck, Cpu, ArrowRight, RefreshCw, Star, Zap, Smartphone, Target } from "lucide-react";
import { getWhatsAppLink } from "../data/siteConfig";

interface AuditResult {
  overallScore: number;
  scoreMobile: number;
  scoreCTA: number;
  scoreTrust: number;
  scoreSpeed: number;
  recommendation: string;
  businessName: string;
  businessType: string;
  whatsappNumber: string;
}

export const AIAuditScanner: React.FC = () => {
  // Form inputs
  const [businessName, setBusinessName] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [businessType, setBusinessType] = useState("Coaching Institute");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mainProblem, setMainProblem] = useState("");

  // Scan state managers
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);

  const scanLogs = [
    "Establishing cloud matrix tunnel...",
    "Analyzing viewport breakpoints & CSS selectors...",
    "Checking Call-to-Action placement & WhatsApp paths...",
    "Scanning structural trust markers (testimonials, reviews)...",
    "Measuring page latency & first contentful paint...",
    "Evaluating SEO meta layouts & semantic HTML structure...",
    "Generating custom conversion improvement suggestions..."
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || isScanning) return;

    setIsScanning(true);
    setResult(null);
    setScanStep(0);

    // Simulate terminal logs over 3.5 seconds
    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanLogs.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          websiteLink,
          businessType,
          whatsappNumber,
          mainProblem,
        }),
      });

      const data = await res.json();
      
      // Keep terminal visible until simulations are finished
      setTimeout(() => {
        setResult(data);
        setIsScanning(false);
      }, 3500);
    } catch (err) {
      console.error("Audit scan failed:", err);
      setIsScanning(false);
      clearInterval(interval);
    }
  };

  const getWhatsAppAuditLink = () => {
    if (!result) return "";
    const text = `Hi Khsuwant! I just ran my website through your AI Audit Scanner.
*Business:* ${result.businessName} (${result.businessType})
*Website:* ${websiteLink || "No website yet"}
*Overall Score:* ${result.overallScore}%
*Main Goal:* ${mainProblem || "Get more customers"}

I'd love to chat on WhatsApp for a full free analysis and look at your custom wireframe demo!`;
    return getWhatsAppLink(text);
  };

  // Helper for circular gauge path math
  const strokeDashArray = (score: number) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset,
    };
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isScanning && !result && (
          <motion.form
            key="audit-form"
            onSubmit={handleScan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md max-w-2xl mx-auto space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Dental Care"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Business Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Business Category</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option>Coaching Institute</option>
                  <option>Healthcare Clinic</option>
                  <option>Gym & Fitness</option>
                  <option>Restaurant / Cafe</option>
                  <option>Retail / Local Shop</option>
                  <option>Real Estate Agent</option>
                  <option>Salon & Spa</option>
                  <option>Service Business</option>
                  <option>E-commerce Store</option>
                  <option>Startup / Agency</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Website Link */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Existing Link (Optional)</label>
                <input
                  type="url"
                  placeholder="e.g. https://myclinic.com (leave blank if none)"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Main conversion bottleneck / problem */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Main Goal / Problem</label>
              <textarea
                rows={2}
                placeholder="e.g. Want more student admissions / Customers complain site is slow / Don't have a modern design..."
                value={mainProblem}
                onChange={(e) => setMainProblem(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Action Trigger button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all duration-300"
            >
              <Cpu className="w-4 h-4 animate-spin" />
              Analyze My Online Presence
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        )}

        {/* Loading Scanning terminal state */}
        {isScanning && (
          <motion.div
            key="audit-terminal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl border border-white/10 bg-slate-950 font-mono text-xs text-blue-400 space-y-4 max-w-2xl mx-auto shadow-2xl overflow-hidden relative"
          >
            {/* Window bar */}
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="text-slate-500 ml-2">crestiva-ai-scanner.sh</span>
            </div>

            {/* Terminal logs list */}
            <div className="space-y-2 h-44 overflow-y-auto pt-2">
              {scanLogs.slice(0, scanStep + 1).map((log, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <span className="text-slate-500 shrink-0">[$]</span>
                  <span className={index === scanStep ? "text-cyan-400 animate-pulse font-semibold" : "text-slate-400"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>

            {/* Scan Sweep lines visually */}
            <div className="absolute inset-x-0 top-12 h-0.5 bg-blue-500/30 filter blur-xs animate-[bounce_3.5s_infinite]" />
          </motion.div>
        )}

        {/* Audit Report Result state */}
        {result && !isScanning && (
          <motion.div
            key="audit-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md max-w-3xl mx-auto space-y-8"
          >
            {/* Header Score Overview */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                  Audit Report Completed
                </span>
                <h3 className="text-2xl font-bold text-white font-sans">{result.businessName}</h3>
                <p className="text-slate-400 text-sm font-sans">Industry profile: {result.businessType}</p>
              </div>

              {/* Master Circular Gauge */}
              <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 shadow-md">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="30" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      className="stroke-blue-500 transition-all duration-1000"
                      strokeWidth="6"
                      fill="transparent"
                      strokeLinecap="round"
                      style={strokeDashArray(result.overallScore)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white font-mono">{result.overallScore}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Conversion Score</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {result.overallScore >= 80 ? "Good Readiness" : result.overallScore >= 50 ? "Needs Better Conversion Elements" : "High Bounce Risk - Needs Redesign"}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Sub-Scores gauges row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Mobile Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 text-center space-y-2">
                <Smartphone className="w-5 h-5 text-blue-400 mx-auto" />
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mobile Layout</div>
                <div className="text-xl font-bold text-white font-mono">{result.scoreMobile}%</div>
              </div>

              {/* Speed Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 text-center space-y-2">
                <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Loading Speeds</div>
                <div className="text-xl font-bold text-white font-mono">{result.scoreSpeed}%</div>
              </div>

              {/* CTA Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 text-center space-y-2">
                <Target className="w-5 h-5 text-indigo-400 mx-auto" />
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CTA Clarity</div>
                <div className="text-xl font-bold text-white font-mono">{result.scoreCTA}%</div>
              </div>

              {/* Trust Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 text-center space-y-2">
                <Star className="w-5 h-5 text-purple-400 mx-auto" />
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Trust Factors</div>
                <div className="text-xl font-bold text-white font-mono">{result.scoreTrust}%</div>
              </div>
            </div>

            {/* Recommendations Content block */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-mono text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" />
                AI Strategy Recommendations
              </h4>
              <div className="p-5 rounded-xl border border-white/5 bg-slate-900/40 font-sans text-slate-300 text-sm leading-relaxed space-y-3">
                {/* Properly map bullets */}
                {result.recommendation.split("\n").map((line, idx) => {
                  if (line.startsWith("*") || line.startsWith("-")) {
                    return (
                      <div key={idx} className="flex gap-2 items-start pl-1">
                        <span className="text-blue-400 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-slate-300">
                          {line.replace(/^[\s*-]+/, "").split("**").map((text, sIdx) => 
                            sIdx % 2 === 1 ? <strong key={sIdx} className="text-white font-semibold">{text}</strong> : text
                          )}
                        </span>
                      </div>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            </div>

            {/* Bottom Actions button & Re-analyze */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={getWhatsAppAuditLink()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300"
              >
                <ShieldCheck className="w-4.5 h-4.5" />
                Get Full Free Audit on WhatsApp
                <ArrowRight className="w-4.5 h-4.5" />
              </a>

              <button
                onClick={() => {
                  setResult(null);
                  setBusinessName("");
                  setWebsiteLink("");
                  setWhatsappNumber("");
                  setMainProblem("");
                }}
                className="px-5 py-4 rounded-xl cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze New Business
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
