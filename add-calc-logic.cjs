const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

const calcScript = `
    <!-- Premium Custom Builder Logic -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const getEl = id => document.getElementById(id);
            const quotePrice = getEl('quote-price');
            const quoteBase = getEl('quote-base');
            const quoteFeatures = getEl('quote-features');
            const quoteAddons = getEl('quote-addons');
            const quoteFeatureCount = getEl('quote-feature-count');
            const quoteAddonCount = getEl('quote-addon-count');
            const whatsappBtn = getEl('quote-whatsapp-btn');
            
            const inputs = document.querySelectorAll('.builder-option input');
            
            const formatPrice = (price) => {
                return '₹' + price.toLocaleString('en-IN');
            };

            const calculateTotal = () => {
                let baseMin = 0;
                let baseMax = 0;
                let extraCosts = 0;
                let featureCount = 0;
                let addonCount = 0;
                
                let selectedType = "";
                let selectedPages = "";
                let selectedDesign = "";
                let selectedFeatures = [];
                let selectedAddons = [];
                
                // Website Type
                const typeRadio = document.querySelector('input[name="website-type"]:checked');
                if (typeRadio) {
                    baseMin = parseInt(typeRadio.getAttribute('data-min')) || 0;
                    baseMax = parseInt(typeRadio.getAttribute('data-max')) || parseInt(typeRadio.getAttribute('data-min')) || 0;
                    selectedType = typeRadio.value;
                }
                
                // Pages
                const pagesRadio = document.querySelector('input[name="pages"]:checked');
                if (pagesRadio) {
                    extraCosts += parseInt(pagesRadio.getAttribute('data-price')) || 0;
                    selectedPages = pagesRadio.value;
                }
                
                // Design Level
                const designRadio = document.querySelector('input[name="design-level"]:checked');
                if (designRadio) {
                    extraCosts += parseInt(designRadio.getAttribute('data-price')) || 0;
                    selectedDesign = designRadio.value;
                }
                
                // Features
                const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
                let featuresCost = 0;
                featureCheckboxes.forEach(cb => {
                    featuresCost += parseInt(cb.getAttribute('data-price')) || 0;
                    featureCount++;
                    selectedFeatures.push(cb.value);
                });
                extraCosts += featuresCost;
                
                // Addons
                const addonCheckboxes = document.querySelectorAll('input[name="addons"]:checked');
                let addonsCost = 0;
                addonCheckboxes.forEach(cb => {
                    addonsCost += parseInt(cb.getAttribute('data-price')) || 0;
                    addonCount++;
                    selectedAddons.push(cb.value);
                });
                extraCosts += addonsCost;
                
                const totalMin = baseMin + extraCosts;
                const totalMax = baseMax + extraCosts;
                
                // Update DOM
                if(quotePrice) {
                    if (totalMin === 0 && totalMax === 0) {
                        quotePrice.textContent = "Select options";
                    } else if (totalMin === totalMax) {
                        quotePrice.textContent = formatPrice(totalMin);
                    } else {
                        quotePrice.textContent = formatPrice(totalMin) + ' – ' + formatPrice(totalMax) + '+';
                    }
                    
                    // Add pulse effect
                    quotePrice.classList.remove('updating');
                    void quotePrice.offsetWidth; // trigger reflow
                    quotePrice.classList.add('updating');
                }
                
                if(quoteBase) {
                    if (baseMin === baseMax) {
                        quoteBase.textContent = formatPrice(baseMin);
                    } else {
                        quoteBase.textContent = formatPrice(baseMin) + ' – ' + formatPrice(baseMax);
                    }
                }
                
                if(quoteFeatures) quoteFeatures.textContent = formatPrice(featuresCost);
                if(quoteAddons) quoteAddons.textContent = formatPrice(addonsCost);
                if(quoteFeatureCount) quoteFeatureCount.textContent = featureCount;
                if(quoteAddonCount) quoteAddonCount.textContent = addonCount;
                
                // Generate WhatsApp Link
                if(whatsappBtn) {
                    const nl = "%0A";
                    let msg = "Hi Crestiva, I would like a custom quote for my website." + nl + nl;
                    msg += "*Website Type:* " + (selectedType || "Not selected") + nl;
                    msg += "*Pages:* " + (selectedPages || "Not selected") + nl;
                    msg += "*Design Level:* " + (selectedDesign || "Not selected") + nl;
                    
                    if(selectedFeatures.length > 0) {
                        msg += "*Features:* " + selectedFeatures.join(", ") + nl;
                    }
                    if(selectedAddons.length > 0) {
                        msg += "*Addons:* " + selectedAddons.join(", ") + nl;
                    }
                    
                    msg += nl + "*Estimated Price:* " + (quotePrice ? quotePrice.textContent : "");
                    
                    whatsappBtn.href = "https://wa.me/917980838332?text=" + msg;
                }
            };
            
            // Attach event listeners
            inputs.forEach(input => {
                input.addEventListener('change', calculateTotal);
            });
            
            // Initial calculation
            calculateTotal();
            
            // Select first website type by default if none selected
            if (!document.querySelector('input[name="website-type"]:checked')) {
                const firstType = document.querySelector('input[name="website-type"]');
                if (firstType) {
                    firstType.checked = true;
                    calculateTotal();
                }
            }
        });
    </script>
`;

if (html.includes('<!-- Premium Custom Builder Logic -->')) {
    html = html.replace(/<!-- Premium Custom Builder Logic -->[\s\S]*?<\/script>/, calcScript.trim());
} else {
    html = html.replace('</body>', calcScript + '\n</body>');
}

fs.writeFileSync('see-more.html', html);
console.log('Added calc logic!');
