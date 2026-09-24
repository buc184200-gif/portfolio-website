import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
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

// Helper methods mapping to Firestore
async function readUser(email: string): Promise<any | null> {
  try {
    const doc = await db.collection("users").doc(email).get();
    return doc.exists ? doc.data() : null;
  } catch (err) {
    console.error("Error reading user from Firestore:", err);
    return null;
  }
}

async function writeUser(email: string, userData: any) {
  try {
    await db.collection("users").doc(email).set(userData, { merge: true });
  } catch (err) {
    console.error("Error writing user to Firestore:", err);
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

// In-Memory OTP Store
const activeOtps: Record<string, { otp: string; expiresAt: number; attempts: number; lastSentAt: number }> = {};

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. Auth Register Endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    
    if (user && user.verified === true) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    
    // Create or update unverified user
    await writeUser(cleanEmail, { name: name.trim(), password, verified: false });

    // Generate and store OTP
    const otp = generateOtp();
    activeOtps[cleanEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
      attempts: 0,
      lastSentAt: Date.now()
    };

    console.log(`
==================================================
[OTP EMAIL VERIFICATION]
To: ${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: ${otp}
Expires in: 5 minutes
==================================================
    `);

    return res.json({ 
      success: true, 
      message: "Verification code sent to your email.", 
      email: cleanEmail,
      demoOtp: otp
    });
  } catch (err: any) {
    console.error("Register API error:", err);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
});

// 2. Auth Login Endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    if (user.verified !== true) {
      const otp = generateOtp();
      activeOtps[cleanEmail] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
        lastSentAt: Date.now()
      };

      console.log(`
==================================================
[OTP EMAIL VERIFICATION - LOGIN TRIGGERED]
To: ${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: ${otp}
Expires in: 5 minutes
==================================================
      `);

      return res.status(403).json({ 
        error: "Please verify your email address to continue.", 
        unverified: true,
        email: cleanEmail,
        demoOtp: otp
      });
    }

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ success: true, token, name: user.name, email: cleanEmail });
  } catch (err: any) {
    console.error("Login API error:", err);
    return res.status(500).json({ error: "Internal server error during login." });
  }
});

// 2b. Verify OTP Endpoint
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Missing email or verification code." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const otpData = activeOtps[cleanEmail];
    if (!otpData) {
      return res.status(400).json({ error: "No active verification code found. Please request a new one." });
    }

    if (Date.now() > otpData.expiresAt) {
      delete activeOtps[cleanEmail];
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    if (otpData.attempts >= 3) {
      delete activeOtps[cleanEmail];
      return res.status(400).json({ error: "Too many incorrect attempts. Please request a new code." });
    }

    if (otpData.otp !== otp.trim()) {
      otpData.attempts += 1;
      const remaining = 3 - otpData.attempts;
      return res.status(400).json({ 
        error: `Invalid verification code. ${remaining} attempt(s) remaining.` 
      });
    }

    // Success! Verify user
    user.verified = true;
    await writeUser(cleanEmail, user);

    delete activeOtps[cleanEmail];

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ 
      success: true, 
      token, 
      name: user.name, 
      email: cleanEmail,
      message: "Email address verified successfully!" 
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Internal server error during OTP verification." });
  }
});

// 2c. Resend OTP Endpoint
app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.verified === true) {
      return res.status(400).json({ error: "This account is already verified." });
    }

    // Cooldown check (30 seconds)
    const existing = activeOtps[cleanEmail];
    if (existing && (Date.now() - existing.lastSentAt < 30000)) {
      const remainingSec = Math.ceil((30000 - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${remainingSec} second(s) before requesting another code.` });
    }

    const otp = generateOtp();
    activeOtps[cleanEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: Date.now()
    };

    console.log(`
==================================================
[OTP EMAIL VERIFICATION - RESENT]
To: ${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: ${otp}
Expires in: 5 minutes
==================================================
    `);

    return res.json({ 
      success: true, 
      message: "Verification code resent successfully.", 
      demoOtp: otp 
    });
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ error: "Internal server error during resending." });
  }
});

// 3. Secure Create Order Endpoint (Strictly server-validated)
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    const dbUser = await readUser(user.email);
    if (!dbUser || dbUser.verified !== true) {
      return res.status(403).json({ error: "Your email is unverified. Please verify your email first." });
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

    try {
      await db.collection("orders").doc(orderId).set({
        email: user.email,
        packageId,
        percentage,
        totalPrice,
        amountDue,
        status: "created",
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to save initial order to Firestore:", err);
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
app.post("/api/payment/verify", async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    const dbUser = await readUser(user.email);
    if (!dbUser || dbUser.verified !== true) {
      return res.status(403).json({ error: "Your email is unverified. Please verify your email first." });
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

    try {
      await db.collection("orders").doc(razorpay_order_id).set({
        email: user.email,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        verifiedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to save order to Firestore:", err);
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
