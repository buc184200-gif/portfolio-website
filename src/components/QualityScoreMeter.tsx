import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Zap, Search, Smartphone, Star, CheckCircle } from "lucide-react";

interface MeterItem {
  id: string;
  label: string;
  score: number;
  icon: React.ReactNode;
  colorClass: string;
}

export const QualityScoreMeter: React.FC = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animations
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const items: MeterItem[] = [
    {
      id: "speed",
      label: "Loading Speeds",
      score: 99,
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      colorClass: "stroke-cyan-400"
    },
    {
      id: "mobile",
      label: "Mobile Usability",
      score: 98,
      icon: <Smartphone className="w-5 h-5 text-blue-400" />,
      colorClass: "stroke-blue-400"
    },
    {
      id: "seo",
      label: "On-Page SEO",
      score: 95,
      icon: <Search className="w-5 h-5 text-purple-400" />,
      colorClass: "stroke-purple-400"
    },
    {
      id: "trust",
      label: "Trust Score",
      score: 90,
      icon: <Star className="w-5 h-5 text-amber-400" />,
      colorClass: "stroke-amber-400"
    }
  ];

  const strokeDashArray = (score: number) => {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: animated ? strokeDashoffset : circumference
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
      <div className="text-center md:text-left pb-6 border-b border-white/5 space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Production QA Standards</span>
        <h3 className="text-2xl font-bold text-white font-sans">Our Absolute Website Readiness benchmarks</h3>
        <p className="text-xs text-slate-400 font-sans">Every website launched by our studio is rigorously checked against top performance metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col items-center text-center space-y-3.5 hover:border-blue-500/15 transition-colors duration-300"
          >
            {/* Visual Circular Gauge */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="32" className="stroke-slate-800" strokeWidth="5.5" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="32"
                  className={`${item.colorClass} transition-all duration-1000 ease-out`}
                  strokeWidth="5.5"
                  fill="transparent"
                  strokeLinecap="round"
                  style={strokeDashArray(item.score)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
                {item.icon}
                <span className="text-sm font-bold text-white font-mono mt-0.5">{item.score}%</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <div className="text-xs font-bold text-slate-300 font-sans">{item.label}</div>
              <div className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider">Lighthouse SLA</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust note */}
      <div className="flex gap-2 p-3.5 rounded-xl bg-blue-950/15 border border-blue-500/10 mt-6 text-left">
        <CheckCircle className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-normal font-sans">
          <strong>Quality SLA Assured:</strong> We optimize code structures, compress background assets, and build clean CSS layouts so your site ranks well, feels fast to clients on 4G connections, and displays clear pathways to book.
        </p>
      </div>
    </div>
  );
};
