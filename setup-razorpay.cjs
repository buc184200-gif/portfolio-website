const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

// 1. Add Razorpay SDK
if (!html.includes('checkout.razorpay.com/v1/checkout.js')) {
    html = html.replace('</head>', '    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n</head>');
}

// 2. Add Pay Advance Button
if (!html.includes('id="quote-pay-btn"')) {
    html = html.replace(
        '<a href="javascript:void(0)" id="quote-whatsapp-btn" class="plan-btn gold-btn" target="_blank">Get Custom Quote</a>',
        '<a href="javascript:void(0)" id="quote-whatsapp-btn" class="plan-btn gold-btn" target="_blank" style="margin-bottom: 15px;">Get Custom Quote</a>\n                            <a href="javascript:void(0)" id="quote-pay-btn" class="plan-btn outline-btn" style="width: 100%; border-color: rgba(212, 175, 55, 0.5); color: #d4af37;">Pay Advance</a>'
    );
}

// 3. Add Modal CSS
const modalCss = `
/* --- Payment Modals --- */
.payment-overlay, .payment-success-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8);
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
.payment-overlay.active, .payment-success-overlay.active {
    opacity: 1;
    visibility: visible;
}
.payment-modal, .payment-success-modal {
    background: rgba(15, 15, 15, 0.95);
    border: 1px solid rgba(212, 175, 55, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 30px;
    width: 100%;
    max-width: 440px;
    transform: translateY(20px) scale(0.95);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
}
.payment-overlay.active .payment-modal, .payment-success-overlay.active .payment-success-modal {
    transform: translateY(0) scale(1);
}
.payment-close {
    position: absolute;
    top: 20px; right: 20px;
    background: transparent; border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24px; cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
}
.payment-close:hover { color: #fff; }
.payment-modal h3, .payment-success-modal h3 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: #d4af37;
    margin-bottom: 20px;
    font-weight: 400;
    text-align: center;
}
.payment-summary {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
}
.payment-summary p { margin: 5px 0; }
.payment-summary span { color: #c4a882; font-weight: 500; }
.payment-options {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.payment-options p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 5px;
}
.payment-options label {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.05);
    padding: 12px 15px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
}
.payment-options label:hover {
    background: rgba(255, 255, 255, 0.08);
}
.payment-options input:checked + label, .payment-options label:has(input:checked) {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.1);
}
.payment-options input[type="radio"] {
    accent-color: #d4af37;
}
.payment-total {
    text-align: right;
    margin-bottom: 20px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}
.success-check {
    width: 60px; height: 60px;
    background: #25D366;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; color: #fff;
    margin: 0 auto 20px;
}
.payment-success-modal p {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 10px;
    font-size: 15px;
}
.payment-error {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.2);
    padding: 10px;
    border-radius: 6px;
    font-size: 13px;
    margin-bottom: 15px;
    display: none;
    text-align: center;
}
`;

if (!html.includes('.payment-overlay')) {
    html = html.replace('</style>', modalCss + '\n</style>');
}

// 4. Add Modal HTML
const modalHtml = `
<!-- Payment Modal -->
<div class="payment-overlay" id="paymentOverlay" onclick="closePaymentModal(event)">
    <div class="payment-modal" onclick="event.stopPropagation()">
        <button class="payment-close" onclick="closePaymentModal(event)">&times;</button>
        <h3>Order Summary</h3>
        <div id="paymentErrorMsg" class="payment-error"></div>
        <div class="payment-summary" id="paymentSummary">
            <!-- Dynamic -->
        </div>
        <div class="payment-options">
            <p>Select Payment Option:</p>
            <label><input type="radio" name="pay_option" value="25" onchange="updatePayAmount()" checked> 25% Advance</label>
            <label><input type="radio" name="pay_option" value="50" onchange="updatePayAmount()"> 50% Advance</label>
            <label><input type="radio" name="pay_option" value="100" onchange="updatePayAmount()"> Full Payment (100%)</label>
        </div>
        <div class="payment-total">
            Project Total: <span id="payTotalAmount">₹0</span><br>
            Amount Due: <span id="payDueAmount" style="color:#d4af37; font-size:20px; font-weight:600;">₹0</span>
        </div>
        <button id="razorpayBtn" class="plan-btn gold-btn" style="width:100%; border:none; margin:0;" onclick="initiateRazorpay()">Proceed to Pay</button>
    </div>
</div>

<!-- Payment Success Modal -->
<div class="payment-success-overlay" id="paymentSuccessOverlay">
    <div class="payment-success-modal">
        <div class="success-check">✓</div>
        <h3>Payment Successful</h3>
        <p>Order ID: <span id="successOrderId" style="color:#d4af37;"></span></p>
        <p>Your payment has been received. Our team will contact you shortly to begin the project.</p>
        <button class="plan-btn outline-btn" style="width:100%; margin-top:20px; border-color:rgba(212,175,55,0.5); color:#d4af37;" onclick="document.getElementById('paymentSuccessOverlay').classList.remove('active')">Close</button>
    </div>
</div>
`;

