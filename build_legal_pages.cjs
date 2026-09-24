const fs = require('fs');

let headHtml = fs.readFileSync('head.html', 'utf8');

function buildHead(title, url) {
    let customized = headHtml;
    customized = customized.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    customized = customized.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
    customized = customized.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
    return customized;
}

const navHtml = `
    <nav class="nav" style="position: sticky; top: 0; z-index: 100; background: rgba(15, 20, 15, 0.95); border-bottom: 1px solid rgba(140, 180, 120, 0.1);">
        <a href="/" class="nav-brand-link" title="Crestiva Web Studio">
            <img src="/crestiva-logo.svg" alt="Crestiva Web Studio Logo" class="nav-brand-img" referrerPolicy="no-referrer" />
            <span class="nav-brand-text">Crestiva</span>
        </a>
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu" style="display: none;">
            <span></span><span></span><span></span>
        </button>
        <div class="nav-links" id="nav-links">
            <a href="/see-more#pricing" class="nav-link"><span class="nav-idx">01</span>Pricing</a>
            <a href="/see-more#about" class="nav-link"><span class="nav-idx">02</span>About</a>
            <a href="https://wa.me/917037311050" class="nav-link" ><span class="nav-idx">03</span>Inquire</a>
            <a href="/privacy-policy" class="nav-link"><span class="nav-idx">04</span>Privacy Policy</a>
            <a href="/terms" class="nav-link"><span class="nav-idx">05</span>Terms</a>
        </div>
        
`;

const termsContent = `
    <div class="content-wrap" style="display: block; padding: 40px 5% 80px; max-width: 1200px; margin: 0 auto; color: var(--c-text); position: relative; z-index: 10; width: 100%; box-sizing: border-box;">
        <h1 class="section-heading" style="text-align: left; font-size: clamp(2.5rem, 6vw, 4.5rem); margin-bottom: 30px; line-height: 1.1; letter-spacing: -0.02em;">Crestiva Web Studio Terms of Service</h1>
        
        
        <div class="legal-text" style="font-family: var(--font-sans); line-height: 1.8; opacity: 0.85; font-size: 1.05rem;">
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">1. Introduction</h2>
            <p style="margin-bottom: 25px;">By accessing and using the Crestiva Web Studio website and services, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">2. Services and Deliverables</h2>
            <p style="margin-bottom: 25px;">Crestiva Web Studio provides custom web design, development, and optimization services. Project scope, timelines, and deliverables will be formally agreed upon in writing prior to project commencement.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">3. Project Scope and Timelines</h2>
            <p style="margin-bottom: 25px;">We strive to deliver projects within the agreed-upon timeframe. However, timelines are contingent upon the client's timely submission of required materials and approvals. Any changes to the scope may affect delivery dates.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">4. Payment Terms</h2>
            <p style="margin-bottom: 25px;">A 25% advance payment may be required before work begins on applicable projects and services. Client payment arrangements are coordinated directly with the client and are not processed through a website payment gateway. The remaining balance is handled according to the individual client or project agreement.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">5. Client Responsibilities</h2>
            <p style="margin-bottom: 25px;">Clients are responsible for providing accurate information, content, assets, approvals, credentials, and other materials reasonably required to complete their project in a timely manner.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">6. Cancellation and Refund Policy</h2>
            <ul style="margin-bottom: 25px; padding-left: 20px; list-style-type: disc; line-height: 1.8;">
                <li style="margin-bottom: 10px;">A 25% advance payment is required before work begins for applicable website plans/services.</li>
                <li style="margin-bottom: 10px;">Once the project has been approved and work has begun, the advance payment is non-refundable.</li>
                <li style="margin-bottom: 10px;">Payments made for completed work, approved deliverables, or services already provided are non-refundable.</li>
                <li style="margin-bottom: 10px;">The client should review and approve the project scope, requirements, and payment terms before work begins.</li>
                <li style="margin-bottom: 10px;">Any exceptions to the no-refund policy may only be made at the sole discretion of Crestiva Web Studio and must be agreed upon in writing.</li>
            </ul>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">7. Revisions and Changes</h2>
            <p style="margin-bottom: 25px;">Project agreements typically include a specified number of revision rounds. Additional revisions, scope additions, or major design/functionality alterations requested outside the original written agreement are handled through a separate fixed additional quote agreed upon with the client before execution.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">8. Intellectual Property</h2>
            <p style="margin-bottom: 25px;">Upon full payment, ownership of the final client deliverables transfers according to the agreed project terms. However, this transfer does not include third-party assets, open-source libraries, pre-existing Crestiva components, reusable internal tools, and other materials Crestiva does not exclusively own. Unless a client agreement specifically states otherwise, Crestiva retains the right to showcase completed work in its portfolio and marketing materials.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">9. Third-Party Services</h2>
            <p style="margin-bottom: 25px;">Client projects may incorporate third-party services, APIs, hosting providers, or platforms (such as domain registrars, external hosting environments, or communication APIs). Clients are subject to the independent terms and conditions of those external providers. Crestiva Web Studio is not liable for changes, outages, or policies enacted by third-party services.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">10. Website Availability</h2>
            <p style="margin-bottom: 25px;">We cannot guarantee that our website or the websites we host/deploy for you will be continuously available or uninterrupted. We are not liable for downtime caused by external hosting providers or uncontrollable circumstances.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">11. Limitation of Liability</h2>
            <p style="margin-bottom: 25px;">Crestiva Web Studio shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services, websites, or associated third-party tools.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">12. Changes to These Terms</h2>
            <p style="margin-bottom: 25px;">We reserve the right to modify these Terms of Service at any time. Continued use of our services after such changes constitutes your acceptance of the revised terms.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">13. Contact Us</h2>
            <p style="margin-bottom: 25px;">If you have any questions or concerns about these Terms, please contact us at: <strong>crestivawebstudio@gmail.com</strong></p>

        </div>
    </div>
`;

