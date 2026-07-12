const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

// 1. Add modal CSS
const modalCss = `
/* --- Quote Choice Modal --- */
.quote-choice-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
}
.quote-choice-overlay.active {
    opacity: 1;
    visibility: visible;
}
.quote-choice-modal {
    background: rgba(15, 15, 15, 0.95);
    border: 1px solid rgba(212, 175, 55, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 440px;
    text-align: center;
    transform: translateY(20px) scale(0.95);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}
.quote-choice-overlay.active .quote-choice-modal {
    transform: translateY(0) scale(1);
}
.quote-choice-close {
    position: absolute;
    top: 20px; right: 20px;
    background: transparent; border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24px; cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
}
.quote-choice-close:hover { color: #fff; }
.quote-choice-modal h3 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: #d4af37;
    margin-bottom: 12px;
    font-weight: 400;
}
.quote-choice-modal p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 32px;
    line-height: 1.6;
}
.quote-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.quote-option-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}
.quote-option-btn.whatsapp {
    background: #25D366;
    color: #fff;
    border: none;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.2);
}
.quote-option-btn.whatsapp:hover {
    background: #20bd5a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
}
.quote-option-btn.email {
    background: transparent;
    color: #d4af37;
    border: 1px solid rgba(212, 175, 55, 0.5);
}
.quote-option-btn.email:hover {
    background: rgba(212, 175, 55, 0.1);
    transform: translateY(-2px);
}
`;

if (!html.includes('quote-choice-overlay')) {
    html = html.replace('</style>', modalCss + '\n</style>');
}

const modalHtml = `
<div class="quote-choice-overlay" id="quoteChoiceOverlay" onclick="closeQuoteChoice(event)">
    <div class="quote-choice-modal" onclick="event.stopPropagation()">
        <button class="quote-choice-close" onclick="closeQuoteChoice(event)">&times;</button>
        <h3>Send Your Inquiry</h3>
        <p>Your custom quote is ready. How would you like to share it with our team?</p>
        <div class="quote-options">
            <a href="#" id="quoteWhatsappLink" class="quote-option-btn whatsapp" target="_blank">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Continue on WhatsApp
            </a>
            <a href="#" id="quoteEmailLink" class="quote-option-btn email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Send Email Inquiry
            </a>
        </div>
    </div>
</div>
`;

if (!html.includes('quote-choice-overlay')) {
    html = html.replace('</body>', modalHtml + '\n</body>');
}


// In the JS:
// Replace button target
html = html.replace('target="_blank"', '');
html = html.replace('href="#" id="quote-whatsapp-btn"', 'href="javascript:void(0)" id="quote-whatsapp-btn"');

// Replace logic in JS
const badJs = `                // Generate WhatsApp Link
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
                }`;

const goodJs = `                // Generate Messages for Modal
                if(whatsappBtn) {
                    let msgObj = {
                        type: selectedType || "Not selected",
                        pages: selectedPages || "Not selected",
                        design: selectedDesign || "Not selected",
                        features: selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "None",
                        addons: selectedAddons.length > 0 ? selectedAddons.join(", ") : "None",
                        price: quotePrice ? quotePrice.textContent : ""
                    };
                    
                    whatsappBtn.onclick = function(e) {
                        e.preventDefault();
                        const nl = "%0A";
                        let waMsg = "Hi Crestiva, I would like a custom quote for my website." + nl + nl;
                        waMsg += "*Website Type:* " + msgObj.type + nl;
                        waMsg += "*Pages:* " + msgObj.pages + nl;
                        waMsg += "*Design Level:* " + msgObj.design + nl;
                        waMsg += "*Features:* " + msgObj.features + nl;
                        waMsg += "*Addons:* " + msgObj.addons + nl;
                        waMsg += nl + "*Estimated Price:* " + msgObj.price;
                        
                        document.getElementById('quoteWhatsappLink').href = "https://wa.me/917037311050?text=" + encodeURIComponent(waMsg.replace(/%0A/g, '\\n'));
                        
                        let emailMsg = "Hi Crestiva, I would like a custom quote for my website.\\n\\n";
                        emailMsg += "Website Type: " + msgObj.type + "\\n";
                        emailMsg += "Pages: " + msgObj.pages + "\\n";
                        emailMsg += "Design Level: " + msgObj.design + "\\n";
                        emailMsg += "Features: " + msgObj.features + "\\n";
                        emailMsg += "Addons: " + msgObj.addons + "\\n";
                        emailMsg += "\\nEstimated Price: " + msgObj.price;
                        
                        document.getElementById('quoteEmailLink').href = "mailto:hello@crestiva.com?subject=" + encodeURIComponent("Website Quote Request") + "&body=" + encodeURIComponent(emailMsg);
                        
                        document.getElementById('quoteChoiceOverlay').classList.add('active');
                    };
                }
            };
            
            window.closeQuoteChoice = function(e) {
                if (e) {
                    e.preventDefault();
                    if (e.target.id === 'quoteChoiceOverlay' || e.target.classList.contains('quote-choice-close')) {
                        document.getElementById('quoteChoiceOverlay').classList.remove('active');
                    }
                } else {
                    document.getElementById('quoteChoiceOverlay').classList.remove('active');
                }
            };`;

if (html.includes('whatsappBtn.href = "https://wa.me/917980838332?text=" + msg;')) {
    html = html.replace(badJs, goodJs);
}

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Fixed button');
