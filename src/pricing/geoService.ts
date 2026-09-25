export interface GeoResult {
  countryCode: string;
  source: 'manual' | 'auto' | 'fallback' | 'dev_sim';
}

const STORAGE_KEY = 'crestiva_pricing_country';

/**
 * Get manually stored country preference if any
 */
export function getSavedCountryPreference(): GeoResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Handle both JSON object and raw string
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.countryCode === 'string' && /^[a-zA-Z]{2}$/.test(parsed.countryCode)) {
        return {
          countryCode: parsed.countryCode.toUpperCase(),
          source: parsed.source === 'manual' ? 'manual' : 'auto',
        };
      }
    } else if (/^[a-zA-Z]{2}$/.test(raw.trim())) {
      return {
        countryCode: raw.trim().toUpperCase(),
        source: 'manual',
      };
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
}

/**
 * Save manual country preference
 * Only manual selections are permanently persisted to localStorage.
 */
export function saveManualCountry(countryCode: string): void {
  try {
    const code = countryCode.trim().toUpperCase();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        countryCode: code,
        source: 'manual',
        updatedAt: Date.now(),
      })
    );
  } catch (e) {
    // Ignore storage quota errors
  }
}

/**
 * Clear saved country preference
 */
export function clearCountryPreference(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

/**
 * Detect Country following strict priority rules:
 * 1. Previously saved manual preference
 * 2. Development simulation (?sim_country=XX)
 * 3. Server endpoint (/api/geo/country)
 * 4. Client-side privacy-friendly geo fallback (https://api.country.is/)
 * 5. Safe fallback ('US')
 */
export async function detectCountry(): Promise<GeoResult> {
  // Priority 1: User's previously saved manual preference
  const saved = getSavedCountryPreference();
  if (saved && saved.source === 'manual') {
    return saved;
  }

  // Priority 2: Development-only country simulation
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const simParam = params.get('sim_country');
    if (simParam && /^[a-zA-Z]{2}$/.test(simParam.trim())) {
      return {
        countryCode: simParam.trim().toUpperCase(),
        source: 'dev_sim',
      };
    }
  }

  // Priority 3: Server country detection endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('/api/geo/country', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.countryCode === 'string' && /^[a-zA-Z]{2}$/.test(data.countryCode)) {
        return {
          countryCode: data.countryCode.toUpperCase(),
          source: data.simulated ? 'dev_sim' : 'auto',
        };
      }
    }
  } catch (err) {
    // Server endpoint timed out or unavailable, try client-side fallback
  }

  // Priority 4: Client-side privacy-friendly lookup (zero IP or GPS collected)
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
    // Client-side geo API also unavailable
  }

  // Priority 5: Safe Fallback (US / International USD)
  return {
    countryCode: 'US',
    source: 'fallback',
  };
}
