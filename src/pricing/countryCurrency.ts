import { PREMIUM_INTERNATIONAL_COUNTRIES, PricingMarket } from './pricingConfig';

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  locale: string;
}

/**
 * Curated Database of Countries with Flags, ISO Currencies, and Locales
 */
export const COUNTRIES: Record<string, CountryInfo> = {
  // --- Market 1: India ---
  IN: { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', locale: 'en-IN' },

  // --- Market 2: Premium International (31 Countries) ---
  US: { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', locale: 'en-US' },
  CA: { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', locale: 'en-CA' },
  GB: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', locale: 'en-GB' },
  AU: { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', locale: 'en-AU' },
  NZ: { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', locale: 'en-NZ' },
  AE: { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', locale: 'en-AE' },
  SA: { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', locale: 'en-SA' },
  QA: { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', locale: 'en-QA' },
  KW: { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', locale: 'en-KW' },
  BH: { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', locale: 'en-BH' },
  OM: { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: 'OMR', locale: 'en-OM' },
  SG: { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', locale: 'en-SG' },
  CH: { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', locale: 'de-CH' },
  NO: { code: 'NO', name: 'Norway', flag: '🇳🇴', currency: 'NOK', locale: 'nb-NO' },
  DK: { code: 'DK', name: 'Denmark', flag: '🇩🇰', currency: 'DKK', locale: 'da-DK' },
  SE: { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: 'SEK', locale: 'sv-SE' },
  FI: { code: 'FI', name: 'Finland', flag: '🇫🇮', currency: 'EUR', locale: 'fi-FI' },
  NL: { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', locale: 'nl-NL' },
  DE: { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', locale: 'de-DE' },
  FR: { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', locale: 'fr-FR' },
  IE: { code: 'IE', name: 'Ireland', flag: '🇮🇪', currency: 'EUR', locale: 'en-IE' },
  AT: { code: 'AT', name: 'Austria', flag: '🇦🇹', currency: 'EUR', locale: 'de-AT' },
  BE: { code: 'BE', name: 'Belgium', flag: '🇧🇪', currency: 'EUR', locale: 'nl-BE' },
  LU: { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', currency: 'EUR', locale: 'fr-LU' },
  IS: { code: 'IS', name: 'Iceland', flag: '🇮🇸', currency: 'ISK', locale: 'is-IS' },
  JP: { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', locale: 'ja-JP' },
  KR: { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'KRW', locale: 'ko-KR' },
  HK: { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', locale: 'zh-HK' },
  IL: { code: 'IL', name: 'Israel', flag: '🇮🇱', currency: 'ILS', locale: 'he-IL' },
  MC: { code: 'MC', name: 'Monaco', flag: '🇲🇨', currency: 'EUR', locale: 'fr-MC' },
  LI: { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', currency: 'CHF', locale: 'de-LI' },

  // --- Market 3: Standard International (Global Representation) ---
  BR: { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', locale: 'pt-BR' },
  ZA: { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', locale: 'en-ZA' },
  ID: { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', locale: 'id-ID' },
  MX: { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', locale: 'es-MX' },
  MY: { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'MYR', locale: 'ms-MY' },
  TH: { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB', locale: 'th-TH' },
  PH: { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', locale: 'en-PH' },
  VN: { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND', locale: 'vi-VN' },
  NG: { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', locale: 'en-NG' },
  KE: { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', locale: 'en-KE' },
  EG: { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', locale: 'ar-EG' },
  TR: { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', locale: 'tr-TR' },
  PL: { code: 'PL', name: 'Poland', flag: '🇵🇱', currency: 'PLN', locale: 'pl-PL' },
  CZ: { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK', locale: 'cs-CZ' },
  HU: { code: 'HU', name: 'Hungary', flag: '🇭🇺', currency: 'HUF', locale: 'hu-HU' },
  RO: { code: 'RO', name: 'Romania', flag: '🇷🇴', currency: 'RON', locale: 'ro-RO' },
  BG: { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', currency: 'BGN', locale: 'bg-BG' },
  GR: { code: 'GR', name: 'Greece', flag: '🇬🇷', currency: 'EUR', locale: 'el-GR' },
  PT: { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', locale: 'pt-PT' },
  ES: { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', locale: 'es-ES' },
  IT: { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', locale: 'it-IT' },
  CL: { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP', locale: 'es-CL' },
  CO: { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP', locale: 'es-CO' },
  AR: { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', locale: 'es-AR' },
  PE: { code: 'PE', name: 'Peru', flag: '🇵🇪', currency: 'PEN', locale: 'es-PE' },
  PK: { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR', locale: 'ur-PK' },
  BD: { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: 'BDT', locale: 'bn-BD' },
  LK: { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', currency: 'LKR', locale: 'si-LK' },
  NP: { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', locale: 'ne-NP' },
  GH: { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', locale: 'en-GH' },
  MA: { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: 'MAD', locale: 'fr-MA' },
  TW: { code: 'TW', name: 'Taiwan', flag: '🇹🇼', currency: 'TWD', locale: 'zh-TW' },
  UA: { code: 'UA', name: 'Ukraine', flag: '🇺🇦', currency: 'UAH', locale: 'uk-UA' },
  CR: { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', currency: 'CRC', locale: 'es-CR' },
  PA: { code: 'PA', name: 'Panama', flag: '🇵🇦', currency: 'USD', locale: 'es-PA' },
  UY: { code: 'UY', name: 'Uruguay', flag: '🇺🇾', currency: 'UYU', locale: 'es-UY' },
  EC: { code: 'EC', name: 'Ecuador', flag: '🇪🇨', currency: 'USD', locale: 'es-EC' },
  JO: { code: 'JO', name: 'Jordan', flag: '🇯🇴', currency: 'JOD', locale: 'ar-JO' },
  LB: { code: 'LB', name: 'Lebanon', flag: '🇱🇧', currency: 'USD', locale: 'ar-LB' },
  CY: { code: 'CY', name: 'Cyprus', flag: '🇨🇾', currency: 'EUR', locale: 'el-CY' },
  MT: { code: 'MT', name: 'Malta', flag: '🇲🇹', currency: 'EUR', locale: 'en-MT' },
  EE: { code: 'EE', name: 'Estonia', flag: '🇪🇪', currency: 'EUR', locale: 'et-EE' },
  LV: { code: 'LV', name: 'Latvia', flag: '🇱🇻', currency: 'EUR', locale: 'lv-LV' },
  LT: { code: 'LT', name: 'Lithuania', flag: '🇱🇹', currency: 'EUR', locale: 'lt-LT' },
  SK: { code: 'SK', name: 'Slovakia', flag: '🇸🇰', currency: 'EUR', locale: 'sk-SK' },
  SI: { code: 'SI', name: 'Slovenia', flag: '🇸🇮', currency: 'EUR', locale: 'sl-SI' },
  HR: { code: 'HR', name: 'Croatia', flag: '🇭🇷', currency: 'EUR', locale: 'hr-HR' },
  RS: { code: 'RS', name: 'Serbia', flag: '🇷🇸', currency: 'RSD', locale: 'sr-RS' },
};

/**
 * Determine pricing market for a country code
 */
export function getPricingMarket(countryCode: string): PricingMarket {
  const normalized = countryCode ? countryCode.trim().toUpperCase() : 'US';
  if (normalized === 'IN') {
    return 'INDIA';
  }
  if (PREMIUM_INTERNATIONAL_COUNTRIES.has(normalized)) {
    return 'PREMIUM_INTERNATIONAL';
  }
  return 'STANDARD_INTERNATIONAL';
}

/**
 * Retrieve country information with safe fallback
 */
export function getCountryData(countryCode: string): CountryInfo {
  const normalized = countryCode ? countryCode.trim().toUpperCase() : 'US';
  if (COUNTRIES[normalized]) {
    return COUNTRIES[normalized];
  }
  // Unknown country fallback - standard international with USD
  return {
    code: normalized,
    name: normalized,
    flag: '🌐',
    currency: 'USD',
    locale: 'en-US',
  };
}

/**
 * Get all available countries sorted by name for the selector
 */
export function getAllCountries(): CountryInfo[] {
  return Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name));
}
