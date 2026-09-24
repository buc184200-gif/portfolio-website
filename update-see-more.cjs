const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// 1. Mobile CSS for see-more.html
const mobileCSS = `
        /* --- Responsive Redesign Optimization --- */
        * { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 1024px) {
            .hero-title { font-size: clamp(3rem, 6vw, 4.5rem); }
            .section { padding: 80px 30px; }
            .pricing-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 767px) {
            /* Mobile Navigation */
            .nav {
                top: 15px; padding: 12px 20px; width: calc(100% - 30px); left: 15px; right: 15px;
                background: rgba(10, 15, 10, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(140, 180, 120, 0.1); border-radius: 100px;
                flex-direction: row; justify-content: space-between; align-items: center;
            }
            .nav-brand { font-size: 20px; text-decoration: none; }
            
            .nav-hamburger {
                display: flex; flex-direction: column; justify-content: space-between;
                width: 30px; height: 20px; background: transparent; border: none; z-index: 101; cursor: pointer;
            }
            .nav-hamburger span {
                width: 100%; height: 2px; background: var(--c-text); border-radius: 2px; transition: 0.3s;
            }

            .nav-links {
                position: absolute; top: 60px; left: 0; width: 100%;
                background: rgba(15, 20, 15, 0.95); border-radius: 20px; padding: 30px 20px;
                flex-direction: column; gap: 15px; align-items: center;
                transform: translateY(-20px); opacity: 0; visibility: hidden;
                transition: all 0.4s ease; border: 1px solid rgba(140, 180, 120, 0.1);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            .nav-links.open { transform: translateY(0); opacity: 1; visibility: visible; }
            .nav-link {
                width: 100%; text-align: center; padding: 15px; background: rgba(255,255,255,0.05);
                border-radius: 12px; font-size: 1rem;
                min-height: 48px; display: flex; align-items: center; justify-content: center;
            }
            .nav-idx { display: none; }

            /* Hero */
            .hero { padding: 100px 20px 60px; text-align: center; }
            .hero-title { font-size: clamp(2.5rem, 8vw, 5rem); }
            .hero-subtitle { font-size: clamp(1rem, 3vw, 1.4rem); margin: 20px auto 0; }
            .hero-metrics { flex-direction: column; gap: 20px; }

            /* Sections */
            .section { padding: 60px 20px; }
            .section-heading { font-size: clamp(2rem, 8vw, 3rem); text-align: center; }
            
            /* Projects */
            .project-row { flex-direction: column; gap: 20px; }
            .project-img { height: 60vw; max-height: 300px; }
            
            /* Pricing */
            .pricing-grid { grid-template-columns: 1fr; gap: 30px; }
            .plan-card { padding: 30px 20px; }
            .plan-btn { width: 100%; min-height: 48px; padding: 15px; text-align: center; justify-content: center; display: flex; }
            
            /* Footer */
            .footer { flex-direction: column; gap: 30px; text-align: center; padding: 40px 20px; }
            .footer-left, .footer-right { align-items: center; justify-content: center; width: 100%; }
        }
`;
html = html.replace('</style>', mobileCSS + '\n    </style>');

// Enhance nav with hamburger
const newNavHTML = `
            <nav class="nav">
                <a href="/" class="nav-brand">Crestiva</a>
                <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu" style="display: none;">
                    <span></span><span></span><span></span>
                </button>
                <div class="nav-links" id="nav-links">
                    <a href="/projects.html" class="nav-link"><span class="nav-idx">01</span>Projects</a>
                    <a href="#pricing" class="nav-link"><span class="nav-idx">02</span>Pricing</a>
                    <a href="#about" class="nav-link"><span class="nav-idx">03</span>About</a>
                    <a href="https://wa.me/917037311050" class="nav-link" target="_blank"><span class="nav-idx">04</span>Inquire</a>
                </div>
            </nav>
`;
html = html.replace(/<nav class="nav">[\s\S]*?<\/nav>/, newNavHTML);

// Enhance nav css for hamburger to be hidden on desktop
const navHamburgerCSS = `
        @media (min-width: 768px) {
            .nav-hamburger { display: none !important; }
        }
`;
html = html.replace('</style>', navHamburgerCSS + '\n    </style>');

// Add JS for hamburger
const jsAdditions = `
        const navHamburger = document.getElementById('nav-hamburger');
        const navLinks = document.getElementById('nav-links');
        if(navHamburger && window.innerWidth < 768) {
            navHamburger.style.display = 'flex';
            navHamburger.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                const spans = navHamburger.querySelectorAll('span');
                if (navLinks.classList.contains('open')) {
                    spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
            document.querySelectorAll('.nav-link').forEach(l => {
                l.addEventListener('click', () => {
                    if (window.innerWidth < 768) navHamburger.click();
                });
            });
        }
`;
html = html.replace('// Cursor', jsAdditions + '\n        // Cursor');

// Enhance Lazy Loading
html = html.replace(/<img /g, '<img loading="lazy" decoding="async" ');

fs.writeFileSync('see-more.html', html);
console.log('see-more.html updated!');
