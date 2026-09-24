const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const packageJS = `
            window.packageWhatsapp = function(packageName, price, support) {
                const msg = "Hi Crestiva,\\n\\nI'm interested in the " + packageName + ".\\n\\nPackage Price: " + price + "\\nSupport Duration: " + support + "\\n\\nPlease contact me regarding this project.";
                window.open("https://wa.me/917037311050?text=" + encodeURIComponent(msg), "_blank");
            };

            window.packagePayAdvance = function(packageName, price) {
                window.isPackageMode = true;
                window.packageFixedDue = Math.round(price * 0.25);
                window.currentProjectTotal = price;
                window.currentPayObj = { type: packageName };
                
                const remaining = price - window.packageFixedDue;
                
                let summaryHtml = '<p>Package Name: <span>' + packageName + '</span></p>';
                summaryHtml += '<p>Package Price: <span>₹' + price.toLocaleString('en-IN') + '</span></p>';
                summaryHtml += '<p>Advance Amount (25%): <span>₹' + window.packageFixedDue.toLocaleString('en-IN') + '</span></p>';
                summaryHtml += '<p>Remaining Amount: <span>₹' + remaining.toLocaleString('en-IN') + '</span></p>';
                
                document.getElementById('paymentSummary').innerHTML = summaryHtml;
                document.getElementById('payTotalAmount').textContent = '₹' + price.toLocaleString('en-IN');
                document.getElementById('payDueAmount').textContent = '₹' + window.packageFixedDue.toLocaleString('en-IN');
                
                // Hide payment options
                const optionsDiv = document.querySelector('.payment-options');
                if(optionsDiv) optionsDiv.style.display = 'none';
                
                // Set radio option to 25% just in case
                const radio25 = document.querySelector('input[name="pay_option"][value="25"]');
                if(radio25) radio25.checked = true;
                
                document.getElementById('paymentOverlay').classList.add('active');
            };
`;

html = html.replace('window.updatePayAmount = function() {', packageJS + '\n            window.updatePayAmount = function() {\n                if (window.isPackageMode) {\n                    document.getElementById(\'payDueAmount\').textContent = formatPrice(window.packageFixedDue);\n                    return window.packageFixedDue;\n                }');

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Added Package JS');
