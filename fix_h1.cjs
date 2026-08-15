const fs = require('fs');
let content = fs.readFileSync('see-more.html', 'utf8');

// I should check if there are multiple H1s in see-more.html.
let matches = content.match(/<h1/g);
console.log('Number of H1s in see-more.html: ', matches ? matches.length : 0);
