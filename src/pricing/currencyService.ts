/**
 * Fallback / Pegged Rates against 1 USD
 * Ensures seamless display even if Frankfurter API is unreachable or doesn't support pegged currencies.
 */
const PEGGED_AND_FALLBACK_RATES: Record<string, number> = {
  // Officially pegged currencies (not tracked by European Central Bank / Frankfurter)
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.307,
  BHD: 0.376,
  OMR: 0.3845,
  // Offline reference rates for major currencies
  USD: 1.0,
  EUR: 0.8797,
  GBP: 0.7565,
  AUD: 1.4232,
  CAD: 1.4117,
  CHF: 0.8278,
  JPY: 158.85,
  KRW: 1380.0,
  SGD: 1.284,
  NZD: 1.621,
  HKD: 7.78,
  BRL: 5.1808,
  ZAR: 16.4367,
  IDR: 17933.0,
  MXN: 18.25,
  MYR: 4.42,
  THB: 34.5,
  PHP: 56.2,
  TRY: 33.5,
  SEK: 10.45,
  NOK: 10.65,
  DKK: 6.56,
  PLN: 3.82,
  ILS: 3.62,
};

const FX_CACHE_KEY = 'crestiva_fx_rates_usd';
const FX_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

let inMemoryRates: Record<string, number> | null = null;
let fetchPromise: Promise<Record<string, number>> | null = null;

/**
 * Fetch and cache USD exchange rates from Frankfurter API
 * Fails safely to fallback rates without ever showing NaN or $0.
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  if (inMemoryRates) {
    return inMemoryRates;
  }

  // Deduplicate concurrent fetch requests
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    // 1. Check localStorage cache
    try {
      const cachedStr = localStorage.getItem(FX_CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (cached && cached.timestamp && Date.now() - cached.timestamp < FX_CACHE_TTL_MS && cached.rates) {
          inMemoryRates = { ...PEGGED_AND_FALLBACK_RATES, ...cached.rates };
          return inMemoryRates;
        }
      }
    } catch (e) {
      // Ignore localStorage errors (e.g. privacy mode)
    }

    // 2. Fetch latest rates from Frankfurter
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

      const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && typeof data.rates === 'object') {
          const mergedRates = {
            ...PEGGED_AND_FALLBACK_RATES,
            ...data.rates,
            USD: 1.0,
          };
          inMemoryRates = mergedRates;

          try {
            localStorage.setItem(
              FX_CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                rates: data.rates,
              })
            );
          } catch (e) {
            // Ignore quota errors
          }

          return mergedRates;
        }
      }
    } catch (err) {
      console.warn('Frankfurter FX API unavailable or timed out. Utilizing reference rates.', err);
    }

    // 3. Fallback to predefined rates
    inMemoryRates = { ...PEGGED_AND_FALLBACK_RATES };
    return inMemoryRates;
  })();

  try {
    return await fetchPromise;
  } finally {
    fetchPromise = null;
  }
}

/**
 * Premium-friendly approximate rounding for converted currencies
 * Avoids ugly decimal numbers like £2,263.47
 */
export function roundConvertedPrice(amount: number): number {
  if (!amount || isNaN(amount) || amount <= 0) return 0;

  if (amount >= 1_000_000) {
    // High nominal currencies (IDR, VND, etc.) -> round to nearest 10,000
    return Math.round(amount / 10_000) * 10_000;
  }
  if (amount >= 100_000) {
    // JPY, KRW, etc. -> round to nearest 1,000
    return Math.round(amount / 1_000) * 1_000;
  }
  if (amount >= 10_000) {
    // Round to nearest 100
    return Math.round(amount / 100) * 100;
  }
  if (amount >= 1_000) {
    // Major currencies (GBP, EUR, AUD, CAD) -> round to nearest 50
    return Math.round(amount / 50) * 50;
  }
  if (amount >= 100) {
    // Round to nearest 10
    return Math.round(amount / 10) * 10;
  }
  return Math.round(amount);
}

/**
 * Format currency using Intl.NumberFormat with native aesthetics
 */
export function formatCurrency(amount: number, currency: string, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    // Fallback if currency or locale is unsupported
    return `${currency} ${Math.round(amount).toLocaleString('en-US')}`;
  }
}

export interface CalculatedPrice {
  displayAmount: string;
  hasPlus: boolean;
  isConverted: boolean;
  basePriceUsd: string | null;
  canonicalAmount: number;
}

/**
 * Calculate final display pricing for a package
 */
export function calculatePackagePrice(
  canonicalAmount: number,
  currency: string,
  locale: string,
  isIndiaMarket: boolean,
  hasPlus: boolean = false,
  rates: Record<string, number> = PEGGED_AND_FALLBACK_RATES
): CalculatedPrice {
  const plusSuffix = hasPlus ? '+' : '';

  // 1. India Market - Fixed INR price (never converted from USD)
  if (isIndiaMarket || currency === 'INR') {
    const formatted = formatCurrency(canonicalAmount, 'INR', 'en-IN');
    return {
      displayAmount: `${formatted}${plusSuffix}`,
      hasPlus,
      isConverted: false,
      basePriceUsd: null,
      canonicalAmount,
    };
  }

  // 2. US Visitor or USD Currency - Canonical USD price
  if (currency === 'USD') {
    const formatted = formatCurrency(canonicalAmount, 'USD', 'en-US');
    return {
      displayAmount: `${formatted}${plusSuffix}`,
      hasPlus,
      isConverted: false,
      basePriceUsd: null, // No redundant base line for USD
      canonicalAmount,
    };
  }

  // 3. Converted Currency (e.g. GBP, EUR, AED, AUD, CAD, BRL, JPY)
  const rate = rates[currency];
  if (typeof rate === 'number' && rate > 0) {
    const rawConverted = canonicalAmount * rate;
    const rounded = roundConvertedPrice(rawConverted);
    const formatted = formatCurrency(rounded, currency, locale);
    const baseFormatted = `US$${canonicalAmount.toLocaleString('en-US')}${plusSuffix}`;

    return {
      displayAmount: `≈ ${formatted}${plusSuffix}`,
      hasPlus,
      isConverted: true,
      basePriceUsd: `Base price ${baseFormatted}`,
      canonicalAmount,
    };
  }

  // 4. Safe fallback if currency rate is not available: display canonical USD
  const usdFormatted = formatCurrency(canonicalAmount, 'USD', 'en-US');
  return {
    displayAmount: `${usdFormatted}${plusSuffix}`,
    hasPlus,
    isConverted: false,
    basePriceUsd: null,
    canonicalAmount,
  };
}
