const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Disable globalDofEnabled completely
html = html.replace('let globalDofEnabled = !isMobile;', 'let globalDofEnabled = false;');

// Change index 9 (dofOn) to 0 for all keyframes
html = html.replace(/\[0.00, -2.8,  7.2, 19.6,  0.5, 1.5,  0.4, 22.0, 0, 1,  6.0,  5.0, 5.0, 1.0, 40.0\],/g, 
                    '[0.00, -2.8,  7.2, 19.6,  0.5, 1.5,  0.4, 22.0, 0, 0,  6.0,  5.0, 5.0, 1.0, 40.0],'); // Hero

html = html.replace(/\[0.14,  0,    2.2, 14.0,  0,  -2.0,   0,   15.0, 0, 1,  5.0,  4.0, 5.0, 1.0, 30.0\],/g,
                    '[0.14,  0,    2.2, 14.0,  0,  -2.0,   0,   15.0, 0, 0,  5.0,  4.0, 5.0, 1.0, 30.0],'); // Manifesto

html = html.replace(/\[0.28,  7.5, 10.9, 15.8,  0,   0.0,   0.7, 15.0, 0, 1,  4.0,  3.0, 5.0, 0.5, 20.0\],/g,
                    '[0.28,  7.5, 10.9, 15.8,  0,   0.0,   0.7, 15.0, 0, 0,  4.0,  3.0, 5.0, 0.5, 20.0],'); // Pillars

html = html.replace(/\[0.43, -8.0,  6.8, 21.6,  0,   0.2,   0,   18.0, 0, 1,  4.0,  4.0, 5.0, 0.5, 15.0\],/g,
                    '[0.43, -8.0,  6.8, 21.6,  0,   0.2,   0,   18.0, 0, 0,  4.0,  4.0, 5.0, 0.5, 15.0],'); // Stats

html = html.replace(/\[0.57, -1.0,  5.3, 25.0, -1.2, 3.0,   0,   12.0, 0, 1,  3.0,  5.0, 6.0, 1.1, 21.5\],/g,
                    '[0.57, -1.0,  5.3, 25.0, -1.2, 3.0,   0,   12.0, 0, 0,  3.0,  5.0, 6.0, 1.1, 21.5],'); // Quote

html = html.replace(/\[1.00,  0,   15.0,  0.0, -5,   3.0,  -5,   15.0, 0, 1,  6.0,  0.0, 17.5, 1.2,  9.0\],/g,
                    '[1.00,  0,   15.0,  0.0, -5,   3.0,  -5,   15.0, 0, 0,  6.0,  0.0, 17.5, 1.2,  9.0],'); // Footer

fs.writeFileSync('index.html', html);
console.log('DoF completely disabled.');

