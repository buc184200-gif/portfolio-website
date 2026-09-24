const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const badLines = `            const payBtn = getEl('quote-pay-btn');
            
            // Global variables for payment`;
html = html.replace(badLines, '            // Global variables for payment');
fs.writeFileSync('see-more.html', html, 'utf-8');
