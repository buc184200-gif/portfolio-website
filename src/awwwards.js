// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Inject HTML elements
    const body = document.body;
    
    // Noise Overlay
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    body.appendChild(noise);

    // Ambient Glow
    const glow = document.createElement('div');
    glow.className = 'ambient-glow';
    body.appendChild(glow);

    // Cursor
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    const follower = document.createElement('div');
    follower.id = 'custom-cursor-follower';
    body.appendChild(cursor);
    body.appendChild(follower);

    // Loader
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-logo" data-text="CRESTIVA">CRESTIVA</div>
        <div class="loader-progress"><div class="loader-progress-bar" id="loader-bar"></div></div>
    `;
    body.appendChild(loader);

    // 1. Advanced Cursor System & Ambient Glow
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cx = mouseX, cy = mouseY; // cursor
    let fx = mouseX, fy = mouseY; // follower
    let gx = mouseX, gy = mouseY; // glow

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderLoop() {
        // Linear interpolation for smooth follow
        cx += (mouseX - cx) * 0.3;
        cy += (mouseY - cy) * 0.3;
        fx += (mouseX - fx) * 0.15;
        fy += (mouseY - fy) * 0.15;
        gx += (mouseX - gx) * 0.05;
        gy += (mouseY - gy) * 0.05;

        // Velocity stretch for cursor
        const vx = mouseX - cx;
        const vy = mouseY - cy;
        const speed = Math.sqrt(vx * vx + vy * vy);
        const scaleX = 1 + Math.min(speed * 0.005, 1);
        const scaleY = 1 - Math.min(speed * 0.002, 0.5);
        const angle = Math.atan2(vy, vx) * 180 / Math.PI;

        cursor.style.transform = `translate(-50%, -50%) translate3d(${cx}px, ${cy}px, 0) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
        follower.style.transform = `translate(-50%, -50%) translate3d(${fx}px, ${fy}px, 0)`;
        
        glow.style.transform = `translate(-50%, -50%) translate3d(${gx}px, ${gy}px, 0)`;

        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    // Hover states for cursor
    const interactiveElements = document.querySelectorAll('a, button, input, select, .price-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
    });
    
    // Magnetic Buttons (Awwwards staple)
    const magneticBtns = document.querySelectorAll('.hero-cta, .plan-btn, .nav-btn, .action-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: "power3.out"
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 2. Cinematic Page Loader (Fake Progress)
    let progress = 0;
    const bar = document.getElementById('loader-bar');
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut",
                    onComplete: () => loader.remove()
                });
                
                // Trigger intro animations
                gsap.to('body', { opacity: 1, duration: 0.5 });
                initScrollAnimations();
            }, 500);
        }
    }, 150);

    // 3. Lenis Smooth Scroll Setup
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Integrate Lenis with GSAP ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // Expose lenis scroll to global for Three.js shaders if needed
        lenis.on('scroll', (e) => {
            window.awwwardsScroll = e.scroll;
            window.awwwardsProgress = e.progress; // 0 to 1
        });
    }

    // GSAP Scroll Animations
    function initScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // 1. Luxury Text Animations (Split Type)
        if (typeof SplitType !== 'undefined') {
            const headings = document.querySelectorAll('h1, h2.section-heading, .reveal-text');
            headings.forEach(heading => {
                const split = new SplitType(heading, { types: 'lines, words, chars', lineClass: 'split-line', wordClass: 'split-word', charClass: 'split-char' });
                
                // Set initial state
                gsap.set(split.words, { y: 30, opacity: 0 });
                
                // Animate word by word
                gsap.to(split.words, {
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 90%",
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    stagger: 0.04,
                    ease: "power4.out" // Luxury cubic bezier
                });
            });
        }

        // 2. Premium Section Reveal (Fade + slight upward)
        const fadeSections = document.querySelectorAll('.fade-in-section, .info-block');
        fadeSections.forEach((section) => {
            gsap.set(section, { y: 60, opacity: 0 });
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out"
            });
        });

        // 3. Package Card Entrance (Staggered, spring effect)
        const priceCards = document.querySelectorAll('#pricing .price-card');
        if (priceCards.length) {
            gsap.set(priceCards, { y: 100, opacity: 0 });
            ScrollTrigger.create({
                trigger: "#pricing",
                start: "top 80%",
                onEnter: () => {
                    gsap.to(priceCards, {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.15,
                        ease: "back.out(1.2)" // Slight spring
                    });
                    
                    // Number counter animation on prices
                    priceCards.forEach((card, index) => {
                        const priceEl = card.querySelector('.plan-price');
                        if (priceEl && !priceEl.dataset.counted) {
                            priceEl.dataset.counted = "true";
                            
                            // Extract numeric values from HTML like "<span class='plan-price-old'>₹24,999</span> ₹18,499+"
                            // We need a robust way. Let's assume the main price is the last number in the string.
                            const textNodes = Array.from(priceEl.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                            const textNode = textNodes[textNodes.length - 1];
                            if (textNode) {
                                const originalText = textNode.textContent;
                                const match = originalText.match(/₹([0-9,]+)(\+?)/);
                                if (match) {
                                    const targetValue = parseInt(match[1].replace(/,/g, ''));
                                    const suffix = match[2] || '';
                                    
                                    let obj = { val: 0 };
                                    gsap.to(obj, {
                                        val: targetValue,
                                        duration: 1.5,
                                        delay: 0.5 + (index * 0.15),
                                        ease: "power2.out",
                                        onUpdate: () => {
                                            textNode.textContent = ' ₹' + Math.round(obj.val).toLocaleString('en-IN') + suffix;
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            });
        }
        
        // 4. Advanced Hover on Cards (3D + Light)
        const cards = document.querySelectorAll('.price-card, .service-card, .feat-card');
        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                
                // Micro Parallax Tilt
                const tiltX = (cy - y) / cy * 4; 
                const tiltY = (x - cx) / cx * 4;
                
                gsap.to(card, {
                    rotateX: tiltX,
                    rotateY: tiltY,
                    duration: 0.4,
                    ease: "power2.out",
                    transformPerspective: 1000
                });
                
                // Dynamic border/light glow
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.7,
                    ease: "power3.out"
                });
            });
        });
        
        // 5. Luxury Dividers (Draw line)
        const dividers = document.querySelectorAll('.luxury-divider');
        dividers.forEach(div => {
            gsap.to(div, {
                scrollTrigger: {
                    trigger: div,
                    start: "top 95%"
                },
                scaleX: 1,
                opacity: 1,
                duration: 1.5,
                ease: "power3.inOut"
            });
        });

        // 6. Smooth Section Transition Background Color
        const sections = document.querySelectorAll('section');
        sections.forEach((sec, i) => {
            ScrollTrigger.create({
                trigger: sec,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => {
                    gsap.to('body', { backgroundColor: i % 2 === 0 ? '#0e0e0e' : '#141414', duration: 1.5 });
                },
                onEnterBack: () => {
                    gsap.to('body', { backgroundColor: i % 2 === 0 ? '#0e0e0e' : '#141414', duration: 1.5 });
                }
            });
        });
        
        // Premium Cursor Follower Light
        const cursorLight = document.getElementById('cursor-light');
        if (cursorLight) {
            let clx = window.innerWidth / 2;
            let cly = window.innerHeight / 2;
            
            gsap.ticker.add(() => {
                // Read global mouseX and mouseY (they are updated in awwwards.js mousemove)
                // We'll just hook into the existing render loop or do it here
                if(window.mouseX !== undefined && window.mouseY !== undefined) {
                    clx += (window.mouseX - clx) * 0.08;
                    cly += (window.mouseY - cly) * 0.08;
                    cursorLight.style.transform = `translate(-50%, -50%) translate3d(${clx}px, ${cly}px, 0)`;
                }
            });
            
            window.addEventListener('mousemove', (e) => {
                window.mouseX = e.clientX;
                window.mouseY = e.clientY;
            });
        }
    }
});
