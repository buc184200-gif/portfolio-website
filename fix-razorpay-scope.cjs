const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const badLogic = `
                // Pay Advance Button
                if(payBtn) {
                    payBtn.onclick = function(e) {
                        e.preventDefault();
                        
                        // Calculate minimum total price
                        const base = baseMin || 0;
                        const featuresC = featuresCost || 0;
                        const addonsC = addonsCost || 0;
                        const designC = selectedDesign ? parseInt(document.querySelector('input[name="design-level"]:checked').getAttribute('data-price') || 0) : 0;
                        const pagesC = selectedPages ? parseInt(document.querySelector('input[name="pages"]:checked').getAttribute('data-price') || 0) : 0;
                        
                        window.currentProjectTotal = base + featuresC + addonsC + designC + pagesC;
                        
                        if (window.currentProjectTotal <= 0) {
                            alert('Please select website options to calculate an estimate first.');
                            return;
                        }

                        window.currentPayObj = {
                            type: selectedType || "Not selected",
                            pages: selectedPages || "Not selected",
                            design: selectedDesign || "Not selected",
                            features: selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "None",
                            addons: selectedAddons.length > 0 ? selectedAddons.join(", ") : "None",
                            price: quotePrice ? quotePrice.textContent : ""
                        };
                        
                        // Populate summary
                        let summaryHtml = '<p>Website Type: <span>' + window.currentPayObj.type + '</span></p>';
                        summaryHtml += '<p>Pages: <span>' + window.currentPayObj.pages + '</span></p>';
                        summaryHtml += '<p>Support/Design: <span>' + window.currentPayObj.design + '</span></p>';
                        if (selectedFeatures.length > 0) summaryHtml += '<p>Features: <span>' + window.currentPayObj.features + '</span></p>';
                        if (selectedAddons.length > 0) summaryHtml += '<p>Addons: <span>' + window.currentPayObj.addons + '</span></p>';
                        
                        document.getElementById('paymentSummary').innerHTML = summaryHtml;
                        document.getElementById('payTotalAmount').textContent = formatPrice(window.currentProjectTotal);
                        
                        // Reset options to 25%
                        document.querySelector('input[name="pay_option"][value="25"]').checked = true;
                        window.updatePayAmount();
                        
                        // Show modal
                        document.getElementById('paymentOverlay').classList.add('active');
                    };
                }
`;

html = html.replace(badLogic, '');

// Now insert it correctly inside calculateTotal()
const targetInsertPoint = `                        document.getElementById('quoteChoiceOverlay').classList.add('active');
                    };
                }`;

const goodLogic = `                        document.getElementById('quoteChoiceOverlay').classList.add('active');
                    };
                }
                
                // Pay Advance Button
                const pBtn = document.getElementById('quote-pay-btn');
                if(pBtn) {
                    pBtn.onclick = function(e) {
                        e.preventDefault();
                        
                        // Calculate minimum total price
                        const base = baseMin || 0;
                        const featuresC = featuresCost || 0;
                        const addonsC = addonsCost || 0;
                        const designC = selectedDesign ? parseInt(document.querySelector('input[name="design-level"]:checked').getAttribute('data-price') || 0) : 0;
                        const pagesC = selectedPages ? parseInt(document.querySelector('input[name="pages"]:checked').getAttribute('data-price') || 0) : 0;
                        
                        window.currentProjectTotal = base + featuresC + addonsC + designC + pagesC;
                        
                        if (window.currentProjectTotal <= 0) {
                            alert('Please select website options to calculate an estimate first.');
                            return;
                        }

                        window.currentPayObj = {
                            type: selectedType || "Not selected",
                            pages: selectedPages || "Not selected",
                            design: selectedDesign || "Not selected",
                            features: selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "None",
                            addons: selectedAddons.length > 0 ? selectedAddons.join(", ") : "None",
                            price: quotePrice ? quotePrice.textContent : ""
                        };
                        
                        // Populate summary
                        let summaryHtml = '<p>Website Type: <span>' + window.currentPayObj.type + '</span></p>';
                        summaryHtml += '<p>Pages: <span>' + window.currentPayObj.pages + '</span></p>';
                        summaryHtml += '<p>Support/Design: <span>' + window.currentPayObj.design + '</span></p>';
                        if (selectedFeatures.length > 0) summaryHtml += '<p>Features: <span>' + window.currentPayObj.features + '</span></p>';
                        if (selectedAddons.length > 0) summaryHtml += '<p>Addons: <span>' + window.currentPayObj.addons + '</span></p>';
                        
                        document.getElementById('paymentSummary').innerHTML = summaryHtml;
                        document.getElementById('payTotalAmount').textContent = formatPrice(window.currentProjectTotal);
                        
                        // Reset options to 25%
                        document.querySelector('input[name="pay_option"][value="25"]').checked = true;
                        window.updatePayAmount();
                        
                        // Show modal
                        document.getElementById('paymentOverlay').classList.add('active');
                    };
                }`;

html = html.replace(targetInsertPoint, goodLogic);

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Fixed Razorpay scope');
