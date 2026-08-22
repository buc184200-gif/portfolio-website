const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/\[0.78, -1.6,  2.4,  0.0, -1.2, -2.0,   0.0, 16.4, 1, 0, 20.0, 18.0, 19.0, 2.8, 12.5\],/g,
                    '[0.78, -1.6,  2.4,  0.0, -1.2, -2.0,   0.0, 16.4, 0, 0,  6.0,  5.0, 19.0, 2.8, 12.5],'); // CTA

html = html.replace(/\[1.00,  0,   15.0,  0.0, -5,   3.0,  -5,    9.8, 1, 1, 13.8,  0.0, 17.5, 1.2,  9.0\],/g,
                    '[1.00,  0,   15.0,  0.0, -5,   3.0,  -5,   15.0, 0, 1,  6.0,  0.0, 17.5, 1.2,  9.0],'); // Footer

fs.writeFileSync('index.html', html);
console.log('DOF 2 updated successfully.');

