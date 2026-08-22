const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const target = `    app.get("/see-more", (req, res) => {
      res.sendFile(path.join(distPath, "see-more.html"));
    });`;

const replacement = `    app.get("/see-more", (req, res) => {
      res.sendFile(path.join(distPath, "see-more.html"));
    });
    
    app.get("/privacy-policy", (req, res) => {
      res.sendFile(path.join(distPath, "privacy-policy.html"));
    });

    app.get("/terms", (req, res) => {
      res.sendFile(path.join(distPath, "terms.html"));
    });`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
console.log('server.ts explicit routes patched');
