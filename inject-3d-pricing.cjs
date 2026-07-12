const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// Add CSS for 3D Pricing Cards
const css3D = `
        /* --- Premium 3D Pricing Cards --- */
        .pricing-grid {
            perspective: 1500px;
        }

        .price-card {
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.6s ease;
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
        
        /* Ensure the entry animation transitions don't fight with the 3D transforms */
        .price-card.animate-in {
            /* Handled by JS inline styles during hover */
        }
`;

if (!html.includes('/* --- Premium 3D Pricing Cards --- */')) {
    html = html.replace('</style>', css3D + '\n    </style>');
}

// Add JS logic
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

                card.addEventListener('mousemove', (e) => {
                    isHovering = true;
                    
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
                    
                    // User requirements: 
                    // Mouse left = rotateY(-8deg)
                    // Mouse top = rotateX(8deg)
                    targetRotateY = percentX * 8; 
                    targetRotateX = percentY * -8;
                    
                    if (!rafId) {
                        rafId = requestAnimationFrame(updateTransform);
                    }
                });

                card.addEventListener('mouseleave', () => {
                    isHovering = false;
                    cancelAnimationFrame(rafId);
                    rafId = null;
                    
                    currentRotateX = 0;
                    currentRotateY = 0;
                    targetRotateX = 0;
                    targetRotateY = 0;
                    
                    // Smooth return is handled by CSS transition when style attribute is cleared
                    card.style.transform = '';
                });
                
                // Since the cards also have an entry animation, we clear the transform only if it's already animated in
                // Wait, if we clear transform, it might revert to non-animated state if we're not careful.
                // The base classes are 'price-card animate-in' which has translateY(0) scale(1)
            });
`;

if (!html.includes('// 3D Premium Pricing Cards Logic')) {
    html = html.replace('// Calculator Logic', js3D + '\n            // Calculator Logic');
}

fs.writeFileSync('see-more.html', html);
console.log('Updated see-more.html');
