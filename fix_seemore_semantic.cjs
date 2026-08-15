const fs = require('fs');

let content = fs.readFileSync('see-more.html', 'utf8');

// The main content sections start with <div class="sections-container"> or similar? 
// Let's check where <section id="pricing" starts.
content = content.replace('<section id="pricing"', '<main>\n            <section id="pricing"');

// And it ends before the footer? Or is there a footer?
content = content.replace('            <footer ', '            </main>\n            <footer ');

fs.writeFileSync('see-more.html', content);
