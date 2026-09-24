const fs = require('fs');
let sm = fs.readFileSync('see-more.html', 'utf8');
if (sm.includes('gap: 2.5rem;')) {
    // maybe reduce gap on .nav-links ?
}
