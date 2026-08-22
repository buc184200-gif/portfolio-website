const fs = require('fs');

let content = fs.readFileSync('see-more.html', 'utf8');

// Change hero text
content = content.replace(
    '<div class="hero-tag">Generative Design Lab</div>',
    '<div class="hero-tag">Services &amp; Pricing</div>'
);
content = content.replace(
    '<h1 class="hero-title"><span class="line-thin">We craft</span>Algorithmic<br><em>Elegance</em></h1>',
    '<h1 class="hero-title"><span class="line-thin">Premium Web</span>Design &<br><em>Development</em></h1>'
);
content = content.replace(
    '<p class="hero-body">Turning raw computation into sensory experiences — each particle a pixel of intention, each form a conversation between chaos and control.</p>',
    '<p class="hero-body">We provide custom website development, immersive design, and AI-assisted workflows to build high-performance digital experiences that convert.</p>'
);

// Add services section before pricing
const servicesSection = `
            <section id="services-overview" class="fade-in-section info-block" style="padding-bottom: 20px;">
                <h2 class="section-heading">Our Core <em>Expertise</em></h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 40px;">
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">Web Design &amp; UX</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">We craft custom, brand-aligned visual designs with a focus on intuitive user experience (UX) and modern responsive layouts that look stunning on any device.</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">Web Development</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">Using modern web technologies like React, Vite, and robust CSS architectures, we build fast, secure, and highly interactive websites tailored for your business needs.</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">Performance &amp; SEO</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">Every site is optimized for speed, semantic HTML structure, and technical SEO best practices to ensure high visibility and seamless user journeys.</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">AI-Assisted Workflows</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">We integrate AI intelligently into our development process for rapid prototyping, robust code generation, and creating advanced interactive features when beneficial.</p>
                    </div>
                </div>
            </section>
            <div class="luxury-divider"></div>
`;

content = content.replace('<section id="pricing"', servicesSection + '            <section id="pricing"');

fs.writeFileSync('see-more.html', content);
