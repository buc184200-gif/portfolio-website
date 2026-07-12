const fs = require('fs');
const html = fs.readFileSync('see-more.html', 'utf-8');
const scriptMatch = html.match(/<!-- Premium Custom Builder Logic -->\s*<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const code = scriptMatch[1];
    const lines = code.split('\n');
    for (let i = Math.max(0, 402 - 10); i < Math.min(lines.length, 402 + 10); i++) {
        console.log((i+1) + ": " + lines[i]);
    }
}
