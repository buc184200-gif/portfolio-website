const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const successHtml = `
<!-- Payment Success Modal -->
<div class="payment-success-overlay" id="paymentSuccessOverlay">
    <div class="payment-success-modal">
        <div class="success-check">✓</div>
        <h3>Advance payment received successfully.</h3>
        <p>Order ID: <span id="successOrderId" style="color:#d4af37;"></span></p>
        <p>Package Name: <span id="successPackageName" style="color:#d4af37;"></span></p>
        <p>Amount Paid: <span id="successAmountPaid" style="color:#d4af37;"></span></p>
        <p>Remaining Balance: <span id="successRemainingBalance" style="color:#d4af37;"></span></p>
        <p style="margin-top: 15px;">Our team will contact you shortly to begin the project.</p>
        <button class="plan-btn outline-btn" style="width:100%; margin-top:20px; border-color:rgba(212,175,55,0.5); color:#d4af37;" onclick="document.getElementById('paymentSuccessOverlay').classList.remove('active')">Close</button>
    </div>
</div>
`;

// Regex replace the old payment success modal
const oldSuccessRegex = /<!-- Payment Success Modal -->[\s\S]*?<\/div>[\s\S]*?<\/div>/;
html = html.replace(oldSuccessRegex, successHtml.trim());

const handlerLogic = `
                    "handler": function (response){
                        // Payment Success
                        btn.textContent = 'Proceed to Pay';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                        
                        document.getElementById('paymentOverlay').classList.remove('active');
                        
                        // Show Success Modal
                        document.getElementById('successOrderId').textContent = response.razorpay_payment_id;
                        document.getElementById('successPackageName').textContent = window.currentPayObj ? window.currentPayObj.type : 'Custom Project';
                        document.getElementById('successAmountPaid').textContent = '₹' + dueAmount.toLocaleString('en-IN');
                        
                        const remaining = window.currentProjectTotal - dueAmount;
                        document.getElementById('successRemainingBalance').textContent = '₹' + remaining.toLocaleString('en-IN');
                        
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
`;

html = html.replace(/                    "handler": function \(response\)\{[\s\S]*?\},/m, handlerLogic.trim() + ',');

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Fixed Success Modal');
