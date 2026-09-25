export default async (request: Request, context: any) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const countryCode = (context.geo?.country?.code || "US").toUpperCase();
  const countryName = context.geo?.country?.name || countryCode;

  return new Response(
    JSON.stringify({
      countryCode,
      countryName,
      source: "netlify_edge",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

export const config = {
  path: "/api/geo/country",
};
