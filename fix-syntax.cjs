const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf-8');
html = html.replace('            };\n            };\n            \n            // Attach event listeners', '            };\n            \n            // Attach event listeners');
fs.writeFileSync('see-more.html', html, 'utf-8');
