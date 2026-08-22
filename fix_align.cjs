const fs = require('fs');

let sm = fs.readFileSync('see-more.html', 'utf8');

// I want to ensure the footer has NO display: flex; center, etc. It should just be block level
// or left-aligned flex to match the rest of the text.
// Currently it is:
// <div class="legal-links" style="margin-top: 10px; display: flex; gap: 15px; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; color: var(--c-text-dim);">

sm = sm.replace('<div class="legal-links" style="margin-top: 10px; display: flex; gap: 15px; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; color: var(--c-text-dim);">',
'<div class="legal-links" style="margin-top: 10px; display: flex; gap: 15px; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; color: var(--c-text-dim); justify-content: flex-start;">');

fs.writeFileSync('see-more.html', sm);
console.log('Fixed alignment in see-more.html');
