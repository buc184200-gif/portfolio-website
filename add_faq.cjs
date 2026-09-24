const fs = require('fs');

let html = fs.readFileSync('see-more.html', 'utf8');

// The CSS for the FAQ
const faqCSS = `
        /* FAQ Section */
        .faq-section {
            max-width: 800px;
            margin: 0 auto;
            padding-bottom: 60px;
        }
        .faq-item {
            border-bottom: 1px solid rgba(140, 180, 120, 0.2);
            margin-bottom: 10px;
        }
        .faq-question {
            width: 100%;
            background: none;
            border: none;
            padding: 20px 0;
            text-align: left;
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            color: #f0f0f0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: color 0.3s;
        }
        .faq-question:hover {
            color: #d4af37;
        }
        .faq-icon {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.5rem;
            font-weight: 300;
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
            color: rgba(212, 175, 55, 0.8);
        }
        .faq-item.active .faq-icon {
            transform: rotate(45deg);
        }
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1), padding 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            font-family: 'Space Grotesk', sans-serif;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.7;
            font-size: 1rem;
            padding: 0;
        }
        .faq-item.active .faq-answer {
            padding-bottom: 25px;
        }
`;

// Insert the CSS before </style>
html = html.replace('</style>', faqCSS + '\n    </style>');

// The HTML for the FAQ section
const faqHTML = `
            <div class="luxury-divider"></div>

            <section id="faq" class="fade-in-section faq-section">
                <h2 class="section-heading">Frequently Asked <em>Questions</em></h2>
                
                <div class="faq-item">
                    <button class="faq-question">What type of websites does Crestiva Web Studio build?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">We specialize in building premium, high-performance websites for businesses, startups, and professionals. This includes landing pages, corporate websites, portfolios, and custom web applications tailored to your specific goals.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">Do you build custom websites or use templates?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">We craft custom, brand-aligned visual designs. While we leverage modern web technologies (like React and Vite) to ensure speed and reliability, the design and user experience are uniquely tailored to fit your brand identity and business needs.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">Are the websites responsive on mobile and desktop?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">Yes, absolutely. Every website we build features modern responsive layouts that look stunning and function seamlessly across all devices, from mobile phones to large desktop screens.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">Can you redesign an existing website?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">Yes. We can help transform your existing website by improving its visual design, user experience, performance, and technical SEO structure to better align with your current business objectives.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">How does the website design and development process work?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">Our process typically involves understanding your requirements, creating visual concepts, and then proceeding to full development. We integrate advanced features, optimize for performance, and ensure a smooth launch. Communication is maintained via email or WhatsApp throughout the project.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">Do you use AI during website development?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">Yes, we intelligently integrate AI into our workflows for rapid prototyping, robust code generation, and to create advanced interactive features when it adds genuine value to your project.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">Do you optimize websites for performance and SEO?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">Every site is optimized for speed, semantic HTML structure, and technical SEO best practices to ensure high visibility and seamless user journeys.</div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">How can I start a project with Crestiva Web Studio?<span class="faq-icon">+</span></button>
                    <div class="faq-answer">You can start by filling out the contact form on this page, or by using our Custom Builder to select your desired features. You can also reach out to us directly via WhatsApp or email to discuss your requirements.</div>
                </div>
                
                <script type="application/ld+json">
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What type of websites does Crestiva Web Studio build?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We specialize in building premium, high-performance websites for businesses, startups, and professionals. This includes landing pages, corporate websites, portfolios, and custom web applications tailored to your specific goals."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you build custom websites or use templates?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We craft custom, brand-aligned visual designs. While we leverage modern web technologies (like React and Vite) to ensure speed and reliability, the design and user experience are uniquely tailored to fit your brand identity and business needs."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Are the websites responsive on mobile and desktop?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, absolutely. Every website we build features modern responsive layouts that look stunning and function seamlessly across all devices, from mobile phones to large desktop screens."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can you redesign an existing website?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. We can help transform your existing website by improving its visual design, user experience, performance, and technical SEO structure to better align with your current business objectives."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does the website design and development process work?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our process typically involves understanding your requirements, creating visual concepts, and then proceeding to full development. We integrate advanced features, optimize for performance, and ensure a smooth launch. Communication is maintained via email or WhatsApp throughout the project."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you use AI during website development?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, we intelligently integrate AI into our workflows for rapid prototyping, robust code generation, and to create advanced interactive features when it adds genuine value to your project."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you optimize websites for performance and SEO?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Every site is optimized for speed, semantic HTML structure, and technical SEO best practices to ensure high visibility and seamless user journeys."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How can I start a project with Crestiva Web Studio?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You can start by filling out the contact form on this page, or by using our Custom Builder to select your desired features. You can also reach out to us directly via WhatsApp or email to discuss your requirements."
                      }
                    }
                  ]
                }
                </script>
            </section>
`;

// Insert the FAQ section right before the contact section divider
const targetHTML = `<div class="luxury-divider"></div>
            <section id="contact" class="fade-in-section contact-section" style="padding-bottom: 60px;">`;

html = html.replace(targetHTML, faqHTML + '\n            ' + targetHTML);

// The JS for the accordion behavior
const faqJS = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + 40 + "px"; // 40px for padding
                }
            });
        });
    });
</script>
`;

// Insert the JS right before the closing </body> tag
html = html.replace('</body>', faqJS + '</body>');

fs.writeFileSync('see-more.html', html);
console.log('FAQ section added to see-more.html');