const footerHtml = `
    <div class="footer" style="padding: 40px 20px; border-top: 1px solid rgba(140, 180, 120, 0.1); text-align: center; margin-top: 40px; background: rgba(15, 20, 15, 0.95); position: relative; z-index: 10;">
        <div class="footer-left" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <p style="font-family: var(--font-mono); font-size: 0.55rem; color: var(--c-text-dim); letter-spacing: 0.08em; line-height: 1.8; margin-bottom: 10px;">
                Somewhere between math & magic<br>
                © 2026 Crestiva Web Studio | Founders: Khushwant Singh & Sarthak Sengar<br>
                <a href="https://www.instagram.com/crestiva_web_studio" target="_blank" class="instagram-pop">@crestiva_web_studio</a>
            </p>
            <div class="legal-links" style="display: flex; gap: 15px; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; color: var(--c-text-dim); justify-content: center;">
                <a href="/privacy-policy" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Privacy Policy</a>
                <a href="/terms" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Terms of Service</a>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.getElementById('nav-hamburger');
            const navLinks = document.getElementById('nav-links');
            if(hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    navLinks.classList.toggle('open');
                });
            }
        });
    </script>

    <script>
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
    </script>
`;

function buildPage(title, url, content) {
    return buildHead(title, url) + '\n<body class="cinematic-entrance" style="overflow-x: hidden;">\n' + 
        '    <div class="ambient-light light-1"></div>\n' +
        '    <div class="ambient-light light-2"></div>\n' +
        '    <div id="three-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;"></div>\n' +
        '    <div class="layer-blur"></div>\n' +
        '    <div class="grain-overlay"></div>\n' +
        '    <div class="ui-layer" style="position: relative; z-index: 5;">\n' +
        navHtml + content + footerHtml + '</div>\n' +
        '    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n' +
        '    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n' +
        '    <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>\n' +
        '    <script type="module" src="/shared-bg.js"></script>\n' +
        '</body>\n' +
        '</html>\n';
}

fs.writeFileSync('privacy-policy.html', buildPage("Privacy Policy | Crestiva Web Studio", "https://crestivawebstudio.online/privacy-policy", privacyContent));
fs.writeFileSync('terms.html', buildPage("Terms of Service | Crestiva Web Studio", "https://crestivawebstudio.online/terms", termsContent));

console.log("Successfully generated standalone privacy-policy.html and terms.html");
