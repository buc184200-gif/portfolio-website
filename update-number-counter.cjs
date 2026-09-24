const fs = require('fs');
let js = fs.readFileSync('src/awwwards.js', 'utf8');

const oldCounter = `
                    // Number counter animation on prices
                    priceCards.forEach(card => {
                        const priceEl = card.querySelector('.plan-price');
                        if (priceEl) {
                            // Simple text reveal logic for prices
                            const text = priceEl.innerHTML;
                            gsap.fromTo(priceEl, 
                                { opacity: 0, scale: 0.9 }, 
                                { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: "power2.out" }
                            );
                        }
                    });
`;

const newCounter = `
                    // Number counter animation on prices
                    priceCards.forEach((card, index) => {
                        const priceEl = card.querySelector('.plan-price');
                        if (priceEl && !priceEl.dataset.counted) {
                            priceEl.dataset.counted = "true";
                            
                            // Extract numeric values from HTML like "<span class='plan-price-old'>₹24,999</span> ₹18,499+"
                            // We need a robust way. Let's assume the main price is the last number in the string.
                            const textNodes = Array.from(priceEl.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                            const textNode = textNodes[textNodes.length - 1];
                            if (textNode) {
                                const originalText = textNode.textContent;
                                const match = originalText.match(/₹([0-9,]+)(\+?)/);
                                if (match) {
                                    const targetValue = parseInt(match[1].replace(/,/g, ''));
                                    const suffix = match[2] || '';
                                    
                                    let obj = { val: 0 };
                                    gsap.to(obj, {
                                        val: targetValue,
                                        duration: 1.5,
                                        delay: 0.5 + (index * 0.15),
                                        ease: "power2.out",
                                        onUpdate: () => {
                                            textNode.textContent = ' ₹' + Math.round(obj.val).toLocaleString('en-IN') + suffix;
                                        }
                                    });
                                }
                            }
                        }
                    });
`;

js = js.replace(oldCounter, newCounter);
fs.writeFileSync('src/awwwards.js', js);
console.log('Updated price counter');
