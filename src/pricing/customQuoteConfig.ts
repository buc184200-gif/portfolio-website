import { PricingMarket } from './pricingConfig';

export type PageRangeOption = '1-5 Pages' | '6-10 Pages' | '11-20 Pages' | '20+ Pages';
export type DesignLevelOption = 'Standard' | 'Premium' | 'Luxury';

export interface BaseSetupRange {
  min: number;
  max: number | null;
  hasPlus?: boolean;
}

/**
 * Base Setup Pricing by Page Count Range
 * INDIA: Fixed INR (not derived from FX)
 * STANDARD_INTERNATIONAL: Canonical USD
 * PREMIUM_INTERNATIONAL: Canonical USD
 */
export const CUSTOM_QUOTE_BASE_RANGES: Record<PricingMarket, Record<PageRangeOption, BaseSetupRange>> = {
  INDIA: {
    '1-5 Pages': { min: 75000, max: 110000 },
    '6-10 Pages': { min: 120000, max: 180000 },
    '11-20 Pages': { min: 190000, max: 300000 },
    '20+ Pages': { min: 350000, max: null, hasPlus: true },
  },
  STANDARD_INTERNATIONAL: {
    '1-5 Pages': { min: 2500, max: 4000 },
    '6-10 Pages': { min: 4500, max: 6500 },
    '11-20 Pages': { min: 7000, max: 10500 },
    '20+ Pages': { min: 12000, max: null, hasPlus: true },
  },
  PREMIUM_INTERNATIONAL: {
    '1-5 Pages': { min: 3000, max: 4500 },
    '6-10 Pages': { min: 5500, max: 7500 },
    '11-20 Pages': { min: 8500, max: 12000 },
    '20+ Pages': { min: 14000, max: null, hasPlus: true },
  },
};

/**
 * Design Level Surcharges
 */
export const CUSTOM_QUOTE_DESIGN_SURCHARGES: Record<PricingMarket, Record<DesignLevelOption, number>> = {
  INDIA: {
    Standard: 0,
    Premium: 35000,
    Luxury: 75000,
  },
  STANDARD_INTERNATIONAL: {
    Standard: 0,
    Premium: 1000,
    Luxury: 2500,
  },
  PREMIUM_INTERNATIONAL: {
    Standard: 0,
    Premium: 1500,
    Luxury: 3500,
  },
};

/**
 * Add-on and Feature Pricing across Markets
 */
