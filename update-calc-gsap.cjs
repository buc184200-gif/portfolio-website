const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// Find the calculateTotal function and replace it to use GSAP for numbers
const oldCalc = `
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
`;

const newCalc = `
                // Helper to animate numbers
                const animateValue = (el, start, end, duration, formatFn = val => val) => {
                    if(!el) return;
                    // GSAP Number Animation
                    let obj = { val: start };
                    gsap.to(obj, {
                        val: end,
                        duration: duration,
                        ease: "power2.out",
                        onUpdate: () => {
                            el.textContent = formatFn(Math.round(obj.val));
                        }
                    });
                };

                // Update DOM with GSAP
                if(quotePrice) {
                    if (totalMin === 0 && totalMax === 0) {
                        quotePrice.textContent = "Select options";
                    } else {
                        let currentMin = parseInt(quotePrice.getAttribute('data-min')) || 0;
                        let currentMax = parseInt(quotePrice.getAttribute('data-max')) || 0;
                        
                        let obj = { min: currentMin, max: currentMax };
                        gsap.to(obj, {
                            min: totalMin,
                            max: totalMax,
                            duration: 0.8,
                            ease: "power2.out",
                            onUpdate: () => {
                                const m = Math.round(obj.min);
                                const x = Math.round(obj.max);
                                if (m === x) {
                                    quotePrice.textContent = formatPrice(m);
                                } else {
                                    quotePrice.textContent = formatPrice(m) + ' – ' + formatPrice(x) + '+';
                                }
                            },
                            onComplete: () => {
                                quotePrice.setAttribute('data-min', totalMin);
                                quotePrice.setAttribute('data-max', totalMax);
                            }
                        });
                    }
                    
                    // Add pulse effect
                    quotePrice.classList.remove('updating');
                    void quotePrice.offsetWidth; // trigger reflow
                    quotePrice.classList.add('updating');
                }
                
                if(quoteBase) {
                    let currentBaseMin = parseInt(quoteBase.getAttribute('data-min')) || 0;
                    let obj = { min: currentBaseMin, max: currentBaseMin };
                    gsap.to(obj, {
                        min: baseMin,
                        max: baseMax,
                        duration: 0.6,
                        ease: "power2.out",
                        onUpdate: () => {
                            const m = Math.round(obj.min);
                            const x = Math.round(obj.max);
                            if (m === x) {
                                quoteBase.textContent = formatPrice(m);
                            } else {
                                quoteBase.textContent = formatPrice(m) + ' – ' + formatPrice(x);
                            }
                        },
                        onComplete: () => {
                            quoteBase.setAttribute('data-min', baseMin);
                            quoteBase.setAttribute('data-max', baseMax);
                        }
                    });
                }
                
                if(quoteFeatures) {
                    let cur = parseInt(quoteFeatures.getAttribute('data-val')) || 0;
                    animateValue(quoteFeatures, cur, featuresCost, 0.6, formatPrice);
                    quoteFeatures.setAttribute('data-val', featuresCost);
                }
                
                if(quoteAddons) {
                    let cur = parseInt(quoteAddons.getAttribute('data-val')) || 0;
                    animateValue(quoteAddons, cur, addonsCost, 0.6, formatPrice);
                    quoteAddons.setAttribute('data-val', addonsCost);
                }
                
                if(quoteFeatureCount) {
                    let cur = parseInt(quoteFeatureCount.getAttribute('data-val')) || 0;
                    animateValue(quoteFeatureCount, cur, featureCount, 0.4);
                    quoteFeatureCount.setAttribute('data-val', featureCount);
                }
                
                if(quoteAddonCount) {
                    let cur = parseInt(quoteAddonCount.getAttribute('data-val')) || 0;
                    animateValue(quoteAddonCount, cur, addonCount, 0.4);
                    quoteAddonCount.setAttribute('data-val', addonCount);
                }
                
                // Add soft scale to quote box when value changes
                const quoteBox = document.querySelector('.builder-quote-box');
                if (quoteBox) {
                    gsap.fromTo(quoteBox, { scale: 1.02 }, { scale: 1, duration: 0.5, ease: "power2.out" });
                }
`;

html = html.replace(oldCalc, newCalc);

fs.writeFileSync('see-more.html', html);
console.log('Updated Custom Builder Calculator GSAP Animations');
