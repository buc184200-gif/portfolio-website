import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Gemini Client successfully initialized server-side.");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. AI features will fallback to demo simulation.");
}

// System Instruction for Crestiva Web Studio AI Consultant
const SYSTEM_INSTRUCTION = `
You are Crestiva Web Studio's AI Website Consultant. Help local business owners choose the right website package and plan. 
You are friendly, honest, smart, and business-focused. Speak with professional composure.

Our Website Pricing & Packages:
1. Basic Website (₹4,000 - ₹8,000): Best for single-page sites, basic online presence, essential info, WhatsApp click button, and basic landing layouts.
2. Business Website (₹8,000 - ₹12,000): Best for multi-section/up to 5 pages, contact form, Google Maps, basic SEO, and direct WhatsApp lead triggers.
3. Premium Website (₹12,000 - ₹30,000): Best for high-end custom designs, smooth animations, up to 10 pages, conversion copywriting help, and schema optimization.
4. Luxury Website (₹30,000 - ₹1,00,000+): Best for custom e-commerce stores, admin dashboards, booking calendars, relational databases, custom APIs, and tailored smart AI chatbots.

Agency Details:
- Name: Crestiva Web Studio
- Team:
  - Khsuwant Singh: Founder, Web Designer & Developer. Builds highly optimized, stunning websites that render fast.
  - Sarthak Sengar: Co-Founder & Lead Generation Partner. Connects local businesses with our studio.
- Positioning: "We build modern websites that help local businesses get more calls, WhatsApp enquiries, and customers."
- Tone rules:
  - Keep responses clear, compact, friendly, scannable, and directly helpful for small business owners.
  - Never fake testimonials or big agency claims.
  - Never guarantee exact quantities of leads (e.g. "We guarantee 500 leads"). Instead say: "We build websites engineered to build maximum trust and make it extremely easy for visitors to enquire, but actual leads depend on your traffic, pricing, and responsiveness."
  - Always encourage serious clients to click our WhatsApp link to talk with Khsuwant directly for a free wireframe demo.

If asked about yourself or the studio, represent yourself proudly as our official AI assistant!
`;

// API Routes

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// 2. Chat agent route
app.post("/api/agent", async (req, res) => {
  try {
    const { messages, thinking } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid 'messages' format. Expected an array of chat history." });
    }

    // Fallback if Gemini key is missing
    if (!ai) {
      // Return a simulated high-quality response
      const lastUserMsg = messages[messages.length - 1]?.text || "";
      let mockReply = "Hello! I am Crestiva Web Studio's AI assistant. (Running in demo mode because API key is not configured). We build modern websites that help local businesses get more enquiries. What kind of business do you run?";
      
      if (lastUserMsg.toLowerCase().includes("price") || lastUserMsg.toLowerCase().includes("cost")) {
        mockReply = `Our pricing is highly accessible for local businesses:\n\n- **Basic Website**: ₹4,000 - ₹8,000\n- **Business Website**: ₹8,000 - ₹12,000\n- **Premium Website**: ₹12,000 - ₹30,000\n- **Luxury Web App**: ₹30,000 - ₹1,00,000+\n\nWhich package fits your goals best? I can suggest custom options!`;
      } else if (lastUserMsg.toLowerCase().includes("how long") || lastUserMsg.toLowerCase().includes("time")) {
        mockReply = `A standard single-page or Basic website takes **3 to 7 days** to complete. Multi-page Business sites take **7 to 14 days**, while custom Luxury platforms with payment pathways take **2 to 4 weeks**. We work very fast and keep you updated on WhatsApp!`;
      } else if (lastUserMsg.toLowerCase().includes("coaching") || lastUserMsg.toLowerCase().includes("institute") || lastUserMsg.toLowerCase().includes("class")) {
        mockReply = `We specialize in **Coaching & Tuition Institute websites**! We include: student results grids, course lists, trainer profiles, parent testimonials, and instant WhatsApp inquiry flows so parents can ask about batch timings in 1 click.\n\nOur Business package (₹8k-12k) is perfect for this. Shall we set up a free wireframe demo?`;
      } else if (lastUserMsg.toLowerCase().includes("clinic") || lastUserMsg.toLowerCase().includes("doctor") || lastUserMsg.toLowerCase().includes("dentist")) {
        mockReply = `For **Clinics and Doctors**, we design clean, comforting websites highlighting your credentials, treatment list, consultation fees, hours, Google Maps, and a 'Request Appointment' trigger connected directly to WhatsApp.\n\nOur Business package is ideal for medical clinics. Would you like us to draft a wireframe demo?`;
      }

      return res.json({ text: mockReply });
    }

    // Map history to official @google/genai parameters format
    const contents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Choose model and config based on 'thinking' level
    const useThinkingModel = !!thinking;
    const model = useThinkingModel ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (useThinkingModel) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
      // CRITICAL constraint: "Do not set maxOutputTokens" for ThinkingLevel.HIGH
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: error.message || "Internal server error during AI generation." });
  }
});

