import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  let countryCode = "US";
  let countryName = "United States";
  let source = "fallback";

  // 1. Direct Netlify runtime context
  if (context?.geo?.country?.code) {
    countryCode = context.geo.country.code.toUpperCase();
    countryName = context.geo.country.name || countryCode;
    source = "netlify_context";
  }
  // 2. Netlify header x-nf-geo (base64 or JSON)
  else if (event.headers["x-nf-geo"]) {
    try {
      let raw = event.headers["x-nf-geo"];
      // Handle base64 encoded header if present
      if (!raw.startsWith("{")) {
        try {
          raw = Buffer.from(raw, "base64").toString("utf-8");
        } catch {}
      }
      const parsed = JSON.parse(raw);
      if (parsed?.country?.code) {
        countryCode = parsed.country.code.toUpperCase();
        countryName = parsed.country.name || countryCode;
        source = "netlify_header_nf_geo";
      }
    } catch {}
  }
  // 3. Cloudflare / CDN headers
  else if (event.headers["x-country"] || event.headers["cf-ipcountry"]) {
    const rawCode = (event.headers["x-country"] || event.headers["cf-ipcountry"] || "").trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(rawCode) && rawCode !== "XX") {
      countryCode = rawCode;
      source = "cdn_header";
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      countryCode,
      countryName,
      source,
    }),
  };
};
