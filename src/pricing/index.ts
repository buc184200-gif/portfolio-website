import './geo-pricing.css';
import { pricingManager, PricingState } from './pricingManager';
import { getAllCountries, CountryInfo } from './countryCurrency';
import { PACKAGES, PackageTier } from './pricingConfig';

/**
 * Crestiva Geo-Pricing UI Controller
 */
class GeoPricingUI {
  private container: HTMLElement | null = null;
  private isDropdownOpen: boolean = false;
  private allCountries: CountryInfo[] = [];

  constructor() {
    this.allCountries = getAllCountries();
  }

  public init() {
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) {
      console.warn('GeoPricingUI: #pricing section not found on page.');
      return;
    }

    this.container = pricingSection;
    this.ensureMarkupStructure();
    this.attachEventListeners();

    // Subscribe to state changes from pricingManager
    pricingManager.subscribe((state) => this.render(state));

    // Initialize geo-pricing detection in background
    pricingManager.init();
  }

  /**
   * Inject and ensure clean UI controls & card structure
   */
  private ensureMarkupStructure() {
    if (!this.container) return;

    // 1. Ensure Segmented Controls container exists above .pricing-grid
    let controls = document.getElementById('geo-pricing-controls');
    const pricingGrid = this.container.querySelector('.pricing-grid');

    if (!controls && pricingGrid) {
      controls = document.createElement('div');
      controls.id = 'geo-pricing-controls';
      controls.className = 'geo-pricing-controls';
      controls.innerHTML = `
        <div class="geo-controls-inner">
          <div class="geo-segmented-toggle" role="tablist" aria-label="Regional Pricing Market">
            <button type="button" class="geo-toggle-btn active" data-market="IN" id="toggle-india" role="tab" aria-selected="true">
              <span class="geo-flag">🇮🇳</span> <span class="geo-btn-text">India</span>
            </button>
            <button type="button" class="geo-toggle-btn" data-market="INTL" id="toggle-intl" role="tab" aria-selected="false">
              <span class="geo-flag">🌐</span> <span class="geo-btn-text">International</span>
            </button>
          </div>

          <div class="geo-country-bar" id="geo-country-bar" style="display: none;">
            <span class="geo-country-label">Pricing for:</span>
            <div class="geo-country-dropdown-wrapper">
              <button type="button" class="geo-country-trigger" id="geo-country-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select Country">
                <span class="geo-current-flag" id="geo-current-flag">🇺🇸</span>
                <span class="geo-current-name" id="geo-current-name">United States</span>
                <span class="geo-dropdown-arrow">▾</span>
              </button>
              
              <div class="geo-country-menu" id="geo-country-menu" role="listbox" tabindex="-1">
                <div class="geo-search-wrap">
                  <input type="text" class="geo-search-input" id="geo-country-search" placeholder="Search country..." aria-label="Search country" autocomplete="off" />
                </div>
                <div class="geo-country-list" id="geo-country-list"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="geo-detected-hint" id="geo-detected-hint"></div>
      `;
      pricingGrid.parentNode?.insertBefore(controls, pricingGrid);
      this.populateCountryList();
    }

    // 2. Ensure each price-card has STARTING AT and base price structure
    const cards = this.container.querySelectorAll<HTMLElement>('.price-card');
    cards.forEach((card) => {
      const planNameEl = card.querySelector('.plan-name');
      const planName = planNameEl?.textContent?.trim().toUpperCase() as PackageTier;

      if (!card.querySelector('.plan-price-wrap')) {
        const oldPriceEl = card.querySelector('.plan-price');
        if (oldPriceEl) {
          const wrap = document.createElement('div');
          wrap.className = 'plan-price-wrap';
          wrap.innerHTML = `
            <span class="plan-price-label">STARTING AT</span>
            <div class="plan-price-amount" id="price-amount-${planName?.toLowerCase() || 'plan'}">...</div>
            <div class="plan-price-base" id="price-base-${planName?.toLowerCase() || 'plan'}" style="display: none;"></div>
          `;
          oldPriceEl.replaceWith(wrap);
        }
      }

      // Add MOST POPULAR badge to Growth card
      if (planName === 'GROWTH' && !card.querySelector('.plan-badge')) {
        const badge = document.createElement('div');
        badge.className = 'plan-badge';
        badge.textContent = 'MOST POPULAR';
        card.insertBefore(badge, card.firstChild);
      }

      // Update package copy
      const copyEl = card.querySelector('.plan-desc');
      if (copyEl && planName && PACKAGES[planName]) {
        copyEl.textContent = PACKAGES[planName].copy;
      }

      // Update Elite card feature: replace "Unlimited Pages" with "Expanded Custom Scope"
      if (planName === 'ELITE') {
        const features = card.querySelectorAll('.plan-features li');
        features.forEach((li) => {
          if (li.textContent?.toLowerCase().includes('unlimited pages')) {
            li.textContent = 'Expanded Custom Scope';
          }
        });
      }
    });

    // 3. Ensure Disclaimers container exists below .pricing-grid
    if (!document.getElementById('pricing-disclaimers') && pricingGrid) {
      const disclaimers = document.createElement('div');
      disclaimers.id = 'pricing-disclaimers';
      disclaimers.className = 'pricing-disclaimers';
      disclaimers.innerHTML = `
        <p class="pricing-disclaimer-item" id="pricing-approx-note" style="display: none;">
          * Local currency values are approximate. International project pricing is based in USD.
        </p>
        <p class="pricing-disclaimer-item">
          * Final scope and investment are confirmed after project discovery.
        </p>
      `;
      pricingGrid.parentNode?.insertBefore(disclaimers, pricingGrid.nextSibling);
    }
  }

  /**
   * Populate searchable country dropdown list
   */
  private populateCountryList(filterQuery: string = '') {
    const listEl = document.getElementById('geo-country-list');
    if (!listEl) return;

    const query = filterQuery.toLowerCase().trim();
    const filtered = this.allCountries.filter(
      (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query) || c.currency.toLowerCase().includes(query)
    );

    listEl.innerHTML = '';
    if (filtered.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'geo-country-item geo-country-empty';
      emptyItem.textContent = 'No matching country';
      listEl.appendChild(emptyItem);
      return;
    }

    filtered.forEach((country) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'geo-country-item';
      item.setAttribute('role', 'option');
      item.setAttribute('data-code', country.code);
      item.innerHTML = `
        <span class="geo-item-flag">${country.flag}</span>
        <span class="geo-item-name">${country.name}</span>
        <span class="geo-item-currency">${country.currency}</span>
      `;
      item.addEventListener('click', () => {
        pricingManager.setCountry(country.code, true);
        this.closeDropdown();
      });
      listEl.appendChild(item);
    });
  }

  /**
   * Attach interaction and keyboard events
   */
  private attachEventListeners() {
    // Segmented toggle buttons
    const btnIndia = document.getElementById('toggle-india');
    const btnIntl = document.getElementById('toggle-intl');

    btnIndia?.addEventListener('click', () => {
      pricingManager.setMarketTab('IN');
      this.closeDropdown();
    });

    btnIntl?.addEventListener('click', () => {
      pricingManager.setMarketTab('INTL');
    });

    // Country dropdown trigger
    const trigger = document.getElementById('geo-country-trigger');
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Search input filtering
    const searchInput = document.getElementById('geo-country-search') as HTMLInputElement | null;
    searchInput?.addEventListener('input', (e) => {
      this.populateCountryList((e.target as HTMLInputElement).value);
    });
    searchInput?.addEventListener('click', (e) => e.stopPropagation());

    // Close on click outside
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('geo-country-menu');
      if (this.isDropdownOpen && menu && !menu.contains(e.target as Node) && e.target !== trigger) {
        this.closeDropdown();
      }
    });

    // Keyboard navigation (Escape to close)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDropdownOpen) {
        this.closeDropdown();
        trigger?.focus();
      }
    });

    // Intercept package WhatsApp clicks to pass dynamic price
    if (this.container) {
      const ctas = this.container.querySelectorAll<HTMLAnchorElement>('.plan-btn');
      ctas.forEach((cta) => {
        cta.addEventListener('click', (e) => {
          e.preventDefault();
          this.handlePackageCtaClick(cta);
        });
      });
    }
  }

  private toggleDropdown() {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown() {
    const menu = document.getElementById('geo-country-menu');
    const trigger = document.getElementById('geo-country-trigger');
    const searchInput = document.getElementById('geo-country-search') as HTMLInputElement | null;

    if (menu && trigger) {
      this.isDropdownOpen = true;
      menu.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
      this.populateCountryList('');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
      }
    }
  }

  private closeDropdown() {
    const menu = document.getElementById('geo-country-menu');
    const trigger = document.getElementById('geo-country-trigger');

    if (menu && trigger) {
      this.isDropdownOpen = false;
      menu.classList.remove('active');
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Handle WhatsApp consultation CTA click with active dynamic price
   */
  private handlePackageCtaClick(buttonEl: HTMLElement) {
    const card = buttonEl.closest('.price-card');
    if (!card) return;

    const planNameEl = card.querySelector('.plan-name');
    const planName = planNameEl?.textContent?.trim().toUpperCase() as PackageTier;
    const plan = PACKAGES[planName];
    if (!plan) return;

    const state = pricingManager.getState();
    const calculated = state.prices[planName];
    const displayPrice = calculated ? calculated.displayAmount : 'Contact for Quote';
    const support = plan.support;

    let baseNote = '';
    if (calculated?.basePriceUsd) {
      baseNote = ` (${calculated.basePriceUsd})`;
    }

    const msg = `Hi Crestiva,\n\nI'm interested in the ${plan.name} Package.\n\nPackage Price: ${displayPrice}${baseNote}\nSupport Duration: ${support}\n\nPlease contact me regarding this project.`;
    window.open(`https://wa.me/917037311050?text=${encodeURIComponent(msg)}`, '_blank');
  }

  /**
   * Render updated state to UI with smooth 250ms crossfade
   */
  private render(state: PricingState) {
    const { country, marketTab, isManual, prices } = state;

    // 1. Update Segmented Toggle
    const btnIndia = document.getElementById('toggle-india');
    const btnIntl = document.getElementById('toggle-intl');
    const countryBar = document.getElementById('geo-country-bar');

    if (marketTab === 'IN') {
      btnIndia?.classList.add('active');
      btnIndia?.setAttribute('aria-selected', 'true');
      btnIntl?.classList.remove('active');
      btnIntl?.setAttribute('aria-selected', 'false');
      if (countryBar) countryBar.style.display = 'none';
    } else {
      btnIntl?.classList.add('active');
      btnIntl?.setAttribute('aria-selected', 'true');
      btnIndia?.classList.remove('active');
      btnIndia?.setAttribute('aria-selected', 'false');
      if (countryBar) countryBar.style.display = 'flex';
    }

    // 2. Update Country Selector Button
    const flagEl = document.getElementById('geo-current-flag');
    const nameEl = document.getElementById('geo-current-name');
    if (flagEl) flagEl.textContent = country.flag;
    if (nameEl) nameEl.textContent = country.name;

    // 3. Update Subtle Region Detected Hint
    const hintEl = document.getElementById('geo-detected-hint');
    if (hintEl) {
      if (isManual) {
        hintEl.innerHTML = `Selected region: <strong>${country.flag} ${country.name}</strong> · <a href="javascript:void(0)" id="reset-geo-auto">Auto-detect</a>`;
        document.getElementById('reset-geo-auto')?.addEventListener('click', () => {
          localStorage.removeItem('crestiva_pricing_country');
          pricingManager.init();
        });
      } else {
        hintEl.innerHTML = `Pricing for <strong>${country.flag} ${country.name}</strong>`;
      }
    }

    // 4. Update Pricing Cards with 250ms smooth transition
    const tiers: PackageTier[] = ['STARTER', 'GROWTH', 'ELITE'];
    let anyConverted = false;

    tiers.forEach((tier) => {
      const priceData = prices[tier];
      if (!priceData) return;

      if (priceData.isConverted) {
        anyConverted = true;
      }

      const amountEl = document.getElementById(`price-amount-${tier.toLowerCase()}`);
      const baseEl = document.getElementById(`price-base-${tier.toLowerCase()}`);

      if (amountEl) {
        // Trigger subtle transition without layout bounce
        amountEl.classList.add('is-changing');

        setTimeout(() => {
          amountEl.textContent = priceData.displayAmount;

          if (baseEl) {
            if (priceData.basePriceUsd) {
              baseEl.textContent = priceData.basePriceUsd;
              baseEl.style.display = 'block';
            } else {
              baseEl.style.display = 'none';
            }
          }

          amountEl.classList.remove('is-changing');
        }, 120);
      }
    });

    // 5. Update Approximate Disclaimer visibility
    const approxNote = document.getElementById('pricing-approx-note');
    if (approxNote) {
      approxNote.style.display = anyConverted ? 'block' : 'none';
    }
  }
}

import { initCustomQuote, CustomQuoteController } from './customQuoteController';
import { calculateCustomQuote } from './customQuoteService';
import { CUSTOM_QUOTE_BASE_RANGES, CUSTOM_QUOTE_DESIGN_SURCHARGES, CUSTOM_QUOTE_ADDONS } from './customQuoteConfig';

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  const initApp = () => {
    new GeoPricingUI().init();
    initCustomQuote();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}

export {
  GeoPricingUI,
  CustomQuoteController,
  initCustomQuote,
  calculateCustomQuote,
  CUSTOM_QUOTE_BASE_RANGES,
  CUSTOM_QUOTE_DESIGN_SURCHARGES,
  CUSTOM_QUOTE_ADDONS,
};
