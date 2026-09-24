const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace('app.get("/demo", (req, res) => {', 'app.get("/demo.html", (req, res) => {');

fs.writeFileSync('server.ts', content);
