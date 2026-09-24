const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = `<span class="sf-copy">© 2026 Crestiva Web Studio. All rights reserved.</span>`;
const replacement = `<span class="sf-copy">© 2026 Crestiva Web Studio. All rights reserved.</span>
			<div class="sf-legal" style="display: flex; gap: 20px; font-size: 0.85rem; color: rgba(140, 180, 120, 0.6);">
				<a href="/privacy-policy" style="color: inherit; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#d4af37'" onmouseout="this.style.color='inherit'">Privacy Policy</a>
				<a href="/terms" style="color: inherit; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#d4af37'" onmouseout="this.style.color='inherit'">Terms of Service</a>
			</div>`;

html = html.replace(target, replacement);
fs.writeFileSync('index.html', html);
console.log('index.html footer updated');