if (!html.includes('id="paymentOverlay"')) {
    html = html.replace('</body>', modalHtml + '\n</body>');
}

// 5. Add JS Logic
const jsLogic = `
            const payBtn = getEl('quote-pay-btn');
            
            // Global variables for payment
            window.currentProjectTotal = 0;
            window.currentPayObj = null;

            window.updatePayAmount = function() {
                const radios = document.getElementsByName('pay_option');
                let selectedPercent = 25;
                for(let i=0; i<radios.length; i++){
                    if(radios[i].checked){
                        selectedPercent = parseInt(radios[i].value);
                        break;
                    }
                }
                const due = Math.round(window.currentProjectTotal * (selectedPercent / 100));
                document.getElementById('payDueAmount').textContent = formatPrice(due);
                return due;
            };

            window.closePaymentModal = function(e) {
                if (e) {
                    e.preventDefault();
                    if (e.target.id === 'paymentOverlay' || e.target.classList.contains('payment-close')) {
                        document.getElementById('paymentOverlay').classList.remove('active');
                        document.getElementById('paymentErrorMsg').style.display = 'none';
                    }
                } else {
                    document.getElementById('paymentOverlay').classList.remove('active');
                    document.getElementById('paymentErrorMsg').style.display = 'none';
                }
            };
            
            window.initiateRazorpay = function() {
                const dueAmount = window.updatePayAmount();
                const btn = document.getElementById('razorpayBtn');
                btn.textContent = 'Processing...';
                btn.style.opacity = '0.7';
                btn.disabled = true;
                document.getElementById('paymentErrorMsg').style.display = 'none';

                // Razorpay Test Key ID
                // Replace this with your Live Key ID when ready
                const razorpayKeyId = 'rzp_test_DUMMY_KEY_123'; 

                const options = {
                    "key": razorpayKeyId,
                    "amount": dueAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    "currency": "INR",
                    "name": "Crestiva Web Studio",
                    "description": "Website Project Advance Payment",
                    "image": "https://dummyimage.com/150x150/0f0f0f/d4af37&text=Crestiva",
                    // "order_id": "order_9A33XWu170gUtm", // This is a sample Order ID. Pass the \`id\` obtained in the response of Step 1
                    "handler": function (response){
                        // Payment Success
                        btn.textContent = 'Proceed to Pay';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                        
                        document.getElementById('paymentOverlay').classList.remove('active');
                        
                        // Show Success Modal
                        document.getElementById('successOrderId').textContent = response.razorpay_payment_id;
                        document.getElementById('paymentSuccessOverlay').classList.add('active');
                        
                        // Save order locally
                        const orders = JSON.parse(localStorage.getItem('crestiva_orders') || '[]');
                        orders.push({
                            id: response.razorpay_payment_id,
                            amount: dueAmount,
                            date: new Date().toISOString(),
                            details: window.currentPayObj
                        });
                        localStorage.setItem('crestiva_orders', JSON.stringify(orders));
                    },
                    "prefill": {
                        "name": localStorage.getItem('crestiva_auth_name') || "",
                        "email": localStorage.getItem('crestiva_auth_email') || "",
                        "contact": ""
                    },
                    "notes": {
                        "project_type": window.currentPayObj ? window.currentPayObj.type : 'Custom'
                    },
                    "theme": {
                        "color": "#d4af37"
                    }
                };
                
                try {
                    const rzp1 = new Razorpay(options);
                    rzp1.on('payment.failed', function (response){
                        btn.textContent = 'Proceed to Pay';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                        const errorMsg = document.getElementById('paymentErrorMsg');
                        errorMsg.textContent = 'Payment Failed: ' + response.error.description;
                        errorMsg.style.display = 'block';
                    });
                    rzp1.open();
                } catch (e) {
                    btn.textContent = 'Proceed to Pay';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    const errorMsg = document.getElementById('paymentErrorMsg');
                    errorMsg.textContent = 'Error loading payment gateway. Please try again.';
                    errorMsg.style.display = 'block';
                    console.error('Razorpay Error:', e);
                }
            };
`;

const payBtnLogic = `
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

if (!html.includes('window.initiateRazorpay')) {
    html = html.replace('// Attach event listeners', jsLogic + '\n            // Attach event listeners');
}
if (!html.includes('// Pay Advance Button')) {
    html = html.replace('// Attach event listeners', payBtnLogic + '\n            // Attach event listeners');
}

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Razorpay integrated.');
