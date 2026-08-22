const fs = require('fs');

function fixCanonicals(file, correctUrl) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove all existing canonicals
    content = content.replace(/<link rel="canonical" href=".*?" \/>/g, '');
    
    // Insert the correct canonical right after the description meta tag
    content = content.replace(/(<meta name="description" content=".*?" \/>)/, '$1\n    <link rel="canonical" href="' + correctUrl + '" />');
    
    fs.writeFileSync(file, content);
    console.log(file + ' canonicals fixed');
}

fixCanonicals('privacy-policy.html', 'https://crestivawebstudio.online/privacy-policy');
fixCanonicals('terms.html', 'https://crestivawebstudio.online/terms');
