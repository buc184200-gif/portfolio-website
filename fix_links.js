const fs = require('fs');

// Fix index.html
let index = fs.readFileSync('index.html', 'utf8');
index = index.replace(/<div class="sf-legal" style="display: flex; gap: 20px; font-size: 0\.85rem; color: rgba\(140, 180, 120, 0\.6\);">\s*<a href="\/privacy-policy" style="color: inherit; text-decoration: none; transition: color 0\.3s;" onmouseover="this\.style\.color='#d4af37'" onmouseout="this\.style\.color='inherit'">Privacy Policy<\/a>\s*<a href="\/terms" style="color: inherit; text-decoration: none; transition: color 0\.3s;" onmouseover="this\.style\.color='#d4af37'" onmouseout="this\.style\.color='inherit'">Terms of Service<\/a>\s*<\/div>/g, '');
fs.writeFileSync('index.html', index);

// Fix see-more.html
let seeMore = fs.readFileSync('see-more.html', 'utf8');
seeMore = seeMore.replace(/<div style="margin-top: 10px; display: flex; gap: 15px; font-size: 0\.85rem; opacity: 0\.7; justify-content: center;">\s*<a href="\/privacy-policy" style="color: inherit; text-decoration: none; transition: opacity 0\.3s;" onmouseover="this\.style\.opacity=1" onmouseout="this\.style\.opacity=0\.7">Privacy Policy<\/a>\s*<a href="\/terms" style="color: inherit; text-decoration: none; transition: opacity 0\.3s;" onmouseover="this\.style\.opacity=1" onmouseout="this\.style\.opacity=0\.7">Terms of Service<\/a>\s*<\/div>/g, 
`<div class="legal-links" style="margin-top: 10px; display: flex; gap: 15px; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; color: var(--c-text-dim);">
                        <a href="/privacy-policy" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Privacy Policy</a>
                        <a href="/terms" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Terms of Service</a>
                    </div>`);
fs.writeFileSync('see-more.html', seeMore);

console.log('Fixed links in index.html and see-more.html');
