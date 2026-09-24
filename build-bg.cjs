const fs = require('fs');

let script = fs.readFileSync('temp-three.js', 'utf8');
script = script.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');

const blurScript = `
const blurLayer = document.querySelector('.layer-blur');
if (blurLayer) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let smoothX = mouseX, smoothY = mouseY;
    let lastBlurX = '', lastBlurY = '';

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateBlur() {
        smoothX += (mouseX - smoothX) * 0.1;
        smoothY += (mouseY - smoothY) * 0.1;
        const newX = (smoothX / window.innerWidth * 100).toFixed(1) + '%';
        const newY = (smoothY / window.innerHeight * 100).toFixed(1) + '%';
        if (newX !== lastBlurX || newY !== lastBlurY) {
            lastBlurX = newX;
            lastBlurY = newY;
            blurLayer.style.setProperty('--x', newX);
            blurLayer.style.setProperty('--y', newY);
        }
        requestAnimationFrame(animateBlur);
    }
    animateBlur();
}
`;

fs.writeFileSync('public/shared-bg.js', script + blurScript);
fs.writeFileSync('shared-bg.js', script + blurScript); // copy to root too just in case
console.log('done');
