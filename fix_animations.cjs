const fs = require('fs');
let code = fs.readFileSync('build_legal_pages.cjs', 'utf8');

const oldScript = `    <script>
        document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero entrance
            gsap.from(".section-heading", {
                y: 50, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1
            });
            
            // Staggered text blocks
            const elements = gsap.utils.toArray('.legal-text h2, .legal-text p, .legal-text ul');
            elements.forEach((el, index) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 98%",
                        toggleActions: "play none none reverse"
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
            
            // Smooth scroll setup
            if (typeof Lenis !== 'undefined') {
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                });
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }
        });
    </script>`;

const newScript = `    <script>
        document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero entrance
            gsap.from(".section-heading", {
                y: 60, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.1
            });
            
            // Set initial state for all legal text blocks
            gsap.set('.legal-text > *', { y: 40, opacity: 0 });
            
            // Staggered text blocks using ScrollTrigger.batch for fluid grouped animations
            ScrollTrigger.batch('.legal-text > *', {
                start: "top 90%",
                onEnter: batch => gsap.to(batch, {
                    opacity: 1, 
                    y: 0, 
                    stagger: 0.15, 
                    duration: 1.4, 
                    ease: "power3.out", 
                    overwrite: true
                }),
                onLeaveBack: batch => gsap.to(batch, {
                    opacity: 0, 
                    y: 40, 
                    duration: 0.8, 
                    ease: "power2.in", 
                    overwrite: true
                })
            });
            
            // Smooth scroll setup (fluid and premium)
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

if(code.includes(oldScript)) {
    code = code.replace(oldScript, newScript);
    fs.writeFileSync('build_legal_pages.cjs', code);
    console.log("Animations enhanced successfully.");
} else {
    console.log("Could not find the target script to replace. Let's do a more robust regex replacement.");
    
    // Robust replacement targeting the GSAP script block
    const scriptRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/g;
    code = code.replace(scriptRegex, newScript);
    fs.writeFileSync('build_legal_pages.cjs', code);
    console.log("Animations enhanced using regex replacement.");
}
