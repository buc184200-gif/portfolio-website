const fs = require('fs');

let header = fs.readFileSync('header.html', 'utf8');
let footer = fs.readFileSync('footer.html', 'utf8');

const privacyContent = `
            <div class="content-wrap" style="padding: 150px 20px 80px; max-width: 800px; margin: 0 auto; color: var(--c-text);">
                <h1 class="section-heading" style="text-align: left; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 10px;">Crestiva Web Studio Privacy Policy</h1>
                <p style="opacity: 0.6; margin-bottom: 50px; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.05em;">Last Updated: August 19, 2026</p>
                
                <div class="legal-text" style="font-family: var(--font-sans); line-height: 1.8; opacity: 0.85; font-size: 1.05rem;">
                    <p style="margin-bottom: 25px;">At Crestiva Web Studio, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">1. Information We Collect</h2>
                    <p style="margin-bottom: 25px;">We collect information you provide directly to us, such as your name, email address, phone number, and project details when you request a quote or contact us. We also collect usage data through cookies to improve our services.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">2. How We Use Your Information</h2>
                    <p style="margin-bottom: 25px;">We use your information to communicate with you about your projects, provide our services, process payments (via Razorpay test mode), and send important updates. We do not sell your personal data to third parties.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">3. Data Security</h2>
                    <p style="margin-bottom: 25px;">We implement standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">4. Third-Party Services</h2>
                    <p style="margin-bottom: 25px;">Our website uses third-party services like Firebase for database storage and Razorpay for payment processing. These services have their own privacy policies governing data handling.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">5. Contact Us</h2>
                    <p style="margin-bottom: 25px;">If you have questions about this Privacy Policy, please contact us at: <strong>crestivawebstudio@gmail.com</strong></p>
                </div>
            </div>
`;

const termsContent = `
            <div class="content-wrap" style="padding: 150px 20px 80px; max-width: 800px; margin: 0 auto; color: var(--c-text);">
                <h1 class="section-heading" style="text-align: left; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 10px;">Crestiva Web Studio Terms of Service</h1>
                <p style="opacity: 0.6; margin-bottom: 50px; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.05em;">Last Updated: August 19, 2026</p>
                
                <div class="legal-text" style="font-family: var(--font-sans); line-height: 1.8; opacity: 0.85; font-size: 1.05rem;">
                    <p style="margin-bottom: 25px;">By accessing and using the Crestiva Web Studio website and services, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">1. Services and Deliverables</h2>
                    <p style="margin-bottom: 25px;">Crestiva Web Studio provides custom web design and development services. Project scope, timelines, and deliverables will be agreed upon in writing prior to project commencement.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">2. Payment Terms</h2>
                    <p style="margin-bottom: 25px;">Payments are processed securely via our integrated payment gateways. A deposit is typically required before work begins, with the balance due upon project completion. Currently, our system utilizes Razorpay in test mode for demonstration purposes.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">3. Intellectual Property</h2>
                    <p style="margin-bottom: 25px;">Upon full payment, the client retains ownership of the final website design and content. Crestiva Web Studio retains the right to display the completed project in our portfolio and marketing materials.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">4. Limitation of Liability</h2>
                    <p style="margin-bottom: 25px;">Crestiva Web Studio shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services or website.</p>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--c-highlight); margin: 40px 0 20px;">5. Revisions and Amendments</h2>
                    <p style="margin-bottom: 25px;">We reserve the right to modify these Terms of Service at any time. Continued use of our services constitutes acceptance of the revised terms.</p>
                </div>
            </div>
`;

// Helper to replace title and canonical
function customizeHeader(html, title, url) {
    let customized = html;
    
    // Replace Title
    customized = customized.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    
    // Replace OG Title
    customized = customized.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
    
    // Replace Canonical
    customized = customized.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
    
    return customized;
}

let privacyHeader = customizeHeader(header, "Privacy Policy | Crestiva Web Studio", "https://crestivawebstudio.online/privacy-policy");
let termsHeader = customizeHeader(header, "Terms of Service | Crestiva Web Studio", "https://crestivawebstudio.online/terms");

// Combine! Note that header.html ends with </nav>. We want to close .hero-section before adding our content, OR put it inside .hero-section.
// Actually, putting it outside .hero-section is cleaner.
// Wait, the header has:
// <div class="ui-layer">
//     <div class="hero-section">
//         <nav ...>
// So we close hero-section:
const closingHeroSection = `\n</div>\n`; 
// And footer.html ends with </div></div></div></body></html>. It closes .ui-layer.

fs.writeFileSync('privacy-policy.html', privacyHeader + closingHeroSection + privacyContent + footer);
fs.writeFileSync('terms.html', termsHeader + closingHeroSection + termsContent + footer);

console.log("Successfully generated clean privacy-policy.html and terms.html");
