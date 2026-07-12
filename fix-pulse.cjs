const fs = require('fs');
let js = fs.readFileSync('public/ai-concierge.js', 'utf8');

js = js.replace('pulseScale = 0;', `
                if (pulseTween) pulseTween.kill();
                pulseScale = 0;
`);

fs.writeFileSync('public/ai-concierge.js', js);
console.log('Fixed pulse conflict');
