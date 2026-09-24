const fs = require('fs');

const files = ['index.html', 'see-more.html', 'demo.html', 'head.html'];
const faviconTag = '\n    <link rel="icon" type="image/png" href="/favicon.png">';

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('favicon.png')) {
            // Insert right after </title>
            content = content.replace('</title>', '</title>' + faviconTag);
            fs.writeFileSync(file, content);
            console.log(`Added favicon to ${file}`);
        } else {
            console.log(`Favicon already exists in ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
