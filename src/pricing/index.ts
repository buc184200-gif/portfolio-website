import './geo-pricing.css';
import { pricingManager, PricingState } from './pricingManager';
import { PACKAGES, PackageTier } from './pricingConfig';

/**
 * Crestiva Automatic Geo-Pricing UI Controller
 * Completely non-interactive country label with zero manual switching controls.
 */
class GeoPricingUI {
  private container: HTMLElement | null = null;

  public init() {
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) {
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
   * Inject and ensure clean UI structure:
   * - Non-interactive country badge above pricing grid
   * - Card structure and pricing elements
   * - Disclaimers below pricing grid
   */
  private ensureMarkupStructure() {
    if (!this.container) return;

    // 1. Remove any legacy manual switching controls if present
    const oldControls = document.getElementById('geo-pricing-controls');
    if (oldControls) {
      oldControls.remove();
    }

    // 2. Ensure non-interactive country badge exists above .pricing-grid
    let badgeWrap = document.getElementById('geo-pricing-badge-wrap');
    const pricingGrid = this.container.querySelector('.pricing-grid');

    if (!badgeWrap && pricingGrid) {
      badgeWrap = document.createElement('div');
      badgeWrap.id = 'geo-pricing-badge-wrap';
      badgeWrap.className = 'geo-pricing-badge-wrap';
      badgeWrap.innerHTML = `
        <div class="geo-pricing-badge" id="geo-pricing-badge" role="status" aria-live="polite">
          <span class="geo-badge-flag" id="geo-badge-flag">🇺🇸</span>
          <span class="geo-badge-text" id="geo-pricing-label">Pricing for United States</span>
        </div>
        <p class="geo-pricing-privacy-note" id="geo-pricing-privacy-note">Pricing is shown based on your approximate country. We do not use precise GPS location.</p>
      `;
      pricingGrid.parentNode?.insertBefore(badgeWrap, pricingGrid);
    } else if (badgeWrap && !document.getElementById('geo-pricing-privacy-note')) {
      const note = document.createElement('p');
      note.className = 'geo-pricing-privacy-note';
      note.id = 'geo-pricing-privacy-note';
      note.textContent = 'Pricing is shown based on your approximate country. We do not use precise GPS location.';
      badgeWrap.appendChild(note);
    }

    // 3. Ensure each price-card has STARTING AT and base price structure
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

    // 4. Ensure Disclaimers container exists below .pricing-grid
    let disclaimers = document.getElementById('pricing-disclaimers');
    if (!disclaimers && pricingGrid) {
      disclaimers = document.createElement('div');
      disclaimers.id = 'pricing-disclaimers';
      disclaimers.className = 'pricing-disclaimers';
      disclaimers.innerHTML = `
        <p class="pricing-disclaimer-item" id="pricing-region-note">
          * Regional pricing is based on business location and is confirmed during consultation.
        </p>
        <p class="pricing-disclaimer-item" id="pricing-approx-note" style="display: none;">
          * Local currency values are approximate. International project pricing is based in USD.
        </p>
        <p class="pricing-disclaimer-item">
          * Final scope and investment are confirmed after project discovery.
        </p>
      `;
      pricingGrid.parentNode?.insertBefore(disclaimers, pricingGrid.nextSibling);
    } else if (disclaimers && !document.getElementById('pricing-region-note')) {
      const regionNote = document.createElement('p');
      regionNote.className = 'pricing-disclaimer-item';
      regionNote.id = 'pricing-region-note';
      regionNote.textContent = '* Regional pricing is based on business location and is confirmed during consultation.';
      disclaimers.insertBefore(regionNote, disclaimers.firstChild);
    }
  }

  /**
   * Attach consultation CTA button handlers
   */
  private attachEventListeners() {
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

  /**
   * Handle WhatsApp consultation CTA click with active dynamic price and detected country
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

    const msg = `Hi Crestiva,\n\nI'm interested in the ${plan.name} Package.\n\nPackage Price: ${displayPrice}${baseNote}\nBusiness Country: ${state.country.name}\nSupport Duration: ${support}\n\nPlease contact me regarding this project.`;
    window.open(`https://wa.me/917037311050?text=${encodeURIComponent(msg)}`, '_blank');
  }

  /**
   * Render updated state to UI:
   * - Non-interactive country label: "Pricing for <Country>"
   * - Dynamic package prices
   */
  private render(state: PricingState) {
    const { country, prices } = state;

    // 1. Update Non-interactive country badge
    const flagEl = document.getElementById('geo-badge-flag');
    const labelEl = document.getElementById('geo-pricing-label');
    if (flagEl) flagEl.textContent = country.flag || '🌐';
    if (labelEl) labelEl.textContent = `Pricing for ${country.name}`;

    // 2. Update Pricing Cards with 200ms smooth transition
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
        }, 100);
      }
    });

    // 3. Update Approximate Disclaimer visibility
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
