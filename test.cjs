const fs = require('fs');
let content = fs.readFileSync('privacy-policy.html', 'utf8');
console.log('privacy length:', content.length);
let count = (content.match(/<main>/g) || []).length;
console.log('main tags count:', count);
