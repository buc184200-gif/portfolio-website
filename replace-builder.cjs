const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// 1. Remove old calculator styles
html = html.replace(/\/\* Calculator Styles \*\/[\s\S]*?\/\* Range slider styling \*\/[\s\S]*?::-webkit-slider-thumb \{[\s\S]*?\}[\s\S]*?::-moz-range-thumb \{[\s\S]*?\}/, '');

// 2. Add new CSS
const newCSS = `
        /* --- Premium Custom Builder --- */
        .premium-builder-section {
            padding: 60px 20px;
        }

        .builder-container {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 4rem;
            align-items: start;
            max-width: 1200px;
            margin: 0 auto;
        }

        .builder-left {
            position: sticky;
            top: 100px;
        }

        .builder-desc {
            color: var(--c-text-dim);
            line-height: 1.6;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .builder-quote-box {
            background: linear-gradient(145deg, rgba(26, 26, 26, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
            border: 1px solid rgba(196, 168, 130, 0.3);
            border-radius: 1.5rem;
            padding: 2.5rem 2rem;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(196, 168, 130, 0.05);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .builder-quote-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(196, 168, 130, 0.1);
        }

        .builder-quote-box h3 {
            font-family: var(--font-mono);
            color: var(--c-accent);
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
        }

        .quote-price {
            font-size: 2.2rem;
            font-family: var(--font-sans);
            color: var(--c-highlight);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .quote-price.updating {
            animation: quotePulse 0.4s ease;
        }

        @keyframes quotePulse {
            0% { transform: scale(1); color: var(--c-highlight); }
            50% { transform: scale(1.05); color: #fff; }
            100% { transform: scale(1); color: var(--c-highlight); }
        }

        .quote-details {
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            margin-bottom: 2rem;
        }

        .quote-row {
            display: flex;
            justify-content: space-between;
            color: var(--c-text-dim);
            font-size: 0.95rem;
        }

        .quote-row span:last-child {
            color: #fff;
            font-family: var(--font-mono);
        }

        .gold-btn {
            background: linear-gradient(135deg, #c4a882, #a38760);
            color: #000;
            font-weight: 600;
            border: none;
            box-shadow: 0 10px 20px rgba(196, 168, 130, 0.2);
            width: 100%;
            transition: all 0.4s ease;
            cursor: pointer;
            text-decoration: none;
        }

        .gold-btn:hover {
            background: linear-gradient(135deg, #d5b993, #b49871);
            box-shadow: 0 15px 30px rgba(196, 168, 130, 0.4);
            transform: translateY(-2px);
            color: #000;
        }

        .builder-group {
            margin-bottom: 3rem;
            background: rgba(26, 26, 26, 0.3);
            border: 1px solid rgba(196, 168, 130, 0.1);
            border-radius: 1.5rem;
            padding: 2.5rem;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        
        .builder-group:hover {
            border-color: rgba(196, 168, 130, 0.2);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .builder-group-title {
            font-family: var(--font-mono);
            color: var(--c-accent);
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .builder-group-title::before {
            content: '';
            display: inline-block;
            width: 8px; height: 8px;
            background: var(--c-accent);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--c-accent);
        }

        .builder-options {
            display: grid;
            gap: 1rem;
        }

        .grid-2 { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
        .grid-3 { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }

        .builder-option {
            display: block;
            cursor: pointer;
        }

        .builder-option input {
            display: none;
        }

        .opt-box {
            display: flex;
            align-items: center;
            padding: 1rem 1.2rem;
            background: rgba(10, 15, 10, 0.6);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            color: var(--c-text-dim);
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
            font-size: 0.95rem;
            user-select: none;
            position: relative;
            overflow: hidden;
            height: 100%;
        }

        .opt-box::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, rgba(196, 168, 130, 0.2) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 0;
        }

        .opt-box > * {
            position: relative;
            z-index: 1;
        }

        .builder-option:hover .opt-box {
            border-color: rgba(196, 168, 130, 0.3);
            color: #fff;
            transform: translateY(-2px);
        }

        .builder-option:hover .opt-box::before {
            opacity: 1;
        }

        .builder-option input:checked + .opt-box {
            background: rgba(196, 168, 130, 0.15);
            border-color: var(--c-accent);
            color: #fff;
            box-shadow: 0 0 15px rgba(196, 168, 130, 0.2), inset 0 0 10px rgba(196, 168, 130, 0.1);
            transform: scale(1.02);
        }

        /* Add checkmark for checked items */
        .builder-option input:checked + .opt-box::after {
            content: '✓';
            position: absolute;
            right: 15px;
            color: var(--c-accent);
            font-weight: bold;
            font-size: 1.1rem;
        }

        @media (max-width: 992px) {
            .builder-container {
                grid-template-columns: 1fr;
            }
            .builder-left {
                position: relative;
                top: 0;
            }
            .builder-group {
                padding: 1.5rem;
            }
        }
`;

