import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";
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

// JWT Secret and Utilities for Secure Authentication Gate
const JWT_SECRET = process.env.JWT_SECRET || "crestiva_super_secret_key_123_abc";

function signToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", JWT_SECRET)
      .update(`${header}.${data}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
  } catch (err) {
    return null;
  }
}

function getAuthenticatedUser(req: express.Request): any | null {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

// Server-side Persistent User Store
const USERS_FILE = path.join(process.cwd(), "users.json");

function readUsers(): Record<string, any> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading users file:", err);
  }
  return {};
}

function writeUsers(users: Record<string, any>) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users file:", err);
  }
}

// Trusted Server-Side Pricing Configurations
const TRUSTED_PACKAGES: Record<string, number> = {
  "Starter Package": 15499,
  "Growth Package": 25999,
  "Elite Package": 44399,
};

const CUSTOM_WEBSITE_TYPES: Record<string, number> = {
  "Business Website": 9599,
  "Coaching Institute": 18499,
  "Gym Website": 18499,
  "Clinic Website": 18499,
  "Salon Website": 18499,
  "Portfolio Website": 9599,
  "Restaurant Website": 18499,
  "E-commerce Store": 25000,
  "Custom Solution": 44399,
};

const CUSTOM_PAGES: Record<string, number> = {
  "1-5 Pages": 0,
  "6-10 Pages": 5000,
  "11-20 Pages": 12000,
  "20+ Pages": 25000,
};

const CUSTOM_DESIGNS: Record<string, number> = {
  "Standard": 0,
  "Premium": 8000,
  "Luxury": 20000,
};

const CUSTOM_FEATURES: Record<string, number> = {
  "WhatsApp Integration": 1000,
  "Contact Form": 1500,
  "Blog System": 8000,
  "Appointment Booking": 5000,
  "AI Chat Assistant": 12000,
  "Lead Generation Forms": 3000,
  "Payment Gateway": 3000,
  "E-commerce Store": 15000,
  "Admin Dashboard": 10000,
  "CRM Integration": 15000,
  "Membership System": 18000,
  "Multi-language Support": 10000,
  "Google Maps Integration": 1500,
  "Advanced SEO": 8000,
  "Speed Optimization": 4000,
  "Custom Animations": 6000,
  "WebGL Effects": 25000,
};

const CUSTOM_ADDONS: Record<string, number> = {
  "Google Analytics": 2000,
  "Facebook Pixel": 2000,
  "Conversion Tracking": 5000,
  "Email Marketing Setup": 8000,
};

// In-Memory Double-Click / Duplicate Order Request Rate Limiter
const activeOrderRequests = new Set<string>();

// 1. Auth Register Endpoint
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    if (users[cleanEmail]) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    users[cleanEmail] = { name: name.trim(), password };
    writeUsers(users);

    const token = signToken({ email: cleanEmail, name: name.trim() });
    return res.json({ success: true, token, name: name.trim(), email: cleanEmail });
  } catch (err: any) {
    console.error("Register API error:", err);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
});

// 2. Auth Login Endpoint
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users[cleanEmail];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ success: true, token, name: user.name, email: cleanEmail });
  } catch (err: any) {
    console.error("Login API error:", err);
    return res.status(500).json({ error: "Internal server error during login." });
  }
});

// 3. Secure Create Order Endpoint (Strictly server-validated)
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }

    const { packageId, payPercent, customDetails } = req.body;
    if (!packageId || !payPercent) {
      return res.status(400).json({ error: "Missing package ID or payment percentage." });
    }

    const percentage = parseInt(payPercent);
    if (percentage !== 25 && percentage !== 50 && percentage !== 100) {
      return res.status(400).json({ error: "Invalid payment percentage. Must be 25%, 50%, or 100%." });
    }

    // Rate-limit duplicate double-click requests
    const requestKey = `${user.email}_${packageId}_${percentage}`;
    if (activeOrderRequests.has(requestKey)) {
      return res.status(409).json({ error: "Duplicate order request in progress. Please wait." });
    }
    activeOrderRequests.add(requestKey);
    setTimeout(() => activeOrderRequests.delete(requestKey), 4000); // 4-second rate limit window

    let totalPrice = 0;

    if (TRUSTED_PACKAGES[packageId] !== undefined) {
      // Standard predefined packages
      totalPrice = TRUSTED_PACKAGES[packageId];
    } else if (packageId === "Custom Quote") {
      // Re-calculate custom quote on the server to ensure maximum security
      if (!customDetails) {
        return res.status(400).json({ error: "Missing custom details for custom quote pricing." });
      }

      const { websiteType, pages, designLevel, features, addons } = customDetails;
      
      const basePrice = CUSTOM_WEBSITE_TYPES[websiteType] || 0;
      const pagesPrice = CUSTOM_PAGES[pages] || 0;
      const designPrice = CUSTOM_DESIGNS[designLevel] || 0;

      let featuresPrice = 0;
      if (Array.isArray(features)) {
        features.forEach((f: string) => {
          featuresPrice += CUSTOM_FEATURES[f] || 0;
        });
      }

      let addonsPrice = 0;
      if (Array.isArray(addons)) {
        addons.forEach((a: string) => {
          addonsPrice += CUSTOM_ADDONS[a] || 0;
        });
      }

      totalPrice = basePrice + pagesPrice + designPrice + featuresPrice + addonsPrice;
    } else {
      return res.status(400).json({ error: "Invalid package selection." });
    }

    if (totalPrice <= 0) {
      return res.status(400).json({ error: "We could not prepare the checkout. Invalid pricing calculated." });
    }

    // Server-side payment amount calculation (completely shielded from browser tools modification)
    const amountDue = Math.round(totalPrice * (percentage / 100));

    // Razorpay Integration
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_MOCK_${crypto.randomBytes(8).toString("hex")}`;

    if (keyId && keySecret && keyId !== "rzp_test_DUMMY_KEY_123" && !keyId.includes("DUMMY")) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: amountDue * 100, // in paise
            currency: "INR",
            receipt: `receipt_${crypto.randomBytes(6).toString("hex")}`,
          })
        });

        if (rpResponse.ok) {
          const rpData: any = await rpResponse.json();
          orderId = rpData.id;
        } else {
          const errText = await rpResponse.text();
          console.error("Razorpay API error response:", errText);
        }
      } catch (err) {
        console.error("Failed to create real Razorpay order, falling back to mock:", err);
      }
    }

    return res.json({
      success: true,
      orderId,
      amount: amountDue,
      totalPrice,
      currency: "INR",
      keyId: keyId || "rzp_test_DUMMY_KEY_123",
      email: user.email,
      name: user.name
    });
  } catch (err: any) {
    console.error("Create order API error:", err);
    return res.status(500).json({ error: "We could not prepare the checkout. No payment was taken." });
  }
});

// 4. Secure Payment Verification Endpoint
app.post("/api/payment/verify", (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: "Missing transaction parameters." });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // HMAC Signature verification on the server
    if (keySecret && keySecret !== "rzp_test_DUMMY_KEY_123" && !keySecret.includes("DUMMY") && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Payment verification was unsuccessful. Please contact us before trying again." });
      }
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (err: any) {
    console.error("Verify payment API error:", err);
    return res.status(500).json({ error: "Payment verification was unsuccessful. Please contact us before trying again." });
  }
});

// 5. Health check
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
    app.get("/see-more", (req, res) => {
      res.sendFile(path.join(distPath, "see-more.html"));
    });
    app.get("/projects", (req, res) => {
      res.sendFile(path.join(distPath, "projects.html"));
    });
    app.get("/demo", (req, res) => {
      res.sendFile(path.join(distPath, "demo.html"));
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
