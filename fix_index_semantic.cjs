const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Wrap #scroll-container inner with <main> ? Wait, scroll-container is the main content.
// It has `<div id="scroll-container">`
content = content.replace('<div id="scroll-container">', '<main id="scroll-container">');
content = content.replace('</div>\n\t<footer', '</main>\n\t<footer');

fs.writeFileSync('index.html', content);
