import type { Handler } from "@netlify/functions";

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

export const handler: Handler = async (event, context) => {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Reject anything but POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Method Not Allowed. Only POST is accepted.",
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { message, conversation } = body;

    // Validate visitor message
    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Message is required and must be a string.",
        }),
      };
    }

    // Limit message to 1500 characters
    if (message.length > 1500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Message exceeds the maximum limit of 1500 characters.",
        }),
      };
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("Missing NVIDIA_API_KEY env variable");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unable to respond right now.",
        }),
      };
    }

    const model = process.env.NVIDIA_MODEL || "openai/gpt-oss-120b";

    // Reconstruct conversation messages
    const formattedMessages = [
      { role: "system", content: SYSTEM_INSTRUCTION }
    ];

    if (Array.isArray(conversation)) {
      // Keep only last 10 messages for safety and speed
      const recentConversation = conversation.slice(-10);
      for (const msg of recentConversation) {
        if (msg && typeof msg === "object" && msg.content) {
          const role = msg.role === "user" ? "user" : "assistant";
          formattedMessages.push({
            role,
            content: String(msg.content).substring(0, 1500),
          });
        }
      }
    }

    // Add current user message
    formattedMessages.push({ role: "user", content: message });

    // Request with controller for Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25-second timeout

    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          top_p: 1,
          max_tokens: 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error(`NVIDIA API Error response: ${response.status} - ${errText}`);
        return {
          statusCode: 502,
          headers,
          body: JSON.stringify({
            success: false,
            error: "Unable to respond right now.",
          }),
        };
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "";

      if (!aiResponse) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: "Unable to respond right now.",
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: aiResponse,
        }),
      };

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === "AbortError") {
        console.error("NVIDIA API request timed out after 25 seconds.");
      } else {
        console.error("NVIDIA API request failed:", fetchError);
      }
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unable to respond right now.",
        }),
      };
    }

  } catch (err) {
    console.error("Netlify function handler error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Unable to respond right now.",
      }),
    };
  }
};
