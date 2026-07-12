const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// Remove old injection
html = html.replace(/\/\* --- Premium 3D Pricing Cards --- \*\/[\s\S]*?\/\* Ensure the entry animation transitions don't fight with the 3D transforms \*\/\s*\.price-card\.animate-in {\s*\/\* Handled by JS inline styles during hover \*\/\s*}\s*<\/style>/, '</style>');
html = html.replace(/\/\/ 3D Premium Pricing Cards Logic[\s\S]*?\/\/ Calculator Logic/, '// Calculator Logic');

// Now inject the proper CSS
const css3D = `
        /* --- Premium 3D Pricing Cards --- */
        .pricing-grid {
            perspective: 1500px;
        }

        .price-card {
            transform-style: preserve-3d;
            /* Keep original transition for non-hover states, add box-shadow */
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            will-change: transform;
            position: relative;
        }

        .price-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(196, 168, 130, 0.15) 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: 1;
        }

        .price-card:hover::before {
            opacity: 1;
        }

        .price-card > * {
            transform: translateZ(30px);
            position: relative;
            z-index: 2;
        }
        
        .price-card.featured > * {
            transform: translateZ(40px);
        }

        .price-card:hover {
            border-color: rgba(196, 168, 130, 0.4);
            box-shadow: 
                0 30px 60px -12px rgba(0,0,0,0.8),
                0 18px 36px -18px rgba(0,0,0,0.6),
                inset 0 1px 1px rgba(255,255,255,0.1),
                0 0 20px rgba(196, 168, 130, 0.1);
        }
`;

html = html.replace('</style>', css3D + '\n    </style>');

const js3D = `
            // 3D Premium Pricing Cards Logic
            const priceCards = document.querySelectorAll('.price-card');
            
            priceCards.forEach(card => {
                let rafId;
                let currentRotateX = 0;
                let currentRotateY = 0;
                let targetRotateX = 0;
                let targetRotateY = 0;
                let isHovering = false;

                const lerp = (start, end, factor) => start + (end - start) * factor;

                const updateTransform = () => {
                    if (isHovering) {
                        currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
                        currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);
                        
                        const baseScale = card.classList.contains('featured') ? 1.05 : 1;
                        
                        card.style.transform = \`translateY(-10px) scale(\${baseScale}) rotateX(\${currentRotateX}deg) rotateY(\${currentRotateY}deg)\`;
                        
                        rafId = requestAnimationFrame(updateTransform);
                    }
                };

                card.addEventListener('mouseenter', () => {
                    isHovering = true;
                    // Disable CSS transition for transform so rAF is smooth
                    card.style.transition = 'box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.6s ease';
                    if (!rafId) {
                        rafId = requestAnimationFrame(updateTransform);
                    }
                });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // For radial gradient highlight
                    card.style.setProperty('--mouse-x', \`\${x}px\`);
                    card.style.setProperty('--mouse-y', \`\${y}px\`);

                    // Rotation logic
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const percentX = (x - centerX) / centerX; // -1 to 1
                    const percentY = (y - centerY) / centerY; // -1 to 1
                    
                    targetRotateY = percentX * 8; 
                    targetRotateX = percentY * -8;
                });

                card.addEventListener('mouseleave', () => {
                    isHovering = false;
                    cancelAnimationFrame(rafId);
                    rafId = null;
                    
                    currentRotateX = 0;
                    currentRotateY = 0;
                    targetRotateX = 0;
                    targetRotateY = 0;
                    
                    // Re-enable CSS transition for smooth return
                    card.style.transition = '';
                    card.style.transform = '';
                });
            });
`;

html = html.replace('// Calculator Logic', js3D + '\n            // Calculator Logic');

fs.writeFileSync('see-more.html', html);
console.log('Fixed see-more.html');
