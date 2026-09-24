const fs = require('fs');

let html = fs.readFileSync('see-more.html', 'utf8');

// The CSS to inject
const cssToInject = `
        .service-card-premium {
            position: relative;
            background: linear-gradient(145deg, rgba(20,20,20,0.6), rgba(10,10,10,0.8));
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 40px 30px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .service-card-premium::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .service-card-premium:hover {
            transform: translateY(-6px);
            border-color: rgba(212, 175, 55, 0.2);
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px -10px rgba(212, 175, 55, 0.08);
            background: linear-gradient(145deg, rgba(25,25,25,0.7), rgba(12,12,12,0.9));
        }
        .service-card-premium:hover::before {
            opacity: 1;
        }
        .service-card-num {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.8rem;
            color: rgba(212, 175, 55, 0.5);
            margin-bottom: 20px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .service-card-title {
            color: #f0f0f0;
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            margin-bottom: 16px;
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        .service-card-desc {
            color: rgba(255, 255, 255, 0.65);
            line-height: 1.7;
            font-size: 1rem;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 300;
        }
`;

html = html.replace('<style>', '<style>\n' + cssToInject);

const oldCard1 = `<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">Web Design &amp; UX</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">We craft custom, brand-aligned visual designs with a focus on intuitive user experience (UX) and modern responsive layouts that look stunning on any device.</p>
                    </div>`;
                    
const newCard1 = `<div class="service-card-premium">
                        <div class="service-card-num">01 // Design</div>
                        <h3 class="service-card-title">Web Design &amp; UX</h3>
                        <p class="service-card-desc">We craft custom, brand-aligned visual designs with a focus on intuitive user experience (UX) and modern responsive layouts that look stunning on any device.</p>
                    </div>`;

const oldCard2 = `<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">Web Development</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">Using modern web technologies like React, Vite, and robust CSS architectures, we build fast, secure, and highly interactive websites tailored for your business needs.</p>
                    </div>`;
                    
const newCard2 = `<div class="service-card-premium">
                        <div class="service-card-num">02 // Engineering</div>
                        <h3 class="service-card-title">Web Development</h3>
                        <p class="service-card-desc">Using modern web technologies like React, Vite, and robust CSS architectures, we build fast, secure, and highly interactive websites tailored for your business needs.</p>
                    </div>`;

const oldCard3 = `<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">Performance &amp; SEO</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">Every site is optimized for speed, semantic HTML structure, and technical SEO best practices to ensure high visibility and seamless user journeys.</p>
                    </div>`;

const newCard3 = `<div class="service-card-premium">
                        <div class="service-card-num">03 // Optimization</div>
                        <h3 class="service-card-title">Performance &amp; SEO</h3>
                        <p class="service-card-desc">Every site is optimized for speed, semantic HTML structure, and technical SEO best practices to ensure high visibility and seamless user journeys.</p>
                    </div>`;

const oldCard4 = `<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
                        <h3 style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px;">AI-Assisted Workflows</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; font-size: 0.95rem;">We integrate AI intelligently into our development process for rapid prototyping, robust code generation, and creating advanced interactive features when beneficial.</p>
                    </div>`;
                    
const newCard4 = `<div class="service-card-premium">
                        <div class="service-card-num">04 // Innovation</div>
                        <h3 class="service-card-title">AI-Assisted Workflows</h3>
                        <p class="service-card-desc">We integrate AI intelligently into our development process for rapid prototyping, robust code generation, and creating advanced interactive features when beneficial.</p>
                    </div>`;

html = html.replace(oldCard1, newCard1);
html = html.replace(oldCard2, newCard2);
html = html.replace(oldCard3, newCard3);
html = html.replace(oldCard4, newCard4);

fs.writeFileSync('see-more.html', html);
console.log('Cards updated successfully.');

