const fs = require('fs');

let html = fs.readFileSync('projects.html', 'utf8');

// 1. Replace fixed pixel values and add clamp for typography
html = html.replace(/font-size: clamp\(3rem, 8vw, 7.5rem\);/g, "font-size: clamp(2.5rem, 8vw, 5rem);");
html = html.replace(/font-size: clamp\(2.5rem, 5vw, 4rem\);/g, "font-size: clamp(2rem, 5vw, 4rem);");
html = html.replace(/font-size: clamp\(1.5rem, 3vw, 2.5rem\);/g, "font-size: clamp(1.2rem, 4vw, 2.5rem);");

// Let's just do a big string replacement for the <style> tag to ensure we get it right.
let styleEnd = html.indexOf('</style>');
let styleStart = html.indexOf('<style>') + 7;
let styleContent = html.substring(styleStart, styleEnd);

// Add Navigation CSS
const navCss = `
        /* --- Navigation --- */
        .desktop-nav {
            position: fixed; top: 0; left: 0; width: 100%; padding: 2.5rem 3.5rem;
            display: flex; justify-content: space-between; align-items: center;
            z-index: 100; pointer-events: none; mix-blend-mode: difference;
        }
        .desktop-nav * { pointer-events: auto; }
        .desktop-nav .brand {
            color: var(--c-text); text-decoration: none; font-family: var(--font-serif);
            font-size: 1.5rem; cursor: none;
        }
        .desktop-nav .nav-links {
            display: flex; gap: 3rem;
        }
        .desktop-nav .nav-links a {
            color: var(--c-text); text-decoration: none; font-family: var(--font-mono);
            font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
            transition: color 0.3s; cursor: none;
        }
        .desktop-nav .nav-links a:hover { color: var(--c-accent); }

        .mobile-nav { display: none; }
        .mobile-menu { display: none; }

        .contact-links {
            display: flex; gap: 1.5rem; justify-content: center; margin-top: 2rem;
            flex-wrap: wrap;
        }
        .contact-email, .social-link {
            padding: 1.2rem 2.5rem; border: 1px solid rgba(196,168,130,0.3); border-radius: 3rem;
            color: var(--c-text); text-decoration: none; font-family: var(--font-mono); font-size: 0.9rem;
            text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s ease; cursor: none;
            min-height: 48px; display: inline-flex; align-items: center; justify-content: center;
        }
        .contact-email:hover, .social-link:hover {
            border-color: var(--c-accent); color: var(--c-accent);
        }

        @media (max-width: 1024px) {
            .desktop-nav { padding: 2rem; }
            .desktop-nav .nav-links { gap: 2rem; }
            .desktop-nav .nav-links a { font-size: 0.75rem; }
            .work-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
            .stats-grid { gap: 2rem; }
        }

        @media (max-width: 767px) {
            .desktop-nav { display: none; }
            .nav-back { display: none; }
            
            .mobile-nav {
                display: flex; position: fixed; top: 1rem; left: 1rem; right: 1rem;
                background: rgba(10, 10, 10, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.05); border-radius: 100px;
                padding: 0.8rem 1.5rem; justify-content: space-between; align-items: center;
                z-index: 101; pointer-events: auto;
            }
            .mobile-nav .brand-compact {
                color: #fff; font-family: var(--font-serif); text-decoration: none; font-size: 1.2rem;
            }
            .hamburger {
                width: 30px; height: 20px; position: relative; background: transparent; border: none; outline: none;
                display: flex; flex-direction: column; justify-content: space-between;
            }
            .hamburger span {
                width: 100%; height: 2px; background: #fff; border-radius: 2px; transition: 0.3s;
            }
            
            .mobile-menu {
                display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: rgba(3,3,3,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                z-index: 100; flex-direction: column; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none; transition: opacity 0.4s ease;
            }
            .mobile-menu.active { opacity: 1; pointer-events: auto; }
            .mobile-menu-links { display: flex; flex-direction: column; gap: 2rem; text-align: center; }
            .mobile-link {
                color: #fff; font-family: var(--font-serif); font-size: 2rem; text-decoration: none;
                transform: translateY(20px); opacity: 0; transition: all 0.4s ease;
                min-height: 48px; display: flex; align-items: center; justify-content: center;
            }
            .mobile-menu.active .mobile-link { transform: translateY(0); opacity: 1; }
            .mobile-menu.active .mobile-link:nth-child(1) { transition-delay: 0.1s; }
            .mobile-menu.active .mobile-link:nth-child(2) { transition-delay: 0.2s; }
            .mobile-menu.active .mobile-link:nth-child(3) { transition-delay: 0.3s; }
            .mobile-menu.active .mobile-link:nth-child(4) { transition-delay: 0.4s; }
            .mobile-menu.active .mobile-link:nth-child(5) { transition-delay: 0.5s; }

            .hero { padding: 0 1rem; }
            .hero-title { flex-direction: column; align-items: center; gap: 0.2rem; font-size: clamp(2.5rem, 10vw, 4rem); }
            .hero-subtitle { font-size: clamp(0.9rem, 3vw, 1.1rem); margin-top: 1rem; text-align: center; }
            
            .section { padding: 6rem 1.5rem; }
            .section-header h2 { font-size: clamp(2rem, 8vw, 2.5rem); }
            .discovery-text { font-size: clamp(1.1rem, 5vw, 1.5rem); }
            
            .work-grid { grid-template-columns: 1fr; gap: 2.5rem; }
            .work-image-container { height: 65vw; max-height: 400px; }
            .work-title { font-size: 1.5rem; }
            
            .stats-grid { flex-direction: column; gap: 3.5rem; }
            .stat-item { width: 100%; }
            .energy-ring { width: 130px; height: 130px; }
            .stat-number { font-size: 3.5rem; }

            .contact-links { flex-direction: column; gap: 1rem; width: 100%; }
            .contact-email, .social-link, .cta-button { 
                width: 100%; text-align: center; margin: 0; padding: 1.2rem; border-radius: 3rem;
                font-size: 0.9rem; justify-content: center;
            }
            .cta-button { margin-top: 2rem; }
        }
`;

