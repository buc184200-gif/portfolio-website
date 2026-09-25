export interface GeoResult {
  countryCode: string;
  countryName?: string;
  source: 'netlify_edge' | 'server' | 'auto' | 'fallback' | 'dev_sim';
}

const STORAGE_KEY = 'crestiva_pricing_country';

/**
 * Clean up any legacy manual country override stored from previous versions.
 * Visitors must not be able to retain or use manual overrides.
 */
export function purgeLegacyManualOverrides(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Detect Country automatically following strict precedence:
 * 1. Server / Netlify Edge endpoint (/api/geo/country) - utilizing Netlify context.geo.country.code
 * 2. Privacy-friendly client IP lookup fallback (https://api.country.is/) - zero GPS or device permissions
 * 3. Safe fallback ('US') - never default to India if unknown
 *
 * NOTE: navigator.geolocation is NEVER requested or used.
 */
export async function detectCountry(): Promise<GeoResult> {
  // Purge any old manual override from previous user sessions
  purgeLegacyManualOverrides();

  // 1. Primary: Netlify Edge / Server country detection endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`/api/geo/country?_t=${Date.now()}`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { 
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.countryCode === 'string' && /^[a-zA-Z]{2}$/.test(data.countryCode)) {
        return {
          countryCode: data.countryCode.toUpperCase(),
          countryName: data.countryName,
          source: data.simulated ? 'dev_sim' : 'server',
        };
      }
    }
  } catch (err) {
    // Server / edge endpoint timed out or unavailable, proceed to client fallback
  }

  // 2. Secondary: Client-side privacy-friendly lookup (zero GPS / location permissions)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://api.country.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.country === 'string' && /^[a-zA-Z]{2}$/.test(data.country)) {
        return {
          countryCode: data.country.toUpperCase(),
          source: 'auto',
        };
      }
    }
  } catch (err) {
    // Client-side fallback unavailable
  }

  // 3. Tertiary: Safe Fallback (US / International USD default)
  // NEVER default to Indian pricing when detection fails
  return {
    countryCode: 'US',
    countryName: 'United States',
    source: 'fallback',
  };
}
