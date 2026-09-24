const fs = require('fs');
let code = fs.readFileSync('build_legal_pages.cjs', 'utf8');

// Use split-join for global replacement
code = code.split('padding: 140px 5% 100px;').join('padding: 40px 5% 80px;');
code = code.split('margin-bottom: 50px;').join('margin-bottom: 30px;');

fs.writeFileSync('build_legal_pages.cjs', code);
console.log("Global spacing fixed");
