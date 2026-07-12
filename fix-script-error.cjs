const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');

const regex = /\/\/ Calculator Logic[\s\S]*?updateCalculator\(\);/m;
html = html.replace(regex, '// Calculator Logic Removed');
fs.writeFileSync('see-more.html', html, 'utf-8');
console.log('Fixed script error');