if (!html.includes('/* --- Premium Custom Builder --- */')) {
    html = html.replace('</style>', newCSS + '\n    </style>');
}

// 3. Replace HTML Sections
const newHTML = `
            <section id="custom-builder" class="fade-in-section premium-builder-section">
                <div class="builder-container">
                    <!-- Left Side: Sticky Info -->
                    <div class="builder-left">
                        <h2 class="section-heading">Build Your <em>Own Website</em></h2>
                        <p class="builder-desc">Don't fit into a package? Customize every aspect of your website and receive a personalized quote.</p>
                        
                        <div class="builder-quote-box">
                            <h3>Estimated Investment</h3>
                            <div class="quote-price" id="quote-price">₹0 – ₹0+</div>
                            
                            <div class="quote-details">
                                <div class="quote-row"><span>Base Setup:</span> <span id="quote-base">₹0</span></div>
                                <div class="quote-row"><span>Features (<span id="quote-feature-count">0</span>):</span> <span id="quote-features">₹0</span></div>
                                <div class="quote-row"><span>Add-ons (<span id="quote-addon-count">0</span>):</span> <span id="quote-addons">₹0</span></div>
                            </div>

                            <a href="#" id="quote-whatsapp-btn" class="plan-btn gold-btn" target="_blank">Get Custom Quote</a>
                        </div>
                    </div>

                    <!-- Right Side: Scrollable Options -->
                    <div class="builder-right">
                        <!-- 1. Website Type -->
                        <div class="builder-group">
                            <h3 class="builder-group-title">1. Website Type</h3>
                            <div class="builder-options grid-3">
                                <label class="builder-option"><input type="radio" name="website-type" value="Business Website" data-min="9599" data-max="14999"><span class="opt-box">Business Website</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Coaching Institute" data-min="18499" data-max="24999"><span class="opt-box">Coaching Institute</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Gym Website" data-min="18499" data-max="24999"><span class="opt-box">Gym Website</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Clinic Website" data-min="18499" data-max="24999"><span class="opt-box">Clinic Website</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Salon Website" data-min="18499" data-max="24999"><span class="opt-box">Salon Website</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Portfolio Website" data-min="9599" data-max="14999"><span class="opt-box">Portfolio Website</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Restaurant Website" data-min="18499" data-max="24999"><span class="opt-box">Restaurant Website</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="E-commerce Store" data-min="25000" data-max="45000"><span class="opt-box">E-commerce Store</span></label>
                                <label class="builder-option"><input type="radio" name="website-type" value="Custom Solution" data-min="44399" data-max="100000"><span class="opt-box">Custom Solution</span></label>
                            </div>
                        </div>

                        <!-- 2. Number of Pages -->
                        <div class="builder-group">
                            <h3 class="builder-group-title">2. Number of Pages</h3>
                            <div class="builder-options grid-2">
                                <label class="builder-option"><input type="radio" name="pages" value="1-5 Pages" data-price="0" checked><span class="opt-box">1-5 Pages</span></label>
                                <label class="builder-option"><input type="radio" name="pages" value="6-10 Pages" data-price="5000"><span class="opt-box">6-10 Pages</span></label>
                                <label class="builder-option"><input type="radio" name="pages" value="11-20 Pages" data-price="12000"><span class="opt-box">11-20 Pages</span></label>
                                <label class="builder-option"><input type="radio" name="pages" value="20+ Pages" data-price="25000"><span class="opt-box">20+ Pages</span></label>
                            </div>
                        </div>

                        <!-- 3. Design Level -->
                        <div class="builder-group">
                            <h3 class="builder-group-title">3. Design Level</h3>
                            <div class="builder-options grid-3">
                                <label class="builder-option"><input type="radio" name="design-level" value="Standard" data-price="0" checked><span class="opt-box">Standard</span></label>
                                <label class="builder-option"><input type="radio" name="design-level" value="Premium" data-price="8000"><span class="opt-box">Premium</span></label>
                                <label class="builder-option"><input type="radio" name="design-level" value="Luxury" data-price="20000"><span class="opt-box">Luxury</span></label>
                            </div>
                        </div>

                        <!-- 4. Features -->
                        <div class="builder-group">
                            <h3 class="builder-group-title">4. Features</h3>
                            <div class="builder-options grid-2">
                                <label class="builder-option"><input type="checkbox" name="features" value="WhatsApp Integration" data-price="1000"><span class="opt-box">WhatsApp Integration</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Contact Form" data-price="1500"><span class="opt-box">Contact Form</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Blog System" data-price="8000"><span class="opt-box">Blog System</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Appointment Booking" data-price="5000"><span class="opt-box">Appointment Booking</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="AI Chat Assistant" data-price="12000"><span class="opt-box">AI Chat Assistant</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Lead Generation Forms" data-price="3000"><span class="opt-box">Lead Generation Forms</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Payment Gateway" data-price="3000"><span class="opt-box">Payment Gateway</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="E-commerce Store" data-price="15000"><span class="opt-box">E-commerce Store</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Admin Dashboard" data-price="10000"><span class="opt-box">Admin Dashboard</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="CRM Integration" data-price="15000"><span class="opt-box">CRM Integration</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Membership System" data-price="18000"><span class="opt-box">Membership System</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Multi-language Support" data-price="10000"><span class="opt-box">Multi-language Support</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Google Maps Integration" data-price="1500"><span class="opt-box">Google Maps Integration</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Advanced SEO" data-price="8000"><span class="opt-box">Advanced SEO</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Speed Optimization" data-price="4000"><span class="opt-box">Speed Optimization</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="Custom Animations" data-price="6000"><span class="opt-box">Custom Animations</span></label>
                                <label class="builder-option"><input type="checkbox" name="features" value="WebGL Effects" data-price="25000"><span class="opt-box">WebGL Effects</span></label>
                            </div>
                        </div>

                        <!-- 5. Marketing Add-ons -->
                        <div class="builder-group">
                            <h3 class="builder-group-title">5. Marketing Add-ons</h3>
                            <div class="builder-options grid-2">
                                <label class="builder-option"><input type="checkbox" name="addons" value="Google Analytics" data-price="2000"><span class="opt-box">Google Analytics</span></label>
                                <label class="builder-option"><input type="checkbox" name="addons" value="Facebook Pixel" data-price="2000"><span class="opt-box">Facebook Pixel</span></label>
                                <label class="builder-option"><input type="checkbox" name="addons" value="Conversion Tracking" data-price="5000"><span class="opt-box">Conversion Tracking</span></label>
                                <label class="builder-option"><input type="checkbox" name="addons" value="Email Marketing Setup" data-price="8000"><span class="opt-box">Email Marketing Setup</span></label>
                            </div>
                        </div>

                        <!-- 6. Support Duration -->
                        <div class="builder-group">
                            <h3 class="builder-group-title">6. Support Duration</h3>
                            <div class="builder-options grid-2">
                                <label class="builder-option"><input type="radio" name="support" value="14 Days" data-price="0" checked><span class="opt-box">14 Days</span></label>
                                <label class="builder-option"><input type="radio" name="support" value="30 Days" data-price="2999"><span class="opt-box">30 Days</span></label>
                                <label class="builder-option"><input type="radio" name="support" value="60 Days" data-price="5500"><span class="opt-box">60 Days</span></label>
                                <label class="builder-option"><input type="radio" name="support" value="90 Days" data-price="7999"><span class="opt-box">90 Days</span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
`;

