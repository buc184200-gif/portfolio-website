const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix floating CTA
content = content.replace('<a href="/see-more.html" class="floating-cta-btn" id="floatingCta">', '<a href="/see-more" class="floating-cta-btn" id="floatingCta">');

// Fix redirect
content = content.replace("window.location.href = '/see-more.html?auth=' + mode;", "window.location.href = '/see-more?auth=' + mode;");

// Update footer links
content = content.replace('<a href="javascript:void(0)">Services</a>', '<a href="/see-more" title="Web Design & Development Services">Services &amp; Pricing</a>');
content = content.replace('<a href="javascript:void(0)">Work</a>', '<a href="/demo.html" title="Interactive Web Design Demos">Interactive Demos</a>');
content = content.replace('<a href="javascript:void(0)">Case Studies</a>', '<a href="/demo.html" title="Design Concepts">Design Concepts</a>');

fs.writeFileSync('index.html', content);
