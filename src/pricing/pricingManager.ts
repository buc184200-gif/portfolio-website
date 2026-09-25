import {
  INDIA_FIXED_INR_PRICES,
  PREMIUM_INTERNATIONAL_USD_PRICES,
  STANDARD_INTERNATIONAL_USD_PRICES,
  PricingMarket,
  PackageTier,
} from './pricingConfig';
import {
  CountryInfo,
  getCountryData,
  getPricingMarket,
} from './countryCurrency';
import {
  getExchangeRates,
  calculatePackagePrice,
  CalculatedPrice,
} from './currencyService';
import {
  detectCountry,
  saveManualCountry,
  getSavedCountryPreference,
} from './geoService';

export interface PricingState {
  country: CountryInfo;
  market: PricingMarket;
  marketTab: 'IN' | 'INTL';
  isManual: boolean;
  detectedCountryName: string;
  rates: Record<string, number>;
  prices: Record<PackageTier, CalculatedPrice>;
  isLoading: boolean;
}

type StateListener = (state: PricingState) => void;

class PricingManager {
  private state: PricingState;
  private listeners: Set<StateListener> = new Set();
  private lastInternationalCountry: string = 'US';

  constructor() {
    // Safe initial state: US International default avoids layout flash
    const initialCountry = getCountryData('US');
    this.state = {
      country: initialCountry,
      market: 'PREMIUM_INTERNATIONAL',
      marketTab: 'INTL',
      isManual: false,
      detectedCountryName: 'United States',
      rates: {},
      prices: this.computePrices(initialCountry, 'PREMIUM_INTERNATIONAL', {}),
      isLoading: true,
    };
  }

  public getState(): PricingState {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private computePrices(
    country: CountryInfo,
    market: PricingMarket,
    rates: Record<string, number>
  ): Record<PackageTier, CalculatedPrice> {
    const isIndia = market === 'INDIA' || country.code === 'IN';

    let canonicalStarter = isIndia
      ? INDIA_FIXED_INR_PRICES.STARTER
      : market === 'PREMIUM_INTERNATIONAL'
      ? PREMIUM_INTERNATIONAL_USD_PRICES.STARTER
      : STANDARD_INTERNATIONAL_USD_PRICES.STARTER;

    let canonicalGrowth = isIndia
      ? INDIA_FIXED_INR_PRICES.GROWTH
      : market === 'PREMIUM_INTERNATIONAL'
      ? PREMIUM_INTERNATIONAL_USD_PRICES.GROWTH
      : STANDARD_INTERNATIONAL_USD_PRICES.GROWTH;

    let canonicalElite = isIndia
      ? INDIA_FIXED_INR_PRICES.ELITE
      : market === 'PREMIUM_INTERNATIONAL'
      ? PREMIUM_INTERNATIONAL_USD_PRICES.ELITE
      : STANDARD_INTERNATIONAL_USD_PRICES.ELITE;

    return {
      STARTER: calculatePackagePrice(
        canonicalStarter,
        country.currency,
        country.locale,
        isIndia,
        false,
        rates
      ),
      GROWTH: calculatePackagePrice(
        canonicalGrowth,
        country.currency,
        country.locale,
        isIndia,
        false,
        rates
      ),
      ELITE: calculatePackagePrice(
        canonicalElite,
        country.currency,
        country.locale,
        isIndia,
        true, // hasPlus
        rates
      ),
    };
  }

  /**
   * Initialize Geo-Pricing System
   */
  public async init(): Promise<void> {
    // 1. Fetch rates in background
    const ratesPromise = getExchangeRates();

    // 2. Detect location according to strict precedence
    const geo = await detectCountry();
    const country = getCountryData(geo.countryCode);
    const market = getPricingMarket(country.code);
    const marketTab: 'IN' | 'INTL' = country.code === 'IN' ? 'IN' : 'INTL';
    const isManual = geo.source === 'manual';

    if (country.code !== 'IN') {
      this.lastInternationalCountry = country.code;
    }

    const rates = await ratesPromise;

    this.state = {
      country,
      market,
      marketTab,
      isManual,
      detectedCountryName: country.name,
      rates,
      prices: this.computePrices(country, market, rates),
      isLoading: false,
    };

    this.notify();
  }

  /**
   * Set Country manually from selector or programmatically
   */
  public setCountry(countryCode: string, isManual: boolean = true): void {
    const country = getCountryData(countryCode);
    const market = getPricingMarket(country.code);
    const marketTab: 'IN' | 'INTL' = country.code === 'IN' ? 'IN' : 'INTL';

    if (isManual) {
      saveManualCountry(country.code);
    }

    if (country.code !== 'IN') {
      this.lastInternationalCountry = country.code;
    }

    this.state = {
      ...this.state,
      country,
      market,
      marketTab,
      isManual,
      prices: this.computePrices(country, market, this.state.rates),
    };

    this.notify();
  }

  /**
   * Toggle between India and International tab
   */
  public setMarketTab(tab: 'IN' | 'INTL'): void {
    if (tab === 'IN') {
      this.setCountry('IN', true);
    } else {
      // Restore last selected international country or default to US
      const targetCountry = this.lastInternationalCountry === 'IN' ? 'US' : this.lastInternationalCountry;
      this.setCountry(targetCountry, true);
    }
  }
}

export const pricingManager = new PricingManager();
