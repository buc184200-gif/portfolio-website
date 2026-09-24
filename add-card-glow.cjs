const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

const css = `
        .price-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(196, 168, 130, 0.15), transparent 80%);
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
            z-index: 1;
        }
        .price-card:hover::before {
            opacity: 1;
        }
`;

html = html.replace('/* === LUXURY MOTION EFFECTS === */', '/* === LUXURY MOTION EFFECTS === */\n' + css);
fs.writeFileSync('see-more.html', html);
