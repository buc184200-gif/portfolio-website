import React, { useState } from "react";
import { siteConfig, getWhatsAppLink } from "../data/siteConfig";
import { Send, MessageSquare, ShieldCheck, Mail, MapPin } from "lucide-react";

const SUPABASE_URL = "https://fjtjloenjkzhnzbrzabb.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_jYZBb0lUodq9cR5sJeFPaA_r2gPM0cr";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Coaching Institute");
  const [whatsapp, setWhatsapp] = useState("");
  const [websiteType, setWebsiteType] = useState("Business Website (₹8k-12k)");
  const [budget, setBudget] = useState("₹8k - ₹12k");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !businessName.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const fullMessage = `Type: ${businessType}\nPackage: ${websiteType}\nBudget: ${budget}\nNotes: ${message || "N/A"}`;
      
      const response = await fetch(`${SUPABASE_URL}leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: whatsapp.trim(),
          business_name: businessName.trim(),
          message: fullMessage
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry. Please try again.");
      }

      setSubmitSuccess(true);
      
      // Optionally still open WhatsApp
      const formattedMessage = `Hi Khsuwant! I want to enquire about building a website.
*Name:* ${name}
*Business:* ${businessName} (${businessType})
*Contact WhatsApp:* ${whatsapp}
*Selected Package:* ${websiteType}
*Expected Budget:* ${budget}
*Notes:* ${message || "N/A"}`;

      const link = getWhatsAppLink(formattedMessage);
      window.open(link, "_blank");

      // Reset form
      setName("");
      setEmail("");
      setBusinessName("");
      setWhatsapp("");
      setMessage("");
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Contact Info (4 columns) */}
      <div className="lg:col-span-5 space-y-6 text-left">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Direct Touchpoints</span>
          <h3 className="text-2xl font-bold text-white font-sans">Let's build your brand trust</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Have questions about pricing, features, or timelines? Reach out directly. We answer fast on WhatsApp.
          </p>
        </div>

        {/* Contact details blocks */}
        <div className="space-y-4 pt-2">
          <div className="flex gap-3.5 items-center p-3.5 rounded-xl border border-white/5 bg-slate-900/30">
            <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">WhatsApp Chat</div>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-white hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="flex gap-3.5 items-center p-3.5 rounded-xl border border-white/5 bg-slate-900/30">
            <Mail className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Official Email</div>
              <a
                href={siteConfig.socials.emailMailto}
                className="text-sm font-bold text-white hover:underline"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="flex gap-3.5 items-center p-3.5 rounded-xl border border-white/5 bg-slate-900/30">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Office Location</div>
              <div className="text-sm font-bold text-white">{siteConfig.location}</div>
            </div>
          </div>
        </div>

        {/* Safe Badge */}
        <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-950/10 text-xs text-emerald-400/80 leading-normal">
          ✓ **No Spam Guaranteed:** We maintain absolute privacy. Your details are used strictly to consult about your project.
        </div>
      </div>

      {/* Right Contact Form (7 columns) */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md space-y-5 text-left"
        >
          {submitSuccess && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Your inquiry has been submitted successfully! Redirecting to WhatsApp...
            </div>
          )}

          {submitError && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rohit Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smile Dental Clinic"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="e.g. contact@smileclinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">WhatsApp Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
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
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Website Package Selected</label>
              <select
                value={websiteType}
                onChange={(e) => setWebsiteType(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              >
                <option>Basic Website (₹4k-8k)</option>
                <option>Business Website (₹8k-12k)</option>
                <option>Premium Website (₹12k-30k)</option>
                <option>Luxury Web App (₹30k-1L+)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Your Expected Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            >
              <option>₹4k - ₹8k</option>
              <option>₹8k - ₹12k</option>
              <option>₹12k - ₹30k</option>
              <option>₹30k - ₹1L+</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tell Us About Your Project Requirements</label>
            <textarea
              rows={3}
              placeholder="e.g. We need a 5-page website for our clinic with contact forms, operating hours, and localized SEO..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send className={`w-4 h-4 ${isSubmitting ? 'animate-bounce' : 'animate-pulse'}`} />
            {isSubmitting ? "Submitting..." : "Send Inquiry to WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
};
