const fs = require('fs');
const html = fs.readFileSync('see-more.html', 'utf-8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const code = scriptMatch[1];
    try {
        const { parse } = require('acorn');
        parse(code, { ecmaVersion: 2022, sourceType: 'module' });
        console.log("No syntax errors");
    } catch (e) {
        console.error("Syntax Error:", e);
    }
}
