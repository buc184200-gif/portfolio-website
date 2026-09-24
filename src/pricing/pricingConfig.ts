export type PricingMarket = 'INDIA' | 'PREMIUM_INTERNATIONAL' | 'STANDARD_INTERNATIONAL';

export type PackageTier = 'STARTER' | 'GROWTH' | 'ELITE';

export interface PackagePricingPlan {
  tier: PackageTier;
  name: string;
  badge?: string;
  copy: string;
  hasPlus?: boolean;
  features: string[];
  support: string;
  buttonText: string;
}

export interface MarketPackageRates {
  STARTER: number;
  GROWTH: number;
  ELITE: number;
}

/**
 * FIXED INR Prices for India (Market 1)
 * These are fixed commercial INR prices - NOT converted from USD.
 */
export const INDIA_FIXED_INR_PRICES: MarketPackageRates = {
  STARTER: 75000,
  GROWTH: 150000,
  ELITE: 250000,
};

/**
 * Canonical USD Prices for Premium International (Market 2)
 */
export const PREMIUM_INTERNATIONAL_USD_PRICES: MarketPackageRates = {
  STARTER: 3000,
  GROWTH: 7000,
  ELITE: 12500,
};

/**
 * Canonical USD Prices for Standard International (Market 3)
 */
export const STANDARD_INTERNATIONAL_USD_PRICES: MarketPackageRates = {
  STARTER: 2500,
  GROWTH: 6000,
  ELITE: 10000,
};

/**
 * 31 Recognized Premium International Countries (Market 2)
 * Central configuration - single source of truth.
 */
export const PREMIUM_INTERNATIONAL_COUNTRIES = new Set<string>([
  'US', // United States
  'CA', // Canada
  'GB', // United Kingdom
  'AU', // Australia
  'NZ', // New Zealand
  'AE', // United Arab Emirates
  'SA', // Saudi Arabia
  'QA', // Qatar
  'KW', // Kuwait
  'BH', // Bahrain
  'OM', // Oman
  'SG', // Singapore
  'CH', // Switzerland
  'NO', // Norway
  'DK', // Denmark
  'SE', // Sweden
  'FI', // Finland
  'NL', // Netherlands
  'DE', // Germany
  'FR', // France
  'IE', // Ireland
  'AT', // Austria
  'BE', // Belgium
  'LU', // Luxembourg
  'IS', // Iceland
  'JP', // Japan
  'KR', // South Korea
  'HK', // Hong Kong
  'IL', // Israel
  'MC', // Monaco
  'LI', // Liechtenstein
]);

/**
 * Standard Package Definitions and Copy
 */
export const PACKAGES: Record<PackageTier, PackagePricingPlan> = {
  STARTER: {
    tier: 'STARTER',
    name: 'Starter',
    copy: 'Premium digital foundation for businesses ready to move beyond generic websites.',
    features: [
      'Up to 5 Pages',
      'Premium Responsive Design',
      'Contact Form & WhatsApp',
      'Basic SEO Setup',
      'Fast Loading Website',
      'Google Maps Integration',
      'Basic Animations',
      '14 Days Support',
    ],
    support: '14 Days',
    buttonText: 'Select Starter',
  },
  GROWTH: {
    tier: 'GROWTH',
    name: 'Growth',
    badge: 'MOST POPULAR',
    copy: 'Conversion-focused website system for established businesses ready to generate more qualified opportunities.',
    features: [
      'Up to 12 Pages',
      'Custom UI/UX Design',
      'Advanced Animations',
      'Lead Generation Forms',
      'Gallery & Testimonials',
      'Advanced SEO Setup',
      'Speed Optimization',
      'Blog Integration',
      '30 Days Support',
    ],
    support: '30 Days',
    buttonText: 'Select Growth',
  },
  ELITE: {
    tier: 'ELITE',
    name: 'Elite',
    hasPlus: true,
    copy: 'High-end custom digital experience for businesses where differentiation, performance and advanced functionality matter.',
    features: [
      'Fully Custom Website',
      'Expanded Custom Scope', // Replaced "Unlimited Pages"
      'Premium WebGL Animations',
      'Admin Dashboard',
      'CRM/Lead Management',
      'Blog & Content System',
      'Conversion-Focused Design',
      'Advanced SEO',
      '90 Days Priority Support',
    ],
    support: '90 Days',
    buttonText: 'Select Elite',
  },
};
