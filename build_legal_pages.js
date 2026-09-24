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
        <div class="auth-container" id="authContainer">
            <button class="auth-btn magnetic" data-magnetic-strength="10" onclick="window.location.href='/see-more'">Sign In</button>
            <button class="auth-btn primary magnetic" data-magnetic-strength="10" onclick="window.location.href='/see-more'">Sign Up</button>
        </div>
    </nav>
`;

const privacyContent = `
    <div class="content-wrap" style="padding: 100px 20px 80px; max-width: 800px; margin: 0 auto; color: var(--c-text); position: relative; z-index: 10; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-top: 40px;">
        <h1 class="section-heading" style="text-align: left; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 10px;">Crestiva Web Studio Privacy Policy</h1>
        <p style="opacity: 0.6; margin-bottom: 50px; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.05em;">Last Updated: August 19, 2026</p>
        
        <div class="legal-text" style="font-family: var(--font-sans); line-height: 1.8; opacity: 0.85; font-size: 1.05rem;">
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">1. Introduction</h2>
            <p style="margin-bottom: 25px;">Welcome to Crestiva Web Studio. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">2. Information We Collect</h2>
            <p style="margin-bottom: 25px;">We collect information you provide directly to us, such as your name, email address, phone number, and project details when you request a quote or contact us.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">3. How We Use Your Information</h2>
            <p style="margin-bottom: 25px;">We use your information to communicate with you about your projects, provide our services, and send important updates related to your web development plans.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">4. Contact Forms and Communications</h2>
            <p style="margin-bottom: 25px;">When you use our contact forms or reach out via email/WhatsApp, we store your contact details securely in order to respond to your inquiries and support your project effectively.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">5. Payment Information</h2>
            <p style="margin-bottom: 25px;">Crestiva requires a 25% advance payment when a customer purchases an applicable website plan/service. Razorpay is intended to be used as the payment processor. The current integration uses Razorpay TEST MODE for development/testing. Live payment processing will be enabled after the production backend is implemented. When live payments are enabled, Razorpay will process payment transactions through its payment infrastructure. Crestiva does not claim to store sensitive payment credentials such as complete card numbers, CVVs, UPI PINs, or banking passwords.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">6. Third-Party Services</h2>
            <p style="margin-bottom: 25px;">Our website uses third-party services like Supabase for database storage and authentication, and Razorpay for payment processing (currently in test mode). These services have their own privacy policies governing their data handling practices. Firebase is also configured for applet infrastructure.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">7. Cookies and Tracking</h2>
            <p style="margin-bottom: 25px;">We may use essential session data to maintain your login state and preferences. We do not implement invasive third-party tracking cookies.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">8. Local Storage / Session Data</h2>
            <p style="margin-bottom: 25px;">We use standard browser local storage and session data to manage your user session and save custom quote configurations during your active visit.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">9. Data Sharing</h2>
            <p style="margin-bottom: 25px;">We do not sell, rent, or trade your personal data to any third parties for marketing purposes. Your data is strictly shared with the necessary third-party infrastructure (e.g., Supabase, Firebase, Razorpay) required to deliver our service.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">10. Data Security</h2>
            <p style="margin-bottom: 25px;">We implement standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">11. Data Retention</h2>
            <p style="margin-bottom: 25px;">We retain your data only for as long as is necessary to provide you with our services, fulfill project agreements, and comply with our legal obligations.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">12. User Rights</h2>
            <p style="margin-bottom: 25px;">You have the right to access, update, or delete your personal information stored with us. Contact us to exercise these rights.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">13. Children's Privacy</h2>
            <p style="margin-bottom: 25px;">Our services are not directed to individuals under the age of 18, and we do not knowingly collect personal information from children.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">14. Changes to This Privacy Policy</h2>
            <p style="margin-bottom: 25px;">We may update this policy periodically. We will post any changes on this page, and your continued use of our services indicates acceptance of the updated policy.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">15. Contact Us</h2>
            <p style="margin-bottom: 25px;">If you have questions about this Privacy Policy, please contact us at: <strong>crestivawebstudio@gmail.com</strong></p>
        </div>
    </div>
`;

const termsContent = `
    <div class="content-wrap" style="padding: 100px 20px 80px; max-width: 800px; margin: 0 auto; color: var(--c-text); position: relative; z-index: 10; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-top: 40px;">
        <h1 class="section-heading" style="text-align: left; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 10px;">Crestiva Web Studio Terms of Service</h1>
        <p style="opacity: 0.6; margin-bottom: 50px; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.05em;">Last Updated: August 19, 2026</p>
        
        <div class="legal-text" style="font-family: var(--font-sans); line-height: 1.8; opacity: 0.85; font-size: 1.05rem;">
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">1. Introduction</h2>
            <p style="margin-bottom: 25px;">By accessing and using the Crestiva Web Studio website and services, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">2. Services and Deliverables</h2>
            <p style="margin-bottom: 25px;">Crestiva Web Studio provides custom web design, development, and optimization services. Project scope, timelines, and deliverables will be formally agreed upon in writing prior to project commencement.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">3. Project Scope and Timelines</h2>
            <p style="margin-bottom: 25px;">We strive to deliver projects within the agreed-upon timeframe. However, timelines are contingent upon the client's timely submission of required materials and approvals. Any changes to the scope may affect delivery dates.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">4. Payment Terms</h2>
            <p style="margin-bottom: 25px;">A 25% advance payment is required before work begins for applicable website plans/services. The remaining balance is handled according to the agreed project terms. Official payment agreements will be coordinated securely.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">5. Client Responsibilities</h2>
            <p style="margin-bottom: 25px;">Clients are responsible for providing accurate information, content, assets, approvals, credentials, and other materials reasonably required to complete their project in a timely manner.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">6. Revisions and Changes</h2>
            <p style="margin-bottom: 25px;">Project agreements typically include a specified number of revision rounds. Additional revisions or significant changes outside the original scope will be billed at an agreed-upon hourly rate.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">7. Cancellation and Refunds</h2>
            <p style="margin-bottom: 25px;">Applicable cancellation/refund terms may be governed by the applicable project agreement between Crestiva Web Studio and the client.</p>

            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">8. Intellectual Property</h2>
            <p style="margin-bottom: 25px;">Upon full payment, ownership of the final client deliverables transfers according to the agreed project terms. However, this transfer does not include third-party assets, open-source libraries, pre-existing Crestiva components, reusable internal tools, and other materials Crestiva does not exclusively own. Unless a client agreement specifically states otherwise, Crestiva retains the right to showcase completed work in its portfolio and marketing materials.</p>
            
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">9. Third-Party Services</h2>
            <p style="margin-bottom: 25px;">Our projects may incorporate third-party services such as Supabase, Razorpay, WhatsApp integrations, and various Email APIs. You agree to be bound by the terms and conditions of these third-party providers when utilizing their tools through our deliverables.</p>

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
</body>
</html>
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
        '    <script type="module" src="/shared-bg.js"></script>\n';
}

fs.writeFileSync('privacy-policy.html', buildPage("Privacy Policy | Crestiva Web Studio", "https://crestivawebstudio.online/privacy-policy", privacyContent));
fs.writeFileSync('terms.html', buildPage("Terms of Service | Crestiva Web Studio", "https://crestivawebstudio.online/terms", termsContent));

console.log("Successfully generated standalone privacy-policy.html and terms.html");
