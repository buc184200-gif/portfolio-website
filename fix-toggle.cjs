const fs = require('fs');
let js = fs.readFileSync('public/ai-concierge.js', 'utf8');

// We want to replace toggleChat to manage pulseScale properly
const newToggle = `
    const toggleChat = () => {
        isChatOpen = !isChatOpen;
        
        if (isChatOpen) {
            suggestionBubble.classList.remove('visible');
            
            const pWidth = window.innerWidth < 768 ? window.innerWidth - 40 : 380;
            const pHeight = window.innerWidth < 768 ? 450 : 550;
            const pX = window.innerWidth / 2 - pWidth / 2;
            const pY = window.innerHeight / 2 - pHeight / 2;

            if (window.gsap) {
                // Animate Panel appearing from Orb position
                gsap.set(chatPanel, { x: currentX, y: currentY, scale: 0.2, opacity: 0 });
                chatPanel.classList.add('active');
                
                gsap.to(chatPanel, {
                    x: window.innerWidth < 768 ? 20 : window.innerWidth - pWidth - 40,
                    y: window.innerWidth < 768 ? 20 : window.innerHeight - pHeight - 40,
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "expo.out"
                });
                
                // Hide Orb (let physics loop stop rendering)
                gsap.to(orbWrapper, {
                    opacity: 0,
                    duration: 0.2
                });
                // We'll manage scale manually when it re-opens
            } else {
                chatPanel.classList.add('active');
                chatPanel.style.transform = \`translate3d(\${window.innerWidth < 768 ? 20 : window.innerWidth - pWidth - 40}px, \${window.innerWidth < 768 ? 20 : window.innerHeight - pHeight - 40}px, 0)\`;
                orbWrapper.style.opacity = '0';
            }

            setTimeout(() => inputField.focus(), 600);
            
        } else {
            chatPanel.classList.remove('active');
            
            if (window.gsap) {
                // Hide panel back to currentX/Y
                gsap.to(chatPanel, {
                    x: currentX,
                    y: currentY,
                    scale: 0.2,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in"
                });
                
                // Bring Orb back manually using pulseScale
                pulseScale = 0;
                gsap.to(orbWrapper, {
                    opacity: 1,
                    duration: 0.2,
                    delay: 0.2
                });
                
                let obj = { s: 0 };
                gsap.to(obj, {
                    s: 1,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "elastic.out(1, 0.5)",
                    onUpdate: () => { pulseScale = obj.s; }
                });
            } else {
                orbWrapper.style.opacity = '1';
            }
        }
    };
`;

js = js.replace(/const toggleChat = \(\) => \{[\s\S]*?const addMessage = \(/, newToggle + '\n    const addMessage = (');

fs.writeFileSync('public/ai-concierge.js', js);
console.log('Fixed toggle chat');
