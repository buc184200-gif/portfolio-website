// Crestiva Web Studio Site Configuration

export const siteConfig = {
  name: "Crestiva Web Studio",
  tagline: "We build modern websites that help local businesses get more calls, WhatsApp enquiries, and customers.",
  description: "Modern, mobile-friendly, SEO-ready websites for coaching institutes, clinics, gyms, restaurants, shops, service providers, startups, and e-commerce brands.",
  phone: "+919354012056", // Founder Khsuwant Singh's WhatsApp/Contact Number
  phoneDisplay: "+91 93540 12056",
  email: "crestivawebstudio@gmail.com",
  location: "India",
  founder: {
    name: "Khsuwant Singh",
    role: "Founder, Web Designer & Developer",
    bio: "I build modern websites for businesses that want a stronger online presence, better trust, and easier customer enquiries.",
    responsibilities: [
      "Website design & user experience",
      "Frontend & custom development",
      "Conversion & copywriting strategy",
      "Client communication & launch support"
    ]
  },
  coFounder: {
    name: "Sarthak Sengar",
    role: "Co-Founder & Lead Generation Partner",
    bio: "Helps connect local businesses with our studio's high-converting website design services.",
    responsibilities: [
      "Local business outreach & consultation",
      "Business development & strategic partnerships",
      "Client onboarding support"
    ]
  },
  pricing: {
    basic: {
      name: "Basic Website",
      range: "₹4,000 - ₹8,000",
      bestFor: "Simple single-page websites, small local businesses, basic online presence",
      features: [
        "Single-page responsive design",
        "WhatsApp chat integration",
        "Contact info & services list",
        "Basic speed optimization",
        "Secure launch assistance"
      ]
    },
    business: {
      name: "Business Website",
      range: "₹8,000 - ₹12,000",
      bestFor: "Multi-section or small multi-page local business websites wanting more leads",
      features: [
        "Multi-section / Up to 5 pages",
        "Lead capture contact forms",
        "WhatsApp enquiry automation",
        "Google Maps integration",
        "Essential Local SEO setup",
        "Domain & hosting connection support"
      ]
    },
    premium: {
      name: "Premium Website",
      range: "₹12,000 - ₹30,000",
      bestFor: "Advanced custom design with high-end feel, copywriting, and custom conversion flows",
      features: [
        "Up to 10 fully custom pages",
        "Premium micro-interactions & animations",
        "Conversion copywriting support",
        "Advanced speed & performance optimization",
        "Local SEO schema markup & strategy",
        "Interactive lead capture widgets"
      ]
    },
    luxury: {
      name: "Luxury Website",
      range: "₹30,000 - ₹1,00,000+",
      bestFor: "Highly complex custom websites, e-commerce stores, admin panels, or advanced booking systems",
      features: [
        "Unlimited custom pages / advanced apps",
        "Full e-commerce setup (listing, cart, order flow)",
        "Relational database or admin dashboards",
        "Online booking & appointment scheduling system",
        "Integration of customized AI chatbots",
        "Custom animations, transitions, and branding"
      ]
    }
  },
  socials: {
    whatsapp: "https://wa.me/919354012056",
    emailMailto: "mailto:crestivawebstudio@gmail.com"
  }
};

/**
 * Generates a pre-filled WhatsApp link with a formatted message
 */
export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.phone.replace("+", "").replace(/\s/g, "")}?text=${encodedMessage}`;
}
