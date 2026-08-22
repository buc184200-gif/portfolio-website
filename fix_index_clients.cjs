const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace('<a href="javascript:void(0)">Clients</a>', '<a href="/see-more#about" title="About Crestiva Web Studio">About Us</a>');

fs.writeFileSync('index.html', content);
