const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const starterButtons = `
                        <a href="javascript:void(0)" onclick="packageWhatsapp('Starter Package', '₹15,499', '14 Days')" class="plan-btn" style="margin-bottom: 10px; border-color: rgba(212, 175, 55, 0.5); color: #d4af37;">Select Starter</a>
                        <a href="javascript:void(0)" onclick="packagePayAdvance('Starter Package', 15499)" class="plan-btn" style="background: var(--c-accent); color: var(--c-bg); border-color: var(--c-accent);">Pay 25% Advance</a>
`;

const growthButtons = `
                        <a href="javascript:void(0)" onclick="packageWhatsapp('Growth Package', '₹25,999', '30 Days')" class="plan-btn" style="margin-bottom: 10px; border-color: rgba(212, 175, 55, 0.5); color: #d4af37;">Select Growth</a>
                        <a href="javascript:void(0)" onclick="packagePayAdvance('Growth Package', 25999)" class="plan-btn" style="background: var(--c-accent); color: var(--c-bg); border-color: var(--c-accent);">Pay 25% Advance</a>
`;

const eliteButtons = `
                        <a href="javascript:void(0)" onclick="packageWhatsapp('Elite Package', '₹44,399', '90 Days')" class="plan-btn" style="margin-bottom: 10px; border-color: rgba(212, 175, 55, 0.5); color: #d4af37;">Select Elite</a>
                        <a href="javascript:void(0)" onclick="packagePayAdvance('Elite Package', 44399)" class="plan-btn" style="background: var(--c-accent); color: var(--c-bg); border-color: var(--c-accent);">Pay 25% Advance</a>
`;

html = html.replace('<a href="https://wa.me/917037311050?text=I\'m%20interested%20in%20the%20Starter%20Package" class="plan-btn" target="_blank">Select Starter</a>', starterButtons);
html = html.replace('<a href="https://wa.me/917037311050?text=I\'m%20interested%20in%20the%20Growth%20Package" class="plan-btn" target="_blank" style="background: var(--c-accent); color: var(--c-bg);">Select Growth</a>', growthButtons);
html = html.replace('<a href="https://wa.me/917037311050?text=I\'m%20interested%20in%20the%20Elite%20Package" class="plan-btn" target="_blank">Select Elite</a>', eliteButtons);

fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Buttons Replaced');
