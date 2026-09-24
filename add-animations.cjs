const fs = require('fs');
let css = fs.readFileSync('ai-concierge.css', 'utf8');

if (!css.includes('aiParticlePulse')) {
    css += `
@keyframes aiParticlePulse {
    0% { transform: translate(-50%, -50%) scale(0.8) rotate(0deg); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.1) rotate(180deg); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0.5; }
}

.ai-particles {
    animation: aiParticlePulse 3s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
}
`;
    fs.writeFileSync('ai-concierge.css', css);
}
