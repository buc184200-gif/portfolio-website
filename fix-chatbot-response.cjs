const fs = require('fs');

let js = fs.readFileSync('public/ai-concierge.js', 'utf8');

js = js.replace(
    'if (data.text) {',
    'const text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : null;\n            if (text) {\n                data.text = text;'
);

fs.writeFileSync('public/ai-concierge.js', js);
console.log("Fixed response parsing.");
