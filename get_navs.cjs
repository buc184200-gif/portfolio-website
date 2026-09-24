const fs = require('fs');
const files = ['index.html', 'see-more.html', 'demo.html', 'terms.html', 'privacy-policy.html'];

for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/<div class="nav-links"[^>]*>([\s\S]*?)<\/div>/);
    if (match) {
      console.log(`\n--- ${file} ---`);
      console.log(match[0].substring(0, 500));
    }
  }
}
