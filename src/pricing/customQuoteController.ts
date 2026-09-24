import { pricingManager, PricingState } from './pricingManager';
import { calculateCustomQuote, CustomQuoteInputs } from './customQuoteService';

/**
 * Custom Quote / Estimated Investment UI Controller
 */
export class CustomQuoteController {
  private section: HTMLElement | null = null;
  private currentInputs: CustomQuoteInputs = {
    pages: '1-5 Pages',
    design: 'Standard',
    features: [],
    addons: [],
    support: '14 Days',
  };
  private selectedWebsiteType: string = 'Business Website';

  public init(): void {
    const builderSection = document.getElementById('custom-builder');
    if (!builderSection) {
      return;
    }

    this.section = builderSection;
    this.ensureMarkup();
    this.readInitialInputs();
    this.attachEventListeners();

    // Subscribe to geo-pricing manager
    pricingManager.subscribe((state) => {
      this.render(state);
    });
  }

  /**
   * Ensure necessary summary and disclaimer elements exist in builder DOM
   */
  private ensureMarkup(): void {
    const quoteBox = this.section?.querySelector('.builder-quote-box');
    if (!quoteBox) return;

    // 1. Ensure USD base line element exists below #quote-price
    if (!document.getElementById('quote-price-base')) {
      const quotePriceEl = document.getElementById('quote-price');
      if (quotePriceEl) {
        const baseEl = document.createElement('div');
        baseEl.id = 'quote-price-base';
        baseEl.className = 'quote-price-base';
        baseEl.style.display = 'none';
        quotePriceEl.parentNode?.insertBefore(baseEl, quotePriceEl.nextSibling);
      }
    }

    // 2. Ensure Design Upgrade row exists in .quote-details
    const quoteDetails = quoteBox.querySelector('.quote-details');
    if (quoteDetails && !document.getElementById('quote-design')) {
      const baseRow = quoteDetails.querySelector('.quote-row');
      const designRow = document.createElement('div');
      designRow.id = 'quote-design-row';
      designRow.className = 'quote-row';
      designRow.innerHTML = `<span>Design Upgrade:</span> <span id="quote-design">₹0</span>`;
      if (baseRow && baseRow.nextSibling) {
        quoteDetails.insertBefore(designRow, baseRow.nextSibling);
      } else {
        quoteDetails.appendChild(designRow);
      }
    }

    // 3. Ensure approximate note exists
    if (!document.getElementById('quote-approx-note')) {
      const noteEl = document.createElement('div');
      noteEl.id = 'quote-approx-note';
      noteEl.className = 'quote-approx-note';
      noteEl.style.display = 'none';
      noteEl.textContent = '* Local currency values are approximate. International custom quotes are based in USD.';
      const whatsappBtn = document.getElementById('quote-whatsapp-btn');
      if (whatsappBtn && whatsappBtn.parentNode) {
        whatsappBtn.parentNode.insertBefore(noteEl, whatsappBtn);
      } else {
        quoteBox.appendChild(noteEl);
      }
    }
  }

  /**
   * Read selected inputs from the form
   */
  private readInitialInputs(): void {
    const pageRadio = this.section?.querySelector<HTMLInputElement>('input[name="pages"]:checked');
    if (pageRadio) this.currentInputs.pages = pageRadio.value;

    const designRadio = this.section?.querySelector<HTMLInputElement>('input[name="design-level"]:checked');
    if (designRadio) this.currentInputs.design = designRadio.value;

    const supportRadio = this.section?.querySelector<HTMLInputElement>('input[name="support"]:checked');
    if (supportRadio) this.currentInputs.support = supportRadio.value;

    const typeRadio = this.section?.querySelector<HTMLInputElement>('input[name="website-type"]:checked');
    if (typeRadio) this.selectedWebsiteType = typeRadio.value;

    this.updateCheckboxes();
  }

  private updateCheckboxes(): void {
    if (!this.section) return;

    const featureCbs = this.section.querySelectorAll<HTMLInputElement>('input[name="features"]:checked');
    this.currentInputs.features = Array.from(featureCbs).map((cb) => cb.value);

    const addonCbs = this.section.querySelectorAll<HTMLInputElement>('input[name="addons"]:checked');
    this.currentInputs.addons = Array.from(addonCbs).map((cb) => cb.value);
  }

  /**
   * Attach change listeners to builder inputs and WhatsApp button
   */
  private attachEventListeners(): void {
    if (!this.section) return;

    const inputs = this.section.querySelectorAll<HTMLInputElement>('.builder-option input');
    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.name === 'pages') this.currentInputs.pages = input.value;
        if (input.name === 'design-level') this.currentInputs.design = input.value;
        if (input.name === 'support') this.currentInputs.support = input.value;
        if (input.name === 'website-type') this.selectedWebsiteType = input.value;

