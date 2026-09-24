const fs = require('fs');
let sm = fs.readFileSync('see-more.html', 'utf8');

const matches = sm.match(/<div class="[^"]*"/g);
console.log(matches.slice(0, 100).join('\n'));
