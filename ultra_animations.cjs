const fs = require('fs');

let code = fs.readFileSync('build_legal_pages.cjs', 'utf8');

const regex = /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => {\s*gsap\.registerPlugin[\s\S]*?<\/script>/;

const enhancedScript = `<script>
        document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero entrance with SplitType for fluid word-by-word reveal
            if (typeof SplitType !== 'undefined') {
                const text = new SplitType('.section-heading', { types: 'lines, words' });
                gsap.from(text.words, {
                    y: 60,
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 1.4,
                    stagger: 0.05,
                    ease: "expo.out",
                    delay: 0.1
                });
            } else {
                gsap.from(".section-heading", {
                    y: 60, opacity: 0, filter: "blur(10px)", duration: 1.6, ease: "expo.out", delay: 0.1
                });
            }
            
            // Premium initial state with subtle blur and scale
            gsap.set('.legal-text > *', { y: 50, opacity: 0, filter: "blur(12px)", scale: 0.98 });
            
            // Staggered fluid scrolling
            ScrollTrigger.batch('.legal-text > *', {
                start: "top 85%",
                onEnter: batch => gsap.to(batch, {
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)",
                    scale: 1,
                    stagger: 0.12, 
                    duration: 1.5, 
                    ease: "expo.out", 
                    overwrite: true
                }),
                onLeaveBack: batch => gsap.to(batch, {
                    opacity: 0, 
                    y: 30, 
                    filter: "blur(8px)",
                    scale: 0.98,
                    duration: 0.8, 
                    ease: "power2.inOut", 
                    overwrite: true
                })
            });
            
            // Smooth scroll setup
            if (typeof Lenis !== 'undefined') {
                const lenis = new Lenis({
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                    wheelMultiplier: 1.2
                });
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }
        });
    </script>`;

code = code.replace(regex, enhancedScript);
fs.writeFileSync('build_legal_pages.cjs', code);
console.log("Ultra animations injected");
