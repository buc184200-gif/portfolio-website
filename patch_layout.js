const fs = require('fs');
let code = fs.readFileSync('build_legal_pages.cjs', 'utf8');

// Replace the hardcoded content-wrap styles
const oldWrapStyle = 'padding: 100px 20px 80px; max-width: 800px; margin: 0 auto; color: var(--c-text); position: relative; z-index: 10; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-top: 40px;';
const newWrapStyle = 'padding: 140px 5% 100px; max-width: 1200px; margin: 0 auto; color: var(--c-text); position: relative; z-index: 10; width: 100%; box-sizing: border-box;';
code = code.split(oldWrapStyle).join(newWrapStyle);

// Increase h1 font size and spacing
const oldH1Style = 'text-align: left; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 10px;';
const newH1Style = 'text-align: left; font-size: clamp(2.5rem, 6vw, 4.5rem); margin-bottom: 50px; line-height: 1.1; letter-spacing: -0.02em;';
code = code.split(oldH1Style).join(newH1Style);

// Add GSAP animations script to buildPage output
const addGsap = `
    <script>
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
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: Math.min(index * 0.05, 0.5) // Cap delay
                });
            });
            
            // Smooth scroll setup
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
        });
    </script>
</body>
</html>
`;

code = code.replace('</body>\n</html>', addGsap);

fs.writeFileSync('build_legal_pages.cjs', code);
console.log("Patched layout and animations");
