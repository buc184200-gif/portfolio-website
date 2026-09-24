const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// Add styles
const newStyles = `
        /* === LUXURY MOTION EFFECTS === */
        .ambient-light {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.15;
            pointer-events: none;
            z-index: 1;
            mix-blend-mode: screen;
            animation: floatLight 25s ease-in-out infinite alternate;
            will-change: transform;
        }
        .light-1 { width: 500px; height: 500px; background: rgba(196, 168, 130, 0.4); top: -10%; left: -10%; }
        .light-2 { width: 600px; height: 600px; background: rgba(139, 115, 85, 0.3); bottom: -20%; right: -10%; animation-delay: -5s; animation-duration: 30s; }
        .light-3 { width: 400px; height: 400px; background: rgba(255, 255, 255, 0.1); top: 40%; left: 40%; animation-delay: -10s; animation-duration: 20s; }

        @keyframes floatLight {
            0% { transform: translate3d(0, 0, 0) scale(1); }
            33% { transform: translate3d(5%, 5%, 0) scale(1.1); }
            66% { transform: translate3d(-3%, 8%, 0) scale(0.95); }
            100% { transform: translate3d(2%, -5%, 0) scale(1.05); }
        }

        /* Divider animation */
        .luxury-divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(196, 168, 130, 0.5), transparent);
            margin: 4rem 0;
            opacity: 0;
            transform: scaleX(0);
            transform-origin: left;
            will-change: transform, opacity;
        }

        /* Pricing Card Elite Shimmer */
        .price-card.elite {
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(196, 168, 130, 0.2);
        }
        .price-card.elite::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: conic-gradient(from 0deg, transparent 0%, transparent 30%, rgba(196, 168, 130, 0.4) 50%, transparent 70%, transparent 100%);
            animation: eliteSweep 8s linear infinite;
            z-index: 0;
            pointer-events: none;
            opacity: 0.5;
        }
        .price-card.elite > * { position: relative; z-index: 1; }
        @keyframes eliteSweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Advanced Card Hover */
        .price-card {
            transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.6s;
            will-change: transform, box-shadow;
        }
        .price-card:hover {
            transform: translateY(-12px) scale(1.015) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(196, 168, 130, 0.1);
            border-color: rgba(196, 168, 130, 0.5);
        }

        /* Number counter styles */
        .plan-price .counter-val, .quote-price .counter-val {
            display: inline-block;
            font-variant-numeric: tabular-nums;
        }
        
        .cursor-light {
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(196, 168, 130, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 999;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
            opacity: 0;
            transition: opacity 0.5s;
        }
        body:hover .cursor-light { opacity: 1; }
`;

html = html.replace('/* === LAYOUT === */', newStyles + '\n        /* === LAYOUT === */');

// Add elite class to the third card
html = html.replace('<div class="price-card">\\n                        <div class="plan-name">Elite</div>', '<div class="price-card elite">\\n                        <div class="plan-name">Elite</div>');

// Add Ambient Lights to body
const lightsHTML = `
    <div class="ambient-light light-1"></div>
    <div class="ambient-light light-2"></div>
    <div class="ambient-light light-3"></div>
    <div class="cursor-light" id="cursor-light"></div>
`;
html = html.replace('<div class="noise-overlay"></div>', '<div class="noise-overlay"></div>' + lightsHTML);
// Check if noise-overlay is already in HTML or injected by JS. In awwwards.js it's injected. So let's put it right after <body>
html = html.replace('<body>', '<body>' + lightsHTML);

fs.writeFileSync('see-more.html', html);
console.log('Added styles and lights');
