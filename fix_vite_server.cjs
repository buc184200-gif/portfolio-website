const fs = require('fs');

let vite = fs.readFileSync('vite.config.ts', 'utf8');
vite = vite.replace(/projects: path\.resolve\(__dirname, 'projects\.html'\),?\n?/g, '');
fs.writeFileSync('vite.config.ts', vite);

let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(/app\.get\("\/projects".*?\}\);/gs, '');
fs.writeFileSync('server.ts', server);

