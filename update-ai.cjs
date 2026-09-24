const fs = require('fs');
let js = fs.readFileSync('public/ai-concierge.js', 'utf8');

// 1. Add variables
const varsToAdd = `
    let wanderTarget = { x: 0, y: 0 };
    let wanderTween = null;
    let pulseScale = 1;
    let pulseTween = null;
    let isChatOpen = false;
`;
js = js.replace('let isChatOpen = false;', varsToAdd);

// 2. Add startWander and triggerPulse
const newFuncs = `
    const startWander = () => {
        if (wanderTween) wanderTween.kill();
        
        const size = window.innerWidth < 768 ? 50 : 64;
        const padding = 40;
        
        let targetX, targetY;
        let isSafe = false;
        let attempts = 0;
        
        while (!isSafe && attempts < 30) {
            attempts++;
            targetX = gsap.utils.random(padding, window.innerWidth - size - padding);
            targetY = gsap.utils.random(padding, window.innerHeight - size - padding);
            
            isSafe = true;
            const avoidEls = document.querySelectorAll('.nav, .btn-main, .gold-btn, .price-card, .builder-quote-box, form, .hero-title, .section-heading, .project-card, .footer');
            for (let el of avoidEls) {
                const rect = el.getBoundingClientRect();
                const margin = 40; 
                // Ignore elements that are far offscreen
                if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                
                if (targetX + size > rect.left - margin &&
                    targetX < rect.right + margin &&
                    targetY + size > rect.top - margin &&
                    targetY < rect.bottom + margin) {
                    isSafe = false;
                    break;
                }
            }
        }
        
        if (!isSafe) {
            targetX = window.innerWidth - size - padding;
            targetY = window.innerHeight - size - padding;
        }
        
        wanderTween = gsap.to(wanderTarget, {
            x: targetX,
            y: targetY,
            duration: gsap.utils.random(8, 15),
            ease: "sine.inOut",
            onComplete: startWander
        });
    };

    const triggerPulse = () => {
        if (isChatOpen || isHovered) {
            setTimeout(triggerPulse, 2000);
            return;
        }
        let pObj = { s: 1 };
        pulseTween = gsap.to(pObj, {
            s: 1.15,
            duration: 1.2,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
            onUpdate: () => { pulseScale = pObj.s; },
            onComplete: () => {
                setTimeout(triggerPulse, gsap.utils.random(4000, 8000));
            }
        });
    };
`;

js = js.replace('const init = () => {', newFuncs + '\n    const init = () => {');

// 3. Call startWander in init
js = js.replace('startEntrance();\n        requestAnimationFrame(physicsLoop);', 'startEntrance();\n        wanderTarget.x = targetX;\n        wanderTarget.y = targetY;\n        startWander();\n        setTimeout(triggerPulse, 3000);\n        requestAnimationFrame(physicsLoop);');

// 4. Replace physicsLoop
const newPhysicsLoop = `
    const physicsLoop = () => {
        if (!isChatOpen) {
            const size = window.innerWidth < 768 ? 50 : 64;
            const padding = window.innerWidth < 768 ? 20 : 40;
            
            if (!isHovered) {
                let repX = 0, repY = 0;
                const avoidEls = document.querySelectorAll('.nav, .btn-main, .gold-btn, .price-card, .builder-quote-box, form, .hero-title, .section-heading, .project-card');
                for (let el of avoidEls) {
                    const rect = el.getBoundingClientRect();
                    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                    
                    const cx = Math.max(rect.left, Math.min(currentX + size/2, rect.right));
                    const cy = Math.max(rect.top, Math.min(currentY + size/2, rect.bottom));
                    const dist = Math.hypot(currentX + size/2 - cx, currentY + size/2 - cy);
                    
                    if (dist < 100) { 
                        const angle = Math.atan2(currentY + size/2 - cy, currentX + size/2 - cx);
                        const force = (100 - dist) * 0.05;
                        repX += Math.cos(angle) * force;
                        repY += Math.sin(angle) * force;
                    }
                }
                
                // Repulsive force from mouse
                const distMouse = Math.hypot(mouseX - (currentX + size/2), mouseY - (currentY + size/2));
                if (distMouse < 150) {
                    const angle = Math.atan2(currentY + size/2 - mouseY, currentX + size/2 - mouseX);
                    const force = (150 - distMouse) * 0.02;
                    repX += Math.cos(angle) * force;
                    repY += Math.sin(angle) * force;
                }
                
                let destX = wanderTarget.x + repX * 10;
                let destY = wanderTarget.y + repY * 10;
                
                // LERP Position
                currentX += (destX - currentX) * 0.03;
                currentY += (destY - currentY) * 0.03;
                
                // Constrain
                currentX = Math.max(padding, Math.min(window.innerWidth - size - padding, currentX));
                currentY = Math.max(padding, Math.min(window.innerHeight - size - padding, currentY));
            }
            
            const scale = pulseScale * (isHovered ? 1.05 : 1);
            
            // Add subtle floating motion (sine wave on Y)
            const floatY = Math.sin(Date.now() * 0.0015) * 8;
            
            orbWrapper.style.transform = \`translate3d(\${currentX}px, \${currentY + floatY}px, 0) scale(\${scale})\`;
            
            // Orb Rotation/Orientation LERP
            let targetRotX = (currentY - wanderTarget.y) * 0.05;
            let targetRotY = (mouseX - currentX) * 0.05;
            
            orbRotX += (targetRotX - orbRotX) * 0.1;
            orbRotY += (targetRotY - orbRotY) * 0.1;
            
            orb.style.transform = \`rotateX(\${orbRotX}deg) rotateY(\${orbRotY}deg)\`;
            
            // Breathing
            const breathe = Math.sin(Date.now() * 0.002) * 2;
            orb.style.boxShadow = \`0 \${breathe}px \${20 + breathe*2}px rgba(196, 168, 130, 0.6), 0 0 40px rgba(196, 168, 130, 0.2)\`;
        }
        
        requestAnimationFrame(physicsLoop);
    };
`;

const oldPhysicsStart = 'const physicsLoop = () => {';
const toggleChatStart = 'const toggleChat = () => {';

const prefix = js.substring(0, js.indexOf(oldPhysicsStart));
const suffix = js.substring(js.indexOf(toggleChatStart));

js = prefix + newPhysicsLoop + '\n    ' + suffix;

fs.writeFileSync('public/ai-concierge.js', js);
console.log('Updated physics loop');