// 3. Simulated Website Audit Analyzer route
app.post("/api/audit", async (req, res) => {
  try {
    const { businessName, websiteLink, businessType, whatsappNumber, mainProblem } = req.body;

    if (!businessName || !businessType) {
      return res.status(400).json({ error: "Business name and business type are required." });
    }

    // Perform an intelligent, simulated audit report using Gemini if available to generate highly customized feedback!
    let recommendation = "";
    let scoreMobile = 78;
    let scoreCTA = 70;
    let scoreTrust = 65;
    let scoreSpeed = 82;
    let overallScore = 73;

    if (ai) {
      try {
        const auditPrompt = `
Generate a quick local business website audit for:
Business Name: ${businessName}
Business Type: ${businessType}
Website (optional): ${websiteLink || "No current website"}
Primary Issue: ${mainProblem || "Needs more customers/trust"}

Generate exactly 3 bullet points with custom actionable advice for this industry. Keep it extremely direct, encouraging, and highly specific to ${businessType}.
Do not write introductory or concluding fluff. Just return the 3 bullets in markdown.
`;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: auditPrompt,
          config: {
            systemInstruction: "You are an elite web conversion and local SEO strategist. Keep answers short and actionable.",
          }
        });
        recommendation = response.text || "";
      } catch (err) {
        console.error("AI audit content generation failed:", err);
      }
    }

    if (!recommendation) {
      // Custom static recommendations if Gemini API failed or key is absent
      recommendation = `* **Unclear Call-to-Action**: Visitors cannot easily locate a WhatsApp button to ask about packages or appointments instantly. Adding floating CTAs will double conversions.\n* **Missing Local Trust Badges**: There are no clear client results, doctor credentials, or parent testimonials highlighted on the hero screen.\n* **Slow Mobile Render**: The structural layout is heavy, which means mobile customers on 4G connections drop off before the pages load fully.`;
    }

    // Generate smart scores based on the input
    if (websiteLink && websiteLink.includes(".")) {
      scoreMobile = Math.floor(Math.random() * 15) + 65; // 65-80
      scoreCTA = Math.floor(Math.random() * 15) + 55; // 55-70
      scoreTrust = Math.floor(Math.random() * 20) + 50; // 50-70
      scoreSpeed = Math.floor(Math.random() * 15) + 70; // 70-85
    } else {
      // No website scenario
      scoreMobile = 20;
      scoreCTA = 10;
      scoreTrust = 15;
      scoreSpeed = 0;
      overallScore = 11;
    }

    overallScore = Math.round((scoreMobile + scoreCTA + scoreTrust + scoreSpeed) / 4);

    return res.json({
      overallScore,
      scoreMobile,
      scoreCTA,
      scoreTrust,
      scoreSpeed,
      recommendation,
      businessName,
      businessType,
      whatsappNumber
    });
  } catch (error: any) {
    console.error("Audit API error:", error);
    return res.status(500).json({ error: "Failed to compile website audit analysis." });
  }
});


// NVIDIA Agent Route
app.post("/api/nvidia-agent", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid 'messages' format." });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-405b-instruct", // Defaulting to a known good model just in case
        messages: messages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!response.ok) {
        // Try original model if llama 405b fails
        const response2 = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: messages,
                temperature: 0.7,
                top_p: 1,
                max_tokens: 1024,
                stream: false
            })
        });
        if (!response2.ok) {
            const errText = await response2.text();
            throw new Error(`NVIDIA API Error: ${response2.status} ${errText}`);
        }
        const data = await response2.json();
        return res.json({ text: data.choices[0].message.content });
    }

    const data = await response.json();
    return res.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("NVIDIA API error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// === TECHNICAL SEO MIDDLEWARE & CLEAN URL ROUTING ===

// 1. Lowercase URLs, Trailing Slashes, and Extensionless Redirects
app.use((req, res, next) => {
  // Ignore API routes and assets
  if (req.path.startsWith("/api/") || req.path.includes(".")) {
    return next();
  }

  // A. Force lowercase URLs (SEO best practice)
  if (req.path !== req.path.toLowerCase()) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.toLowerCase() + query);
  }

  // B. Remove trailing slash (except for the home page /)
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.slice(0, -1) + query);
  }

  next();
});

// 2. Dynamic XML Sitemap & Robots.txt Routes
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://crestiva.in/sitemap.xml
`);
});

app.get("/sitemap.xml", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://crestiva.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://crestiva.in/see-more</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://crestiva.in/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://crestiva.in/demo</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`);
});

// 3. Clean URL Page Resolvers (handles .html redirects and clean URL rendering)
app.get("/see-more.html", (req, res) => {
  return res.redirect(301, "/see-more");
});
app.get("/projects.html", (req, res) => {
  return res.redirect(301, "/projects");
});
app.get("/demo.html", (req, res) => {
  return res.redirect(301, "/demo");
});

app.get("/", (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  }
});

app.get("/see-more", (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    req.url = "/see-more.html";
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "dist", "see-more.html"));
  }
});

app.get("/projects", (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    req.url = "/projects.html";
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "dist", "projects.html"));
  }
});

app.get("/demo", (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    req.url = "/demo.html";
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "dist", "demo.html"));
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Running in DEVELOPMENT mode with Vite Middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in PRODUCTION mode with compiled assets.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully listening on http://localhost:${PORT}`);
  });
}

startServer();
