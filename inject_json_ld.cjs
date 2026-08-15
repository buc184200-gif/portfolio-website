const fs = require('fs');

function injectJsonLd(filePath, url, pageName) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already injected
    if (content.includes('application/ld+json')) return;

    const jsonLd = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://crestivawebstudio.online/#organization",
          "name": "Crestiva Web Studio",
          "url": "https://crestivawebstudio.online/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://crestivawebstudio.online/crestiva-logo.svg"
          },
          "description": "Premium AI Web Design & Development Studio"
        },
        {
          "@type": "WebSite",
          "@id": "https://crestivawebstudio.online/#website",
          "url": "https://crestivawebstudio.online/",
          "name": "Crestiva Web Studio",
          "publisher": {
            "@id": "https://crestivawebstudio.online/#organization"
          }
        },
        {
          "@type": "WebPage",
          "@id": "${url}#webpage",
          "url": "${url}",
          "name": "${pageName}",
          "isPartOf": {
            "@id": "https://crestivawebstudio.online/#website"
          }
        }
      ]
    }
    </script>
    `;
    
    content = content.replace(/<\/head>/i, `${jsonLd}\n</head>`);
    fs.writeFileSync(filePath, content);
}

injectJsonLd('index.html', 'https://crestivawebstudio.online/', 'Premium AI Web Design & Development | Crestiva Web Studio');
injectJsonLd('see-more.html', 'https://crestivawebstudio.online/see-more', 'Our Services & Pricing | Crestiva Web Studio');
injectJsonLd('demo.html', 'https://crestivawebstudio.online/demo.html', 'Interactive Demos & Templates | Crestiva Web Studio');

console.log('JSON-LD structured data added.');
