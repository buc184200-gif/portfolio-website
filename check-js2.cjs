const fs = require('fs');
const html = fs.readFileSync('see-more.html', 'utf-8');
const scriptMatch = html.match(/<!-- Premium Custom Builder Logic -->\s*<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const code = scriptMatch[1];
    try {
        const { parse } = require('acorn');
        parse(code, { ecmaVersion: 2022, sourceType: 'script' });
        console.log("No syntax errors in Premium Builder Logic");
    } catch (e) {
        console.error("Syntax Error in Premium Builder Logic:", e);
    }
} else {
    console.log("Script not found");
}
