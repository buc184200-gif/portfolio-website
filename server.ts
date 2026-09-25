import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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


// Initialize Firebase Admin
let db: FirebaseFirestore.Firestore;
try {
  let credential = applicationDefault();
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = cert(serviceAccount);
    } catch (e) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT as JSON. Falling back to applicationDefault().");
    }
  }

  const firebaseApp = initializeApp({
    credential,
    projectId: "optical-fold-818qq"
  });
  db = getFirestore(firebaseApp);
  db.settings({ databaseId: "ai-studio-crestivawebstudi-64161a69-50b8-4cb3-bf43-a31d0e9ea07d" });
  console.log("Firebase Admin initialized successfully.");
} catch (e) {
  console.error("Error initializing Firebase Admin:", e);
}


// 3. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// 4. Country Detection Endpoint for Regional Pricing
app.get("/api/geo/country", async (req, res) => {
  res.set({
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });
  try {
    // Development-only country simulation
    if (process.env.NODE_ENV !== "production") {
      const sim = (req.query.sim_country as string) || (req.headers["x-sim-country"] as string);
      if (sim && typeof sim === "string" && /^[a-zA-Z]{2}$/.test(sim.trim())) {
        return res.json({ countryCode: sim.trim().toUpperCase(), simulated: true });
      }
    }

    // Netlify geo header
    if (req.headers["x-nf-geo"]) {
      try {
        let raw = req.headers["x-nf-geo"] as string;
        if (!raw.startsWith("{")) {
          raw = Buffer.from(raw, "base64").toString("utf-8");
        }
        const parsed = JSON.parse(raw);
        if (parsed?.country?.code && /^[a-zA-Z]{2}$/.test(parsed.country.code)) {
          return res.json({ countryCode: parsed.country.code.toUpperCase(), source: "netlify_header" });
        }
      } catch {}
    }

    // Deployment infrastructure country headers (Cloudflare, Vercel, Netlify, Reverse Proxies)
    const headerCountry =
      (req.headers["cf-ipcountry"] as string) ||
      (req.headers["x-vercel-ip-country"] as string) ||
      (req.headers["x-country-code"] as string) ||
      (req.headers["x-country"] as string) ||
      (req.headers["geoip-country-code"] as string);

    if (
      headerCountry &&
      typeof headerCountry === "string" &&
      /^[a-zA-Z]{2}$/.test(headerCountry.trim()) &&
      headerCountry.trim().toUpperCase() !== "XX"
    ) {
      return res.json({ countryCode: headerCountry.trim().toUpperCase() });
    }

    // Server-side IP lookup fallback if public IP
    const rawIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const cleanIp = rawIp.replace(/^::ffff:/, "").trim();

    const isPrivate =
      !cleanIp ||
      cleanIp === "127.0.0.1" ||
      cleanIp === "::1" ||
      cleanIp.startsWith("10.") ||
      cleanIp.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanIp) ||
      cleanIp.startsWith("fe80:");

    if (!isPrivate) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const geoRes = await fetch(`https://api.country.is/${cleanIp}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (geoRes.ok) {
          const data: any = await geoRes.json();
          if (data && data.country && /^[a-zA-Z]{2}$/.test(data.country)) {
            return res.json({ countryCode: data.country.toUpperCase() });
          }
        }
      } catch (err) {
        // Fallback to safe default
      }
    }

    // Safe fallback: US (International USD default)
    return res.json({ countryCode: "US" });
  } catch (err) {
    return res.json({ countryCode: "US" });
  }
});

// 6. Lead Submission Endpoint
app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, phone, business_name, message } = req.body;
    
    if (!name || !phone || !business_name) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await db.collection("leads").add({
      name,
      email: email || "",
      phone,
      business_name,
      message: message || "",
      createdAt: new Date().toISOString()
    });

    return res.json({ success: true, message: "Lead submitted successfully." });
  } catch (err: any) {
    console.error("Lead submission error:", err);
    return res.status(500).json({ error: "Internal server error during lead submission." });
  }
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


// NVIDIA Agent Route (Unified to Gemini with Mock Fallback for rock-solid reliability)
app.post("/api/nvidia-agent", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid 'messages' format." });
    }

    // Unify message formats across different frontends (React / Plain JS)
    const normalizedMessages = messages.map((m: any) => {
      const text = m.text || m.content || "";
      const role = m.role === "user" ? "user" : "model";
      return { role, text };
    });

    // Fallback if Gemini key is missing
    if (!ai) {
      const lastUserMsg = normalizedMessages[normalizedMessages.length - 1]?.text || "";
      let mockReply = "Hello! I am Crestiva Web Studio's AI assistant. We build modern websites that help local businesses get more enquiries. What kind of business do you run?";
      
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

    const contents = normalizedMessages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return res.json({ text: response.text || "I apologize, I'm having trouble formulating a response right now." });
  } catch (error: any) {
    console.error("NVIDIA/Gemini AI agent error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Running in DEVELOPMENT mode with Vite Middleware.");
    
    app.get("/see-more", (req, res) => {
      res.sendFile(path.join(process.cwd(), "see-more.html"));
    });
    app.get("/privacy-policy", (req, res) => {
      res.sendFile(path.join(process.cwd(), "privacy-policy.html"));
    });
    app.get("/terms", (req, res) => {
      res.sendFile(path.join(process.cwd(), "terms.html"));
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in PRODUCTION mode with compiled assets.");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve any requests starting with /src directly from the source directory
    app.use("/src", express.static(path.join(process.cwd(), "src")));

    // Explicit routing for clean page URLs
    app.get("/see-more.html", (req, res) => {
      res.redirect(301, "/see-more");
    });

    app.get("/see-more", (req, res) => {
      res.sendFile(path.join(distPath, "see-more.html"));
    });
    
    app.get("/privacy-policy", (req, res) => {
      res.sendFile(path.join(distPath, "privacy-policy.html"));
    });

    app.get("/terms", (req, res) => {
      res.sendFile(path.join(distPath, "terms.html"));
    });
    
    app.get("/demo.html", (req, res) => {
      res.sendFile(path.join(distPath, "demo.html"));
    });
    app.get("/clinic-demos.html", (req, res) => {
      res.sendFile(path.join(distPath, "clinic-demos.html"));
    });
    app.get("/restaurant-demos.html", (req, res) => {
      res.sendFile(path.join(distPath, "restaurant-demos.html"));
    });
    app.get("/coaching-demos.html", (req, res) => {
      res.sendFile(path.join(distPath, "coaching-demos.html"));
    });
    app.get("/ecommerce-demos.html", (req, res) => {
      res.sendFile(path.join(distPath, "ecommerce-demos.html"));
    });
    
    // Serve static files with explicit MIME type overrides to prevent application/octet-stream issues
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === ".js" || ext === ".mjs") {
          res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        } else if (ext === ".css") {
          res.setHeader("Content-Type", "text/css; charset=utf-8");
        } else if (ext === ".html") {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
        } else if (ext === ".json") {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
        } else if (ext === ".svg") {
          res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
        } else if (ext === ".png") {
          res.setHeader("Content-Type", "image/png");
        } else if (ext === ".jpg" || ext === ".jpeg") {
          res.setHeader("Content-Type", "image/jpeg");
        } else if (ext === ".xml") {
          res.setHeader("Content-Type", "application/xml; charset=utf-8");
        } else if (ext === ".txt") {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
        }
      }
    }));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully listening on http://localhost:${PORT}`);
  });
}

startServer();
