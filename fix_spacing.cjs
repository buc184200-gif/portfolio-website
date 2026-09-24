const fs = require('fs');
let code = fs.readFileSync('build_legal_pages.cjs', 'utf8');

// Reduce top padding
code = code.replace(
    'padding: 140px 5% 100px;',
    'padding: 40px 5% 80px;'
);

// Reduce h1 margin
code = code.replace(
    'margin-bottom: 50px;',
    'margin-bottom: 30px;'
);

// Make GSAP faster for the initial elements
code = code.replace(
    'start: "top 95%",',
    'start: "top 98%",'
);

fs.writeFileSync('build_legal_pages.cjs', code);
console.log("Spacing fixed");
