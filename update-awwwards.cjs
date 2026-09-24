const fs = require('fs');
let js = fs.readFileSync('src/awwwards.js', 'utf8');

// Replace the old initScrollAnimations function with a new one
const oldScrollStart = "    // GSAP Scroll Animations\n    function initScrollAnimations() {";
const splitStr = js.split(oldScrollStart);
let newJs = splitStr[0];

const newScrollAnimations = `    // GSAP Scroll Animations
    function initScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // 1. Luxury Text Animations (Split Type)
        if (typeof SplitType !== 'undefined') {
            const headings = document.querySelectorAll('h1, h2.section-heading, .reveal-text');
            headings.forEach(heading => {
                const split = new SplitType(heading, { types: 'lines, words, chars', lineClass: 'split-line', wordClass: 'split-word', charClass: 'split-char' });
                
                // Set initial state
                gsap.set(split.words, { y: 30, opacity: 0 });
                
                // Animate word by word
                gsap.to(split.words, {
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 90%",
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    stagger: 0.04,
                    ease: "power4.out" // Luxury cubic bezier
                });
            });
        }

        // 2. Premium Section Reveal (Fade + slight upward)
        const fadeSections = document.querySelectorAll('.fade-in-section, .info-block');
        fadeSections.forEach((section) => {
            gsap.set(section, { y: 60, opacity: 0 });
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out"
            });
        });

        // 3. Package Card Entrance (Staggered, spring effect)
        const priceCards = document.querySelectorAll('#pricing .price-card');
        if (priceCards.length) {
            gsap.set(priceCards, { y: 100, opacity: 0 });
            ScrollTrigger.create({
                trigger: "#pricing",
                start: "top 80%",
                onEnter: () => {
                    gsap.to(priceCards, {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.15,
                        ease: "back.out(1.2)" // Slight spring
                    });
                    
                    // Number counter animation on prices
                    priceCards.forEach(card => {
                        const priceEl = card.querySelector('.plan-price');
                        if (priceEl) {
                            // Simple text reveal logic for prices
                            const text = priceEl.innerHTML;
                            gsap.fromTo(priceEl, 
                                { opacity: 0, scale: 0.9 }, 
                                { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: "power2.out" }
                            );
                        }
                    });
                }
            });
        }
        
        // 4. Advanced Hover on Cards (3D + Light)
        const cards = document.querySelectorAll('.price-card, .service-card, .feat-card');
        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                
                // Micro Parallax Tilt
                const tiltX = (cy - y) / cy * 4; 
                const tiltY = (x - cx) / cx * 4;
                
                gsap.to(card, {
                    rotateX: tiltX,
                    rotateY: tiltY,
                    duration: 0.4,
                    ease: "power2.out",
                    transformPerspective: 1000
                });
                
                // Dynamic border/light glow
                card.style.setProperty('--mouse-x', \`\${x}px\`);
                card.style.setProperty('--mouse-y', \`\${y}px\`);
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.7,
                    ease: "power3.out"
                });
            });
        });
        
        // 5. Luxury Dividers (Draw line)
        const dividers = document.querySelectorAll('.luxury-divider');
        dividers.forEach(div => {
            gsap.to(div, {
                scrollTrigger: {
                    trigger: div,
                    start: "top 95%"
                },
                scaleX: 1,
                opacity: 1,
                duration: 1.5,
                ease: "power3.inOut"
            });
        });

        // 6. Smooth Section Transition Background Color
        const sections = document.querySelectorAll('section');
        sections.forEach((sec, i) => {
            ScrollTrigger.create({
                trigger: sec,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => {
                    gsap.to('body', { backgroundColor: i % 2 === 0 ? '#0e0e0e' : '#141414', duration: 1.5 });
                },
                onEnterBack: () => {
                    gsap.to('body', { backgroundColor: i % 2 === 0 ? '#0e0e0e' : '#141414', duration: 1.5 });
                }
            });
        });
        
        // Premium Cursor Follower Light
        const cursorLight = document.getElementById('cursor-light');
        if (cursorLight) {
            let clx = window.innerWidth / 2;
            let cly = window.innerHeight / 2;
            
            gsap.ticker.add(() => {
                // Read global mouseX and mouseY (they are updated in awwwards.js mousemove)
                // We'll just hook into the existing render loop or do it here
                if(window.mouseX !== undefined && window.mouseY !== undefined) {
                    clx += (window.mouseX - clx) * 0.08;
                    cly += (window.mouseY - cly) * 0.08;
                    cursorLight.style.transform = \`translate(-50%, -50%) translate3d(\${clx}px, \${cly}px, 0)\`;
                }
            });
            
            window.addEventListener('mousemove', (e) => {
                window.mouseX = e.clientX;
                window.mouseY = e.clientY;
            });
        }
    }
});
`;

newJs += newScrollAnimations;
fs.writeFileSync('src/awwwards.js', newJs);
console.log('Updated awwwards.js with luxury scroll animations');
