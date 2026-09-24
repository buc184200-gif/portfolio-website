const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// Insert divider before Custom Builder
html = html.replace('<section id="custom-builder"', '<div class="luxury-divider"></div>\n            <section id="custom-builder"');

// Insert divider before About
html = html.replace('<section id="about"', '<div class="luxury-divider"></div>\n            <section id="about"');

// Insert divider before Contact
html = html.replace('<section id="contact"', '<div class="luxury-divider"></div>\n            <section id="contact"');

fs.writeFileSync('see-more.html', html);
console.log('Added dividers');
