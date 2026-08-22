const fs = require('fs');

const filesToFix = ['see-more.html', 'terms.html', 'privacy-policy.html'];

const findPattern = `<div class="nav-links" id="nav-links">
                    <a href="#pricing" class="nav-link"><span class="nav-idx">01</span>Pricing</a>
                    <a href="#about" class="nav-link"><span class="nav-idx">02</span>About</a>
                    <a href="https://wa.me/917037311050" class="nav-link" ><span class="nav-idx">03</span>Inquire</a>
                </div>`;

const replacePattern = `<div class="nav-links" id="nav-links">
                    <a href="#pricing" class="nav-link"><span class="nav-idx">01</span>Pricing</a>
                    <a href="#about" class="nav-link"><span class="nav-idx">02</span>About</a>
                    <a href="https://wa.me/917037311050" class="nav-link" ><span class="nav-idx">03</span>Inquire</a>
                    <a href="/privacy-policy" class="nav-link"><span class="nav-idx">04</span>Privacy Policy</a>
                    <a href="/terms" class="nav-link"><span class="nav-idx">05</span>Terms</a>
                </div>`;

let fixedCount = 0;

for (const file of filesToFix) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content.split(findPattern).join(replacePattern);
        if (newContent !== content) {
            fs.writeFileSync(file, newContent);
            console.log(`Replaced correctly in ${file}`);
            fixedCount++;
        } else {
            console.log(`Pattern not found precisely in ${file}, let's try a regex fallback.`);
            
            // Regex fallback ignoring whitespace differences
            const regex = /<div class="nav-links" id="nav-links">\s*<a href="#pricing" class="nav-link"><span class="nav-idx">01<\/span>Pricing<\/a>\s*<a href="#about" class="nav-link"><span class="nav-idx">02<\/span>About<\/a>\s*<a href="https:\/\/wa\.me\/917037311050" class="nav-link"\s*><span class="nav-idx">03<\/span>Inquire<\/a>\s*<\/div>/g;
            newContent = content.replace(regex, replacePattern);
            if (newContent !== content) {
                fs.writeFileSync(file, newContent);
                console.log(`Replaced with regex in ${file}`);
                fixedCount++;
            } else {
                console.log(`Failed to replace in ${file}`);
            }
        }
    }
}
console.log(`Fixed ${fixedCount} files`);
