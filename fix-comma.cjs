const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');
html = html.replace('},,', '},');
fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Fixed extra comma');
