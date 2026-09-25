import { PricingMarket } from './pricingConfig';
import { CountryInfo } from './countryCurrency';
import { roundConvertedPrice, formatCurrency } from './currencyService';
import {
  getBaseSetupRange,
  getDesignSurcharge,
  getAddonPrice,
  BaseSetupRange,
} from './customQuoteConfig';

export interface CustomQuoteInputs {
  pages: string;
  design: string;
  features: string[];
  addons: string[];
  support: string;
}

export interface CustomQuoteResult {
  // Estimated Investment line
  displayTotal: string;
  basePriceUsd: string | null;
  isConverted: boolean;
  hasPlus: boolean;
  // Breakdown lines
  baseSetupDisplay: string;
  designDisplay: string;
  featuresDisplay: string;
  addonsDisplay: string;
  featureCount: number;
  addonCount: number;
  // Raw canonical amounts (INR for India, USD for international)
  canonicalMin: number;
  canonicalMax: number | null;
  canonicalBase: BaseSetupRange;
  canonicalDesign: number;
  canonicalFeaturesTotal: number;
  canonicalAddonsTotal: number;
}

/**
 * Calculate complete custom quote pricing & display values
 */
export function calculateCustomQuote(
  inputs: CustomQuoteInputs,
  country: CountryInfo,
  market: PricingMarket,
  rates: Record<string, number> = {}
): CustomQuoteResult {
  const isIndia = market === 'INDIA' || country.code === 'IN' || country.currency === 'INR';

  // 1. Get Base Setup Range
  const baseRange = getBaseSetupRange(market, inputs.pages);
  const baseMin = baseRange.min;
  const baseMax = baseRange.max;
  const hasPlus = Boolean(baseRange.hasPlus);

  // 2. Get Design Surcharge
  const designSurcharge = getDesignSurcharge(market, inputs.design);

  // 3. Get Features Total
  let featuresTotal = 0;
  const featureCount = inputs.features.length;
  for (const feat of inputs.features) {
    featuresTotal += getAddonPrice(market, feat);
  }

  // 4. Get Addons Total (Marketing addons + Support duration)
  let addonsTotal = 0;
  const addonCount = inputs.addons.length;
  for (const add of inputs.addons) {
    addonsTotal += getAddonPrice(market, add);
  }
  if (inputs.support) {
    addonsTotal += getAddonPrice(market, inputs.support);
  }

  // 5. Canonical Totals
  const extraCosts = designSurcharge + featuresTotal + addonsTotal;
  const canonicalMin = baseMin + extraCosts;
  const canonicalMax = hasPlus || baseMax === null ? null : baseMax + extraCosts;

  // 6. Format displays according to country & currency
  // 6A. India Visitor -> Fixed INR
  if (isIndia) {
    const minFormatted = formatCurrency(canonicalMin, 'INR', 'en-IN');
    const maxFormatted = canonicalMax !== null ? formatCurrency(canonicalMax, 'INR', 'en-IN') : null;
    const baseMinFmt = formatCurrency(baseMin, 'INR', 'en-IN');
    const baseMaxFmt = baseMax !== null ? formatCurrency(baseMax, 'INR', 'en-IN') : null;

    return {
      displayTotal: hasPlus ? `${minFormatted}+` : `${minFormatted} – ${maxFormatted}`,
      basePriceUsd: null,
      isConverted: false,
      hasPlus,
      baseSetupDisplay: hasPlus ? `${baseMinFmt}+` : `${baseMinFmt} – ${baseMaxFmt}`,
      designDisplay: formatCurrency(designSurcharge, 'INR', 'en-IN'),
      featuresDisplay: formatCurrency(featuresTotal, 'INR', 'en-IN'),
      addonsDisplay: formatCurrency(addonsTotal, 'INR', 'en-IN'),
      featureCount,
      addonCount,
      canonicalMin,
      canonicalMax,
      canonicalBase: baseRange,
      canonicalDesign: designSurcharge,
      canonicalFeaturesTotal: featuresTotal,
      canonicalAddonsTotal: addonsTotal,
    };
  }

  // 6B. US Visitor -> Canonical USD (No approximate mark, no base price line)
  const isUsd = country.code === 'US' || country.currency === 'USD';
  if (isUsd) {
    const minFormatted = `US$${canonicalMin.toLocaleString('en-US')}`;
    const maxFormatted = canonicalMax !== null ? `US$${canonicalMax.toLocaleString('en-US')}` : null;
    const baseMinFmt = `US$${baseMin.toLocaleString('en-US')}`;
    const baseMaxFmt = baseMax !== null ? `US$${baseMax.toLocaleString('en-US')}` : null;

    return {
      displayTotal: hasPlus ? `${minFormatted}+` : `${minFormatted} – ${maxFormatted}`,
      basePriceUsd: null,
      isConverted: false,
      hasPlus,
      baseSetupDisplay: hasPlus ? `${baseMinFmt}+` : `${baseMinFmt} – ${baseMaxFmt}`,
      designDisplay: `US$${designSurcharge.toLocaleString('en-US')}`,
      featuresDisplay: `US$${featuresTotal.toLocaleString('en-US')}`,
      addonsDisplay: `US$${addonsTotal.toLocaleString('en-US')}`,
      featureCount,
      addonCount,
      canonicalMin,
      canonicalMax,
      canonicalBase: baseRange,
      canonicalDesign: designSurcharge,
      canonicalFeaturesTotal: featuresTotal,
      canonicalAddonsTotal: addonsTotal,
    };
  }

  // 6C. International Visitor with other currency (e.g. GBP, EUR, AED, AUD, CAD, BRL, JPY)
  const rate = rates[country.currency];
  if (typeof rate === 'number' && rate > 0 && !isNaN(rate)) {
    const rawMin = canonicalMin * rate;
    const rawMax = canonicalMax !== null ? canonicalMax * rate : null;
    const roundedMin = roundConvertedPrice(rawMin);
    const roundedMax = rawMax !== null ? roundConvertedPrice(rawMax) : null;

    const minLocal = formatCurrency(roundedMin, country.currency, country.locale);
    const maxLocal = roundedMax !== null ? formatCurrency(roundedMax, country.currency, country.locale) : null;

    const usdBaseMin = `US$${canonicalMin.toLocaleString('en-US')}`;
    const usdBaseMax = canonicalMax !== null ? `US$${canonicalMax.toLocaleString('en-US')}` : null;
    const basePriceUsd = hasPlus
      ? `Base price ${usdBaseMin}+`
      : `Base price ${usdBaseMin} – ${usdBaseMax}`;

    // Converted breakdown values
    const convertedBaseMin = roundConvertedPrice(baseMin * rate);
    const convertedBaseMax = baseMax !== null ? roundConvertedPrice(baseMax * rate) : null;
    const baseSetupDisplay = hasPlus
      ? `${formatCurrency(convertedBaseMin, country.currency, country.locale)}+`
      : `${formatCurrency(convertedBaseMin, country.currency, country.locale)} – ${formatCurrency(convertedBaseMax!, country.currency, country.locale)}`;

    const designDisplay = formatCurrency(roundConvertedPrice(designSurcharge * rate), country.currency, country.locale);
    const featuresDisplay = formatCurrency(roundConvertedPrice(featuresTotal * rate), country.currency, country.locale);
    const addonsDisplay = formatCurrency(roundConvertedPrice(addonsTotal * rate), country.currency, country.locale);

    return {
      displayTotal: hasPlus ? `≈ ${minLocal}+` : `≈ ${minLocal} – ${maxLocal}`,
      basePriceUsd,
      isConverted: true,
      hasPlus,
      baseSetupDisplay,
      designDisplay,
      featuresDisplay,
      addonsDisplay,
      featureCount,
      addonCount,
      canonicalMin,
      canonicalMax,
      canonicalBase: baseRange,
      canonicalDesign: designSurcharge,
      canonicalFeaturesTotal: featuresTotal,
      canonicalAddonsTotal: addonsTotal,
    };
  }

  // 6D. Fallback if rate is missing/failed: fall back cleanly to canonical USD
  const minFormatted = `US$${canonicalMin.toLocaleString('en-US')}`;
  const maxFormatted = canonicalMax !== null ? `US$${canonicalMax.toLocaleString('en-US')}` : null;
  const baseMinFmt = `US$${baseMin.toLocaleString('en-US')}`;
  const baseMaxFmt = baseMax !== null ? `US$${baseMax.toLocaleString('en-US')}` : null;

  return {
    displayTotal: hasPlus ? `${minFormatted}+` : `${minFormatted} – ${maxFormatted}`,
    basePriceUsd: null,
    isConverted: false,
    hasPlus,
    baseSetupDisplay: hasPlus ? `${baseMinFmt}+` : `${baseMinFmt} – ${baseMaxFmt}`,
    designDisplay: `US$${designSurcharge.toLocaleString('en-US')}`,
    featuresDisplay: `US$${featuresTotal.toLocaleString('en-US')}`,
    addonsDisplay: `US$${addonsTotal.toLocaleString('en-US')}`,
    featureCount,
    addonCount,
    canonicalMin,
    canonicalMax,
    canonicalBase: baseRange,
    canonicalDesign: designSurcharge,
    canonicalFeaturesTotal: featuresTotal,
    canonicalAddonsTotal: addonsTotal,
  };
}
