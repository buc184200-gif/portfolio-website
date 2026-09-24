const fs = require('fs');

const seeMore = fs.readFileSync('see-more.html', 'utf8');

// Extract the base HTML structure from see-more.html
// We'll replace the `<main>` content with our legal text.
const startTag = '<main>';
const endTag = '</main>';

const startIndex = seeMore.indexOf(startTag);
const endIndex = seeMore.indexOf(endTag) + endTag.length;

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find <main> tags');
    process.exit(1);
}

const htmlBefore = seeMore.substring(0, startIndex + startTag.length);
const htmlAfter = seeMore.substring(endIndex - endTag.length);

const privacyContent = `
            <section class="fade-in-section info-block" style="padding-top: 40px; padding-bottom: 60px;">
                <h1 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 10px;">Privacy <em>Policy</em></h1>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; margin-bottom: 40px;">Last Updated: August 2026</p>

                <div style="color: rgba(255, 255, 255, 0.8); line-height: 1.8; font-family: 'Space Grotesk', sans-serif;">
                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">1. Introduction</h2>
                    <p style="margin-bottom: 20px;">Welcome to Crestiva Web Studio. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it. By using our website and services, you agree to the collection and use of information in accordance with this policy.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">2. Information We Collect</h2>
                    <p style="margin-bottom: 10px;">We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services. This includes:</p>
                    <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                        <li><strong>Contact Information:</strong> Your name, email address, phone number, and business name when you submit a project inquiry or contact form.</li>
                        <li><strong>Account Data:</strong> If you create an account, we store your authentication state and email.</li>
                        <li><strong>Project Details:</strong> Information about your website requirements and custom build preferences.</li>
                    </ul>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">3. How We Use Your Information</h2>
                    <p style="margin-bottom: 10px;">We use the information we collect or receive to:</p>
                    <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                        <li>Provide, operate, and maintain our services.</li>
                        <li>Respond to your inquiries, provide custom quotes, and offer customer support.</li>
                        <li>Facilitate account creation and logon processes.</li>
                        <li>Process payments securely for project milestones.</li>
                    </ul>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">4. Local Storage & Cookies</h2>
                    <p style="margin-bottom: 20px;">Our website uses standard browser capabilities, such as <code>localStorage</code>, to temporarily save your authentication state, session preferences, and custom website estimator choices locally on your device. This ensures a seamless browsing experience without unnecessary tracking.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">5. Third-Party Services</h2>
                    <p style="margin-bottom: 10px;">We utilize trusted third-party services to deliver our core functionality. These processors have their own privacy policies regarding how they handle your data:</p>
                    <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                        <li><strong>Supabase:</strong> For secure database hosting and contact form submission management.</li>
                        <li><strong>Razorpay:</strong> To process advance payments and project invoices securely. We do not store your direct credit card information.</li>
                        <li><strong>WhatsApp & Email:</strong> For direct project communication and support.</li>
                    </ul>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">6. Data Security</h2>
                    <p style="margin-bottom: 20px;">We implement reasonable technical and organizational security measures to protect the security of any personal information we process. However, please remember that no method of transmission over the internet or electronic storage is 100% secure.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">7. Contact Us</h2>
                    <p style="margin-bottom: 20px;">If you have any questions or comments about this policy, you may email us at: <strong>crestivawebstudio@gmail.com</strong>.</p>
                </div>
            </section>
`;

