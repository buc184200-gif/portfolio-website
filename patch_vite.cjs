const fs = require('fs');

let code = fs.readFileSync('vite.config.ts', 'utf8');

const target = `          demo: path.resolve(__dirname, 'demo.html')`;

const replacement = `          demo: path.resolve(__dirname, 'demo.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html')`;

code = code.replace(target, replacement);
fs.writeFileSync('vite.config.ts', code);
console.log('vite.config.ts updated');