// Insert new CSS before @media (max-width: 768px) {
html = html.replace('@media (max-width: 768px) {', navCss);

// Replace nav-back HTML with desktop + mobile nav
const newNavHTML = `
    <!-- Desktop Nav -->
    <nav class="desktop-nav">
        <a href="/" class="brand magnetic" data-magnetic-strength="10">Crestiva</a>
        <div class="nav-links">
            <a href="#discovery" class="magnetic" data-magnetic-strength="15">Discovery</a>
            <a href="#creativity" class="magnetic" data-magnetic-strength="15">Work</a>
            <a href="#technology" class="magnetic" data-magnetic-strength="15">Stats</a>
            <a href="#results" class="magnetic" data-magnetic-strength="15">Contact</a>
        </div>
    </nav>

    <!-- Mobile Nav -->
    <nav class="mobile-nav">
        <a href="/" class="brand-compact">Crestiva</a>
        <button class="hamburger" id="mobile-menu-btn" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-menu-links">
            <a href="#discovery" class="mobile-link">Discovery</a>
            <a href="#creativity" class="mobile-link">Work</a>
            <a href="#technology" class="mobile-link">Stats</a>
            <a href="#results" class="mobile-link">Contact</a>
            <a href="/see-more.html" class="mobile-link back-link" style="font-family: var(--font-mono); font-size: 1rem; color: var(--c-accent); margin-top: 2rem;">← Return</a>
        </div>
    </div>
`;

html = html.replace('<a href="/see-more.html" class="nav-back magnetic" data-magnetic-strength="20">Return</a>', newNavHTML);

// Replace Results section content to include contact links
const oldResultsHTML = `
                <a href="https://wa.me/917037311050" target="_blank" class="cta-button magnetic" data-magnetic-strength="40">Start a Project</a>
            </div>
        </section>`;

const newResultsHTML = `
                <a href="https://wa.me/917037311050" target="_blank" class="cta-button magnetic" data-magnetic-strength="40">Start a Project</a>
                <div class="contact-links">
                    <a href="mailto:hello@crestiva.com" class="contact-email magnetic" data-magnetic-strength="20">hello@crestiva.com</a>
                    <a href="https://www.instagram.com/crestiva_web_studio" target="_blank" class="social-link magnetic" data-magnetic-strength="20">Instagram</a>
                    <a href="#" class="social-link magnetic" data-magnetic-strength="20">LinkedIn</a>
                </div>
            </div>
        </section>`;

html = html.replace(oldResultsHTML, newResultsHTML);

// Add JS for mobile menu and optimizing performance
const jsAdditions = `
        // --- Mobile Menu ---
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                if (mobileMenu.classList.contains('active')) {
                    spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
            document.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.click();
                });
            });
        }
`;

html = html.replace('// --- 2. Canvas Background ---', jsAdditions + '\n        // --- 2. Canvas Background ---');

// Disable heavy particles and effects on mobile
const canvasMod1 = `
        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars.length = 0;
            const isMobile = window.innerWidth < 768;
            const numStars = isMobile ? 15 : 50; // Reduce stars on mobile
            for (let i = 0; i < numStars; i++) {
`;
html = html.replace(/function initCanvas\(\) \{[\s\S]*?for \(let i = 0; i < 50; i\+\+\) \{/, canvasMod1);

const drawCanvasMod = `
            // Vortex Rings
            ctx.save();
            ctx.translate(cx, cy);
            const maxRadius = Math.max(width, height) * 0.8;
            const isMobile = window.innerWidth < 768;
            const numRings = isMobile ? 4 : 7; // Reduce rings on mobile
            for (let i = 0; i < numRings; i++) {
`;
html = html.replace(/\/\/ Vortex Rings\s*ctx\.save\(\);\s*ctx\.translate\(cx, cy\);\s*const maxRadius = Math\.max\(width, height\) \* 0\.8;\s*const numRings = 7;\s*for \(let i = 0; i < numRings; i\+\+\) \{/, drawCanvasMod);

fs.writeFileSync('projects.html', html);
console.log('projects.html updated!');
