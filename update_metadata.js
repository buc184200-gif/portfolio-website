const fs = require('fs');

function updateMeta(filePath, title, desc, url) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove existing title
    content = content.replace(/<title>.*?<\/title>/gi, '');
    
    const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://crestivawebstudio.online/crestiva-logo.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="https://crestivawebstudio.online/crestiva-logo.svg" />
    `;
    
    content = content.replace(/<head>/i, `<head>\n${metaTags}`);
    fs.writeFileSync(filePath, content);
}

updateMeta('index.html', 
    'Crestiva Web Studio | Premium AI Web Design & Development',
    'Crestiva Web Studio crafts premium, custom-designed websites using advanced AI and modern web technologies for businesses that demand excellence.',
    'https://crestivawebstudio.online/');

updateMeta('see-more.html',
    'Our Services & Pricing | Crestiva Web Studio',
    'Explore our premium web design services, advanced AI integrations, and transparent pricing plans tailored for your business needs.',
    'https://crestivawebstudio.online/see-more');

updateMeta('demo.html',
    'Interactive Demos & Templates | Crestiva Web Studio',
    'Experience our interactive web templates and 3D web design demos built with modern frameworks and WebGL.',
    'https://crestivawebstudio.online/demo.html');

console.log('Metadata updated.');
