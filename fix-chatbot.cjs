const fs = require('fs');

// 1. Update ai-concierge.js
let js = fs.readFileSync('public/ai-concierge.js', 'utf8');
js = js.replace('<div id="ai-concierge-orb"></div>', `<div id="ai-concierge-orb">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: auto; display: block;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>`);
fs.writeFileSync('public/ai-concierge.js', js);

// 2. Update ai-concierge.css
let css = fs.readFileSync('public/ai-concierge.css', 'utf8');
css = css.replace('background: radial-gradient(circle at 30% 30%, #fff, rgba(196, 168, 130, 0.8));', 'background: #c4a882; display: flex; align-items: center; justify-content: center;');
css = css.replace('width: 24px; height: 24px;', 'width: 44px; height: 44px;');
css = css.replace('#ai-concierge-orb { width: 18px; height: 18px; }', '#ai-concierge-orb { width: 36px; height: 36px; }');
css = css.replace('#ai-concierge-orb-wrapper { width: 50px; height: 50px; }', '#ai-concierge-orb-wrapper { width: 56px; height: 56px; }');
css = css.replace('width: 64px; height: 64px;', 'width: 72px; height: 72px;');

fs.writeFileSync('public/ai-concierge.css', css);

console.log("Chatbot UI updated");