        this.updateCheckboxes();
        this.render(pricingManager.getState());
      });
    });

    const whatsappBtn = document.getElementById('quote-whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openQuoteModal();
      });
    }
  }

  /**
   * Render updated calculation to the UI
   */
  public render(state: PricingState): void {
    if (!this.section) return;

    const result = calculateCustomQuote(
      this.currentInputs,
      state.country,
      state.market,
      state.rates
    );

    // 1. Update Estimated Investment
    const quotePriceEl = document.getElementById('quote-price');
    if (quotePriceEl) {
      quotePriceEl.textContent = result.displayTotal;
      // Pulse animation
      quotePriceEl.classList.remove('updating');
      void quotePriceEl.offsetWidth;
      quotePriceEl.classList.add('updating');
    }

    // 2. Update Base Price USD line
    const quoteBasePriceEl = document.getElementById('quote-price-base');
    if (quoteBasePriceEl) {
      if (result.basePriceUsd) {
        quoteBasePriceEl.textContent = result.basePriceUsd;
        quoteBasePriceEl.style.display = 'block';
      } else {
        quoteBasePriceEl.style.display = 'none';
      }
    }

    // 3. Update Base Setup
    const quoteBaseEl = document.getElementById('quote-base');
    if (quoteBaseEl) {
      quoteBaseEl.textContent = result.baseSetupDisplay;
    }

    // 4. Update Design Upgrade
    const quoteDesignEl = document.getElementById('quote-design');
    if (quoteDesignEl) {
      quoteDesignEl.textContent = result.designDisplay;
    }

    // 5. Update Features
    const quoteFeaturesEl = document.getElementById('quote-features');
    if (quoteFeaturesEl) {
      quoteFeaturesEl.textContent = result.featuresDisplay;
    }
    const quoteFeatureCountEl = document.getElementById('quote-feature-count');
    if (quoteFeatureCountEl) {
      quoteFeatureCountEl.textContent = String(result.featureCount);
    }

    // 6. Update Add-ons
    const quoteAddonsEl = document.getElementById('quote-addons');
    if (quoteAddonsEl) {
      quoteAddonsEl.textContent = result.addonsDisplay;
    }
    const quoteAddonCountEl = document.getElementById('quote-addon-count');
    if (quoteAddonCountEl) {
      quoteAddonCountEl.textContent = String(result.addonCount);
    }

    // 7. Update Approximate note
    const quoteApproxNoteEl = document.getElementById('quote-approx-note');
    if (quoteApproxNoteEl) {
      quoteApproxNoteEl.style.display = result.isConverted ? 'block' : 'none';
    }

    // 8. Soft scale animation on quote box if GSAP is available
    const quoteBox = this.section.querySelector('.builder-quote-box');
    const gsap = (window as any).gsap;
    if (quoteBox && gsap) {
      gsap.fromTo(quoteBox, { scale: 1.015 }, { scale: 1, duration: 0.4, ease: 'power2.out' });
    }
  }

  /**
   * Open Custom Quote WhatsApp & Email inquiry choice modal
   */
  private openQuoteModal(): void {
    const state = pricingManager.getState();
    const result = calculateCustomQuote(
      this.currentInputs,
      state.country,
      state.market,
      state.rates
    );

    const priceText = result.basePriceUsd
      ? `${result.displayTotal} (${result.basePriceUsd})`
      : result.displayTotal;

    const featuresText = this.currentInputs.features.length > 0
      ? this.currentInputs.features.join(', ')
      : 'None';

    const addonsText = this.currentInputs.addons.length > 0
      ? this.currentInputs.addons.join(', ')
      : 'None';

    const waMsg =
      `Hi Crestiva Web Studio, I would like a custom quote for my project.\n\n` +
      `*Website Type:* ${this.selectedWebsiteType}\n` +
      `*Scope:* ${this.currentInputs.pages}\n` +
      `*Design Level:* ${this.currentInputs.design}\n` +
      `*Features:* ${featuresText}\n` +
      `*Add-ons:* ${addonsText}\n` +
      `*Support Duration:* ${this.currentInputs.support}\n\n` +
      `*Estimated Investment:* ${priceText}\n\n` +
      `Please contact me to discuss wireframes and next steps.`;

    const emailMsg =
      `Hi Crestiva Web Studio,\n\nI would like a custom quote for my website project.\n\n` +
      `Website Type: ${this.selectedWebsiteType}\n` +
      `Scope: ${this.currentInputs.pages}\n` +
      `Design Level: ${this.currentInputs.design}\n` +
      `Features: ${featuresText}\n` +
      `Add-ons: ${addonsText}\n` +
      `Support Duration: ${this.currentInputs.support}\n\n` +
      `Estimated Investment: ${priceText}\n\n` +
      `Please contact me regarding this project.`;

    const waLink = document.getElementById('quoteWhatsappLink') as HTMLAnchorElement | null;
    if (waLink) {
      waLink.href = `https://wa.me/917037311050?text=${encodeURIComponent(waMsg)}`;
    }

    const emailLink = document.getElementById('quoteEmailLink') as HTMLAnchorElement | null;
    if (emailLink) {
      emailLink.href = `mailto:hello@crestiva.com?subject=${encodeURIComponent(
        'Custom Website Quote Request'
      )}&body=${encodeURIComponent(emailMsg)}`;
    }

    const overlay = document.getElementById('quoteChoiceOverlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  }
}

// Global window close helper for overlay inline onclicks
if (typeof window !== 'undefined') {
  (window as any).closeQuoteChoice = (e?: Event) => {
    if (e) {
      const target = e.target as HTMLElement;
      if (target.id === 'quoteChoiceOverlay' || target.classList.contains('quote-choice-close')) {
        document.getElementById('quoteChoiceOverlay')?.classList.remove('active');
      }
    } else {
      document.getElementById('quoteChoiceOverlay')?.classList.remove('active');
    }
  };
}

/**
 * Global instance initialization helper
 */
let customQuoteControllerInstance: CustomQuoteController | null = null;

export function initCustomQuote(): CustomQuoteController {
  if (!customQuoteControllerInstance) {
    customQuoteControllerInstance = new CustomQuoteController();
    customQuoteControllerInstance.init();
  }
  return customQuoteControllerInstance;
}