const termsContent = `
            <section class="fade-in-section info-block" style="padding-top: 40px; padding-bottom: 60px;">
                <h1 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 10px;">Terms of <em>Service</em></h1>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; margin-bottom: 40px;">Last Updated: August 2026</p>

                <div style="color: rgba(255, 255, 255, 0.8); line-height: 1.8; font-family: 'Space Grotesk', sans-serif;">
                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">1. Acceptance of Terms</h2>
                    <p style="margin-bottom: 20px;">By accessing and using the website and services of Crestiva Web Studio, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site or our services.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">2. Services Provided</h2>
                    <p style="margin-bottom: 20px;">Crestiva Web Studio provides custom web design, web development, performance optimization, and related digital services. The specific scope, deliverables, and timeline for each project will be agreed upon mutually prior to the commencement of work.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">3. Project Initiation and Payment</h2>
                    <p style="margin-bottom: 10px;">To initiate a project, an advance payment (typically 25% to 50%, depending on the agreement) is required. This secures your spot in our development schedule.</p>
                    <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                        <li>All payments are processed securely via our authorized payment gateway (Razorpay).</li>
                        <li>Final deliverables and source code access are provided only after full payment of the project invoice has been received.</li>
                    </ul>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">4. Client Responsibilities</h2>
                    <p style="margin-bottom: 20px;">The client agrees to provide all necessary materials, content, brand assets, and timely feedback required for the successful completion of the project. Delays in providing necessary information may result in adjustments to the agreed timeline.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">5. Intellectual Property</h2>
                    <p style="margin-bottom: 20px;">Upon completion of the project and receipt of full payment, the client assumes ownership of the final website design and content. Crestiva Web Studio retains the right to display the completed project in our portfolio and marketing materials as examples of our work.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">6. Third-Party Integrations</h2>
                    <p style="margin-bottom: 20px;">Our websites may integrate with third-party tools, APIs, or hosting services. We are not responsible for any issues, downtime, or policy changes originating from these third-party providers once the site is handed over.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">7. Limitation of Liability</h2>
                    <p style="margin-bottom: 20px;">In no event shall Crestiva Web Studio or its founders be liable for any indirect, consequential, incidental, or punitive damages, including loss of profits or data, arising out of your use of our services or website.</p>

                    <h2 style="color: #f0f0f0; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px;">8. Contact Information</h2>
                    <p style="margin-bottom: 20px;">If you have any questions regarding these Terms, please contact us at: <strong>crestivawebstudio@gmail.com</strong>.</p>
                </div>
            </section>
`;

let privacyHtml = htmlBefore + privacyContent + htmlAfter;
let termsHtml = htmlBefore + termsContent + htmlAfter;

// Fix SEO Metadata for Privacy Policy
privacyHtml = privacyHtml.replace(/<title>.*?<\/title>/, '<title>Privacy Policy | Crestiva Web Studio</title>');
privacyHtml = privacyHtml.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="Privacy Policy for Crestiva Web Studio. Learn how we collect, use, and protect your information." />');
privacyHtml = privacyHtml.replace(/<link rel="canonical" href=".*?" \/>/, '<link rel="canonical" href="https://crestivawebstudio.online/privacy-policy" />');
privacyHtml = privacyHtml.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="Privacy Policy | Crestiva Web Studio" />');
privacyHtml = privacyHtml.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="Privacy Policy for Crestiva Web Studio." />');
privacyHtml = privacyHtml.replace(/<meta property="og:url" content=".*?" \/>/, '<meta property="og:url" content="https://crestivawebstudio.online/privacy-policy" />');
privacyHtml = privacyHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, '<meta name="twitter:title" content="Privacy Policy | Crestiva Web Studio" />');
privacyHtml = privacyHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, '<meta name="twitter:description" content="Privacy Policy for Crestiva Web Studio." />');

// Fix SEO Metadata for Terms
termsHtml = termsHtml.replace(/<title>.*?<\/title>/, '<title>Terms of Service | Crestiva Web Studio</title>');
termsHtml = termsHtml.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="Terms of Service and conditions for working with Crestiva Web Studio." />');
termsHtml = termsHtml.replace(/<link rel="canonical" href=".*?" \/>/, '<link rel="canonical" href="https://crestivawebstudio.online/terms" />');
termsHtml = termsHtml.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="Terms of Service | Crestiva Web Studio" />');
termsHtml = termsHtml.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="Terms of Service for Crestiva Web Studio." />');
termsHtml = termsHtml.replace(/<meta property="og:url" content=".*?" \/>/, '<meta property="og:url" content="https://crestivawebstudio.online/terms" />');
termsHtml = termsHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, '<meta name="twitter:title" content="Terms of Service | Crestiva Web Studio" />');
termsHtml = termsHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, '<meta name="twitter:description" content="Terms of Service for Crestiva Web Studio." />');


fs.writeFileSync('privacy-policy.html', privacyHtml);
fs.writeFileSync('terms.html', termsHtml);
console.log('Legal pages generated successfully.');
