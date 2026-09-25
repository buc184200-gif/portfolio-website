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
import { detectCountry } from './geoService';

export interface PricingState {
  country: CountryInfo;
  market: PricingMarket;
  detectedCountryName: string;
  rates: Record<string, number>;
  prices: Record<PackageTier, CalculatedPrice>;
  isLoading: boolean;
}

type StateListener = (state: PricingState) => void;

class PricingManager {
  private state: PricingState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    // Safe initial state: US International default avoids layout flash and prevents accidental India price leak
    const initialCountry = getCountryData('US');
    this.state = {
      country: initialCountry,
      market: 'PREMIUM_INTERNATIONAL',
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

  public computePrices(
    country: CountryInfo,
    market: PricingMarket,
    rates: Record<string, number>
  ): Record<PackageTier, CalculatedPrice> {
    const isIndia = market === 'INDIA' || country.code === 'IN';

    const canonicalStarter = isIndia
      ? INDIA_FIXED_INR_PRICES.STARTER
      : market === 'PREMIUM_INTERNATIONAL'
      ? PREMIUM_INTERNATIONAL_USD_PRICES.STARTER
      : STANDARD_INTERNATIONAL_USD_PRICES.STARTER;

    const canonicalGrowth = isIndia
      ? INDIA_FIXED_INR_PRICES.GROWTH
      : market === 'PREMIUM_INTERNATIONAL'
      ? PREMIUM_INTERNATIONAL_USD_PRICES.GROWTH
      : STANDARD_INTERNATIONAL_USD_PRICES.GROWTH;

    const canonicalElite = isIndia
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
   * Automatically initialize Geo-Pricing System
   */
  public async init(): Promise<void> {
    // 1. Fetch exchange rates in background
    const ratesPromise = getExchangeRates();

    // 2. Automatically detect visitor's country (via Netlify Edge / server endpoint)
    const geo = await detectCountry();
    const country = getCountryData(geo.countryCode);
    const market = getPricingMarket(country.code);

    const rates = await ratesPromise;

    this.state = {
      country,
      market,
      detectedCountryName: country.name,
      rates,
      prices: this.computePrices(country, market, rates),
      isLoading: false,
    };

    this.notify();
  }

  /**
   * Programmatic update for detected country (used by automated tests / Edge triggers)
   * Does NOT store to localStorage.
   */
  public setDetectedCountry(countryCode: string): void {
    const country = getCountryData(countryCode);
    const market = getPricingMarket(country.code);

    this.state = {
      ...this.state,
      country,
      market,
      detectedCountryName: country.name,
      prices: this.computePrices(country, market, this.state.rates),
    };

    this.notify();
  }
}

export const pricingManager = new PricingManager();
