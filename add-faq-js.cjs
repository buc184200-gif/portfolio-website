const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const faqJS = `
		// ─── FAQ Accordion Logic ───────────────────────────────────────────────
		const faqItems = document.querySelectorAll('.faq-item');
		faqItems.forEach(item => {
			const question = item.querySelector('.faq-question');
			question.addEventListener('click', () => {
				const isActive = item.classList.contains('active');
				
				// Close all others
				faqItems.forEach(otherItem => {
					if (otherItem !== item) {
						otherItem.classList.remove('active');
					}
				});
				
				// Toggle current
				if (isActive) {
					item.classList.remove('active');
				} else {
					item.classList.add('active');
				}
			});
		});
`;

if (!html.includes('FAQ Accordion Logic')) {
    html = html.replace('// ─── CTA Logic', faqJS + '\n\t\t// ─── CTA Logic');
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Added FAQ JS');
