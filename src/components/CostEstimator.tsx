import React, { useState, useEffect } from "react";
import { siteConfig, getWhatsAppLink } from "../data/siteConfig";
import { Calculator, CheckSquare, Square, DollarSign, Send, ArrowRight } from "lucide-react";

interface AddonOption {
  id: string;
  label: string;
  price: number;
}

export const CostEstimator: React.FC = () => {
  const [websiteType, setWebsiteType] = useState("business");
  const [pagesRange, setPagesRange] = useState("2-5");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["whatsapp", "maps"]);

  const [minPrice, setMinPrice] = useState(8000);
  const [maxPrice, setMaxPrice] = useState(12000);

  const addons: AddonOption[] = [
    { id: "seo", label: "Essential Local SEO Setup (+₹2,000)", price: 2000 },
    { id: "whatsapp", label: "WhatsApp Enquiry CTA (+₹1,000)", price: 1000 },
    { id: "maps", label: "Google Maps Embed (+₹1,000)", price: 1000 },
    { id: "booking", label: "Interactive Booking/Appointments (+₹3,000)", price: 3000 },
    { id: "cart", label: "COD Checkout Shopping Cart (+₹5,000)", price: 5000 },
    { id: "anim", label: "Premium 3D/Motion Elements (+₹3,000)", price: 3000 },
    { id: "copy", label: "Professional Copywriting help (+₹2,000)", price: 2000 }
  ];

  // Recalculate range whenever selection shifts
  useEffect(() => {
    let baseMin = 4000;
    let baseMax = 8000;

    if (websiteType === "basic") {
      baseMin = 4000;
      baseMax = 8000;
    } else if (websiteType === "business") {
      baseMin = 8000;
      baseMax = 12000;
    } else if (websiteType === "premium") {
      baseMin = 12000;
      baseMax = 30000;
    } else if (websiteType === "luxury") {
      baseMin = 30000;
      baseMax = 100000;
    }

    // Page count multipliers
    let multiplier = 1;
    if (pagesRange === "6-10") {
      multiplier = 1.3;
    } else if (pagesRange === "11+") {
      multiplier = 1.8;
    }

    // Addons cost calculation
    const addonsCost = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);

    let finalMin = Math.round(baseMin * multiplier + addonsCost);
    let finalMax = Math.round(baseMax * multiplier + addonsCost);

    // Round to nearest 500
    finalMin = Math.round(finalMin / 500) * 500;
    finalMax = Math.round(finalMax / 500) * 500;

    setMinPrice(finalMin);
    setMaxPrice(finalMax);
  }, [websiteType, pagesRange, selectedAddons]);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((addonId) => addonId !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const getWhatsAppEstimateLink = () => {
    const text = `Hi Khsuwant! I just generated a website plan using your cost estimator.
*Website Type:* ${websiteType} (${pagesRange} Pages)
*Addons:* ${selectedAddons.join(", ")}
*Estimate Range:* ₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice.toLocaleString("en-IN")}

I'd love to chat on WhatsApp to finalize things and look at your custom wireframe demo!`;
    return getWhatsAppLink(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Form controls (8 columns) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Website Type */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-400" />
              1. Choose Website Level
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "basic", label: "Basic Site (₹4k-8k)" },
                { id: "business", label: "Business Site (₹8k-12k)" },
                { id: "premium", label: "Premium Custom (₹12k-30k)" },
                { id: "luxury", label: "Luxury Web App (₹30k+)" }
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setWebsiteType(tier.id)}
                  className={`p-3 rounded-xl border text-xs font-sans text-left transition-all duration-200 cursor-pointer ${
                    websiteType === tier.id
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                      : "border-white/5 bg-slate-900/40 text-slate-400"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page count tier */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-sans">
              2. Total Pages Needed
            </h4>
            <div className="flex gap-4">
              {[
                { id: "1", label: "1 Page" },
                { id: "2-5", label: "2 - 5 Pages" },
                { id: "6-10", label: "6 - 10 Pages" },
                { id: "11+", label: "11+ Pages" }
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setPagesRange(tier.id)}
                  className={`flex-1 p-3 rounded-xl border text-xs font-mono text-center tracking-wide transition-all duration-200 cursor-pointer ${
                    pagesRange === tier.id
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-white/5 bg-slate-900/40 text-slate-400"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add-on selection list */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-sans">
              3. Select Custom Integrations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {addons.map((add) => {
                const isChecked = selectedAddons.includes(add.id);
                return (
                  <button
                    key={add.id}
                    type="button"
                    onClick={() => toggleAddon(add.id)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all duration-200 cursor-pointer ${
                      isChecked
                        ? "border-cyan-500 bg-cyan-500/5 text-cyan-300"
                        : "border-white/5 bg-slate-900/40 text-slate-400"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-slate-600 shrink-0" />
                    )}
                    <span className="text-xs font-sans">{add.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Calculated Value box (5 columns) */}
        <div className="lg:col-span-5 flex flex-col h-full justify-between p-6 rounded-2xl border border-blue-500/20 bg-slate-900/40 text-center space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/20 mx-auto">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Estimated Budget</span>
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-sans tracking-tight">
                ₹{minPrice.toLocaleString("en-IN")} - ₹{maxPrice.toLocaleString("en-IN")}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-normal font-sans">
              This is a standard cost indicator. Your final quote depends on pages, integrations, timeline urgency, copywriting support, and custom design layouts.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <a
              href={getWhatsAppEstimateLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              Send Estimate to WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="text-[10px] font-mono text-slate-500">
              Opens WhatsApp with pre-filled scope of work
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
