const fs = require('fs');

let css = fs.readFileSync('public/ai-concierge.css', 'utf8');
css = css.replace('#ai-concierge-orb::after {', '#ai-concierge-orb::after {\n    z-index: 1;');
css += '\n\n#ai-concierge-orb svg { position: relative; z-index: 2; width: 50%; height: 50%; }\n';
fs.writeFileSync('public/ai-concierge.css', css);
console.log("Fixed z-index");
