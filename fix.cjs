const fs = require('fs');

const seeMore = fs.readFileSync('see-more.html', 'utf8');

// There are multiple mains in see-more! We only want the outer wrapper.
// It seems the script injection or something caused a problem.
const firstMainOpen = seeMore.indexOf('<main>');
const lastMainClose = seeMore.lastIndexOf('</main>');

const beforeMain = seeMore.substring(0, firstMainOpen + 6);
const afterMain = seeMore.substring(lastMainClose);

function generateFile(filename, contentStr, title, url, desc) {
    let html = beforeMain + '\n' + contentStr + '\n' + afterMain;
    
    // SEO cleanup
    html = html.replace(/<link rel="canonical" href=".*?" \/>/g, '');
    html = html.replace(/(<meta name="description" content=".*?" \/>)/, '$1\n    <link rel="canonical" href="' + url + '" />');
    html = html.replace(/<title>.*?<\/title>/g, '<title>' + title + '</title>');
    html = html.replace(/<meta property="og:title" content=".*?" \/>/g, '<meta property="og:title" content="' + title + '" />');
    html = html.replace(/<meta property="og:description" content=".*?" \/>/g, '<meta property="og:description" content="' + desc + '" />');
    html = html.replace(/<meta property="og:url" content=".*?" \/>/g, '<meta property="og:url" content="' + url + '" />');
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, '<meta name="twitter:title" content="' + title + '" />');
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, '<meta name="twitter:description" content="' + desc + '" />');
    
    // Strip duplicate <main> tags that might have leaked into the afterMain block
    html = html.replace(/<main>/g, function(match, offset, string) {
        return offset === html.indexOf('<main>') ? match : '';
    });
    html = html.replace(/<\/main>/g, function(match, offset, string) {
        return offset === html.lastIndexOf('</main>') ? match : '';
    });
    
    fs.writeFileSync(filename, html);
    console.log(filename + ' generated correctly. Length: ' + html.length + '. Main tags: ' + html.match(/<main>/g).length);
}

const privacyMatch = fs.readFileSync('privacy-policy.html', 'utf8').match(/<section class="fade-in-section info-block".*?<\/section>/s);
if (privacyMatch) {
    generateFile('privacy-policy.html', privacyMatch[0], 'Privacy Policy | Crestiva Web Studio', 'https://crestivawebstudio.online/privacy-policy', 'Privacy Policy for Crestiva Web Studio.');
}

const termsMatch = fs.readFileSync('terms.html', 'utf8').match(/<section class="fade-in-section info-block".*?<\/section>/s);
if (termsMatch) {
     generateFile('terms.html', termsMatch[0], 'Terms of Service | Crestiva Web Studio', 'https://crestivawebstudio.online/terms', 'Terms of Service for Crestiva Web Studio.');
}
