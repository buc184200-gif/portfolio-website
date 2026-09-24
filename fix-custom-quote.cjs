const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const fixLogic = `
                        document.getElementById('payTotalAmount').textContent = formatPrice(window.currentProjectTotal);
                        
                        window.isPackageMode = false;
                        const optionsDiv = document.querySelector('.payment-options');
                        if (optionsDiv) optionsDiv.style.display = 'flex';
                        
                        // Reset options to 25%
                        document.querySelector('input[name="pay_option"][value="25"]').checked = true;
`;

html = html.replace(`                        document.getElementById('payTotalAmount').textContent = formatPrice(window.currentProjectTotal);
                        
                        // Reset options to 25%
                        document.querySelector('input[name="pay_option"][value="25"]').checked = true;`, fixLogic);

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Fixed Custom Quote Modal Reusability');