export const CUSTOM_QUOTE_ADDONS: Record<string, Record<PricingMarket, number>> = {
  // Features
  'WhatsApp Integration': { INDIA: 5000, STANDARD_INTERNATIONAL: 150, PREMIUM_INTERNATIONAL: 200 },
  'Contact Form': { INDIA: 3000, STANDARD_INTERNATIONAL: 100, PREMIUM_INTERNATIONAL: 150 },
  'Blog System': { INDIA: 15000, STANDARD_INTERNATIONAL: 500, PREMIUM_INTERNATIONAL: 700 },
  'Blog / CMS': { INDIA: 15000, STANDARD_INTERNATIONAL: 500, PREMIUM_INTERNATIONAL: 700 },
  'Appointment Booking': { INDIA: 15000, STANDARD_INTERNATIONAL: 600, PREMIUM_INTERNATIONAL: 800 },
  'Booking System': { INDIA: 15000, STANDARD_INTERNATIONAL: 600, PREMIUM_INTERNATIONAL: 800 },
  'AI Chat Assistant': { INDIA: 30000, STANDARD_INTERNATIONAL: 1500, PREMIUM_INTERNATIONAL: 2000 },
  'Lead Generation Forms': { INDIA: 6000, STANDARD_INTERNATIONAL: 200, PREMIUM_INTERNATIONAL: 300 },
  'Payment Gateway': { INDIA: 10000, STANDARD_INTERNATIONAL: 350, PREMIUM_INTERNATIONAL: 500 },
  'E-commerce Store': { INDIA: 60000, STANDARD_INTERNATIONAL: 2500, PREMIUM_INTERNATIONAL: 3500 },
  'E-commerce Functionality': { INDIA: 60000, STANDARD_INTERNATIONAL: 2500, PREMIUM_INTERNATIONAL: 3500 },
  'Admin Dashboard': { INDIA: 25000, STANDARD_INTERNATIONAL: 1000, PREMIUM_INTERNATIONAL: 1500 },
  'CRM Integration': { INDIA: 25000, STANDARD_INTERNATIONAL: 1000, PREMIUM_INTERNATIONAL: 1500 },
  'CRM / Lead Management': { INDIA: 25000, STANDARD_INTERNATIONAL: 1000, PREMIUM_INTERNATIONAL: 1500 },
  'Membership System': { INDIA: 30000, STANDARD_INTERNATIONAL: 1200, PREMIUM_INTERNATIONAL: 1600 },
  'Multi-language Support': { INDIA: 18000, STANDARD_INTERNATIONAL: 750, PREMIUM_INTERNATIONAL: 1000 },
  'Google Maps Integration': { INDIA: 3000, STANDARD_INTERNATIONAL: 100, PREMIUM_INTERNATIONAL: 150 },
  'Advanced SEO': { INDIA: 12000, STANDARD_INTERNATIONAL: 500, PREMIUM_INTERNATIONAL: 700 },
  'SEO Setup': { INDIA: 12000, STANDARD_INTERNATIONAL: 500, PREMIUM_INTERNATIONAL: 700 },
  'Gallery / Testimonials': { INDIA: 8000, STANDARD_INTERNATIONAL: 250, PREMIUM_INTERNATIONAL: 350 },
  'Speed Optimization': { INDIA: 10000, STANDARD_INTERNATIONAL: 400, PREMIUM_INTERNATIONAL: 550 },
  'Custom Animations': { INDIA: 20000, STANDARD_INTERNATIONAL: 800, PREMIUM_INTERNATIONAL: 1200 },
  'Advanced Animations': { INDIA: 20000, STANDARD_INTERNATIONAL: 800, PREMIUM_INTERNATIONAL: 1200 },
  'WebGL Effects': { INDIA: 35000, STANDARD_INTERNATIONAL: 1500, PREMIUM_INTERNATIONAL: 2000 },

  // Marketing Add-ons
  'Google Analytics': { INDIA: 5000, STANDARD_INTERNATIONAL: 200, PREMIUM_INTERNATIONAL: 250 },
  'Facebook Pixel': { INDIA: 5000, STANDARD_INTERNATIONAL: 200, PREMIUM_INTERNATIONAL: 250 },
  'Conversion Tracking': { INDIA: 10000, STANDARD_INTERNATIONAL: 400, PREMIUM_INTERNATIONAL: 500 },
  'Email Marketing Setup': { INDIA: 15000, STANDARD_INTERNATIONAL: 600, PREMIUM_INTERNATIONAL: 800 },

  // Support Durations
  '14 Days': { INDIA: 0, STANDARD_INTERNATIONAL: 0, PREMIUM_INTERNATIONAL: 0 },
  '30 Days': { INDIA: 8000, STANDARD_INTERNATIONAL: 300, PREMIUM_INTERNATIONAL: 450 },
  '60 Days': { INDIA: 15000, STANDARD_INTERNATIONAL: 600, PREMIUM_INTERNATIONAL: 850 },
  '90 Days': { INDIA: 22000, STANDARD_INTERNATIONAL: 900, PREMIUM_INTERNATIONAL: 1200 },
};

/**
 * Get base setup range for market and page range
 */
export function getBaseSetupRange(market: PricingMarket, pages: string): BaseSetupRange {
  const marketRanges = CUSTOM_QUOTE_BASE_RANGES[market] || CUSTOM_QUOTE_BASE_RANGES.PREMIUM_INTERNATIONAL;
  const match = (pages in marketRanges) ? marketRanges[pages as PageRangeOption] : marketRanges['1-5 Pages'];
  return match;
}

/**
 * Get design level surcharge
 */
export const getDesignSurcharge = (market: PricingMarket, design: string): number => {
  const surcharges = CUSTOM_QUOTE_DESIGN_SURCHARGES[market] || CUSTOM_QUOTE_DESIGN_SURCHARGES.PREMIUM_INTERNATIONAL;
  if (design in surcharges) {
    return surcharges[design as DesignLevelOption];
  }
  return 0;
};

/**
 * Get addon price for market
 */
export function getAddonPrice(market: PricingMarket, addonName: string): number {
  const entry = CUSTOM_QUOTE_ADDONS[addonName];
  if (entry && typeof entry[market] === 'number') {
    return entry[market];
  }
  return 0;
}