html = html.replace(/<section id="calculator"[\s\S]*?<\/section>\s*<section id="addons"[\s\S]*?<\/section>/, newHTML);

// 4. Replace JS Logic
const newJS = `
            // Premium Custom Builder Logic
            const builderOptions = document.querySelectorAll('.builder-option input');
            const quotePriceEl = document.getElementById('quote-price');
            const quoteBaseEl = document.getElementById('quote-base');
            const quoteFeaturesEl = document.getElementById('quote-features');
            const quoteAddonsEl = document.getElementById('quote-addons');
            const quoteFeatureCountEl = document.getElementById('quote-feature-count');
            const quoteAddonCountEl = document.getElementById('quote-addon-count');
            const whatsappBtn = document.getElementById('quote-whatsapp-btn');

            function formatINR(num) {
                return '₹' + num.toLocaleString('en-IN');
            }

            function updateQuote() {
                if(!quotePriceEl) return;
                let minTotal = 0;
                let maxTotal = 0;
                
                let baseMin = 0;
                let baseMax = 0;
                
                let featuresTotal = 0;
                let featureCount = 0;
                
                let addonsTotal = 0;
                let addonCount = 0;

                let selectedType = "None";
                let selectedPages = "";
                let selectedDesign = "";
                let selectedFeatures = [];
                let selectedAddons = [];
                let selectedSupport = "";

                builderOptions.forEach(opt => {
                    if (opt.checked) {
                        const name = opt.name;
                        const val = opt.value;
                        const dMin = parseInt(opt.dataset.min || 0);
                        const dMax = parseInt(opt.dataset.max || 0);
                        const dPrice = parseInt(opt.dataset.price || 0);

                        if (name === 'website-type') {
                            baseMin += dMin;
                            baseMax += dMax;
                            selectedType = val;
                        } else if (name === 'pages') {
                            baseMin += dPrice;
                            baseMax += dPrice;
                            selectedPages = val;
                        } else if (name === 'design-level') {
                            baseMin += dPrice;
                            baseMax += dPrice;
                            selectedDesign = val;
                        } else if (name === 'features') {
                            featuresTotal += dPrice;
                            featureCount++;
                            selectedFeatures.push(val);
                        } else if (name === 'addons') {
                            addonsTotal += dPrice;
                            addonCount++;
                            selectedAddons.push(val);
                        } else if (name === 'support') {
                            addonsTotal += dPrice; // Add support to addons total
                            addonCount++;
                            selectedSupport = val;
                        }
                    }
                });

                // Default base if no type selected
                if (baseMin === 0) {
                    baseMin = 9599;
                    baseMax = 14999;
                }

                minTotal = baseMin + featuresTotal + addonsTotal;
                maxTotal = baseMax + featuresTotal + addonsTotal;

                // Animate price update
                quotePriceEl.classList.remove('updating');
                void quotePriceEl.offsetWidth; // trigger reflow
                quotePriceEl.classList.add('updating');

                quotePriceEl.innerHTML = \`\${formatINR(minTotal)} – \${formatINR(maxTotal)}<span style="font-size:0.5em; opacity:0.6">+</span>\`;
                quoteBaseEl.textContent = \`\${formatINR(baseMin)} - \${formatINR(baseMax)}\`;
                quoteFeaturesEl.textContent = formatINR(featuresTotal);
                quoteAddonsEl.textContent = formatINR(addonsTotal);
                quoteFeatureCountEl.textContent = featureCount;
                quoteAddonCountEl.textContent = addonCount;

                // Build WhatsApp Message
                let msg = "Hello Crestiva! I'd like a custom quote for a project:\\n\\n";
                msg += \`*Website Type:* \${selectedType}\\n\`;
                msg += \`*Pages:* \${selectedPages}\\n\`;
                msg += \`*Design Level:* \${selectedDesign}\\n\\n\`;
                
                if (selectedFeatures.length > 0) {
                    msg += \`*Features:*\\n- \${selectedFeatures.join('\\n- ')}\\n\\n\`;
                }
                if (selectedAddons.length > 0) {
                    msg += \`*Marketing Add-ons:*\\n- \${selectedAddons.join('\\n- ')}\\n\\n\`;
                }
                msg += \`*Support:* \${selectedSupport}\\n\\n\`;
                msg += \`*Estimated Investment:* \${formatINR(minTotal)} – \${formatINR(maxTotal)}\\n\\n\`;
                msg += "Please let me know the next steps.";

                whatsappBtn.href = "https://wa.me/917037311050?text=" + encodeURIComponent(msg);
            }

            builderOptions.forEach(opt => {
                opt.addEventListener('change', updateQuote);
            });

            // Initial update
            updateQuote();
`;

html = html.replace(/\/\/ Calculator Logic[\s\S]*?\/\/ 3D Premium Pricing Cards Logic/, newJS + '\n            // 3D Premium Pricing Cards Logic');


fs.writeFileSync('see-more.html', html);
console.log('Successfully injected Custom Builder');
