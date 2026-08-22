const fs = require('fs');
let sm = fs.readFileSync('see-more.html', 'utf8');
if (sm.includes('justify-content: center')) {
    console.log('Still has center! Doing fallback replace.');
    sm = sm.replace('<div style="margin-top: 10px; display: flex; gap: 15px; font-size: 0.85rem; opacity: 0.7; justify-content: center;">', '<div style="margin-top: 10px; display: flex; gap: 15px;">');
    fs.writeFileSync('see-more.html', sm);
} else {
    console.log('Center is gone');
}
