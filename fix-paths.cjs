const fs = require('fs');

const files = ['index.html', 'projects.html', 'see-more.html', 'demo.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Fix asset paths
        content = content.replace(/"\/ai-concierge.css"/g, '"./ai-concierge.css"');
        content = content.replace(/"\/ai-concierge.js"/g, '"./ai-concierge.js"');
        
        // Fix page navigation paths to use .html (Netlify/GH pages friendly)
        content = content.replace(/href="\/see-more"/g, 'href="./see-more.html"');
        content = content.replace(/href="\/projects"/g, 'href="./projects.html"');
        content = content.replace(/href="\/demo"/g, 'href="./demo.html"');
        content = content.replace(/href="\/"/g, 'href="./index.html"');

        // Note: also check if any single quotes were used
        content = content.replace(/href='\/see-more'/g, "href='./see-more.html'");
        content = content.replace(/href='\/projects'/g, "href='./projects.html'");

        fs.writeFileSync(file, content);
    }
});

console.log("HTML paths fixed.");
