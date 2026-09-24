const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update Hero Typography
html = html.replace(/font-size: clamp\(48px, 8vw, 110px\);/g, "font-size: clamp(2.5rem, 8vw, 5rem);");
html = html.replace(/font-size: clamp\(14px, 1.5vw, 18px\);/g, "font-size: clamp(1rem, 3vw, 1.4rem);");
html = html.replace(/font-size: 14px;/g, "font-size: clamp(0.9rem, 2vw, 1.1rem);"); // Example for body

// 2. Add Mobile CSS (Navigation, Hero, Slider, Contact)
const mobileCSS = `
		/* --- Responsive Redesign Optimization --- */
		@media (max-width: 1024px) {
			/* Tablet */
			.hero h1 { font-size: clamp(3rem, 6vw, 4.5rem); }
			.section { padding: 80px 30px; }
			.site-footer-inner { grid-template-columns: 1fr 1fr; gap: 30px; }
		}

		@media (max-width: 767px) {
			/* Mobile Navigation */
			.nav-float {
				top: 15px; padding: 12px 20px; width: calc(100% - 30px); left: 15px; right: 15px;
				background: rgba(10, 15, 10, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
				border: 1px solid rgba(140, 180, 120, 0.1); border-radius: 100px;
			}
			.nav-logo { font-size: 20px; }
			.nav-hamburger { background: transparent; border: none; width: 30px; height: 30px; }
			.nav-hamburger span { background: #fff; height: 2px; }

			.nav-mobile-overlay {
				/* Change from full screen to slide-down */
				top: 80px; height: auto; bottom: auto; background: rgba(15, 20, 15, 0.95);
				border-radius: 20px; margin: 0 15px; padding: 30px 20px; gap: 15px;
				transform: translateY(-20px); transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
				border: 1px solid rgba(140, 180, 120, 0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);
			}
			.nav-mobile-overlay.open { transform: translateY(0); }
			.nav-mobile-overlay a {
				width: 100%; text-align: center; padding: 15px; background: rgba(255,255,255,0.05);
				border-radius: 12px; font-size: 1rem; letter-spacing: 2px;
				min-height: 48px; display: flex; align-items: center; justify-content: center;
			}

			/* Hero */
			.hero { align-items: center; text-align: center; padding: 0 20px; }
			.hero h1 { font-size: clamp(2.5rem, 8vw, 5rem); text-align: center; }
			.hero-sub { font-size: clamp(1rem, 3vw, 1.4rem); text-align: center; max-width: 100%; margin-top: 15px; }
			.hero-tag { margin-bottom: 20px; }

			/* Project Cards: Avoid horizontal scroll */
			.projects-slider {
				display: flex; flex-direction: column; gap: 30px; padding: 0; width: 100%; max-width: 100%;
			}
			.project-card { width: 100%; min-width: 100%; max-width: 100%; height: auto; aspect-ratio: 4/5; }

			/* Contact / CTA section */
			.cta-section { text-align: center; }
			.floating-cta-btn {
				width: calc(100% - 40px); left: 20px; right: 20px; transform: translateY(-150vh);
				text-align: center; justify-content: center; padding: 18px; bottom: 20px;
				min-height: 48px;
			}
			.floating-cta-btn.is-revealed { transform: translateY(0); }
			
			/* Footer Contact */
			.site-footer-inner { display: flex; flex-direction: column; gap: 40px; text-align: center; }
			.sf-brand { align-items: center; }
			.sf-col { align-items: center; }
			.sf-col a { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; width: 100%; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px; }

			/* Stats section adjustments */
			.stats-grid { flex-direction: column; align-items: center; gap: 30px; }
			.stat-item { width: 100%; text-align: center; }
		}

		/* Global responsive system */
		* { -webkit-tap-highlight-color: transparent; }
		.section { padding: clamp(4rem, 10vh, 10rem) clamp(1.5rem, 5vw, 4rem); }
		h2 { font-size: clamp(2rem, 5vw, 4rem); }
`;
html = html.replace('</style>', mobileCSS + '\n	</style>');

// 3. Optimize Background Performance
const bgMod = `
		function animate() {
			const dt = Math.min(clock.getDelta(), 0.05);

			if (_scrollDirty) {
				targetScrollT = getScrollProgress();
				_scrollDirty = false;
			}

			// Simpler animation for mobile
			const isMobile = window.innerWidth < 768;
			if (isMobile) {
				currentScrollT += (targetScrollT - currentScrollT) * Math.min(1, dt * 10); // faster, cheaper
			} else {
				currentScrollT += (targetScrollT - currentScrollT) * Math.min(1, dt * 6);
			}
`;
html = html.replace(/function animate\(\) \{\s*const dt = Math\.min\(clock\.getDelta\(\), 0\.05\);\s*if \(_scrollDirty\) \{\s*targetScrollT = getScrollProgress\(\);\s*_scrollDirty = false;\s*\}\s*currentScrollT \+= \(targetScrollT - currentScrollT\) \* Math\.min\(1, dt \* 6\);/, bgMod);

const postProcMod = `
		// --- Disable heavy effects on mobile ---
		if (window.innerWidth < 768) {
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
			postProcessing.outputNode = pass(scene, camera); // bypass DOF
		}
`;
// Insert right after postProcessing is initialized
html = html.replace(/(const postProcessing = new THREE\.PostProcessing\(renderer\);\s*postProcessing\.outputNode = [^;]+;)/, "$1\n" + postProcMod);

// Modify horizontal scrolling for projects on mobile
const scrollMod = `
		function loop() {
			// On mobile, rely on native vertical scrolling, disable horizontal JS logic
			if (window.innerWidth >= 768) {
				targetPos = window.scrollY;
				currentPos += (targetPos - currentPos) * 0.08;
				let p = currentPos / (document.body.scrollHeight - window.innerHeight);
				p = Math.max(0, Math.min(1, p));
				
				const offset = -p * maxScroll;
				if (slider) {
					slider.style.transform = \`translate3d(\${offset}px, 0, 0)\`;
				}
			} else {
				if (slider) {
					slider.style.transform = 'none';
				}
			}
			requestAnimationFrame(loop);
		}
`;
html = html.replace(/function loop\(\) \{[\s\S]*?requestAnimationFrame\(loop\);\s*\}/, scrollMod);

// Enhance Lazy Loading
html = html.replace(/<img /g, '<img loading="lazy" decoding="async" ');

// Ensure cta target respects mobile
html = html.replace(/floatingCta\.style\.transform = `translateX\(-50%\) translateY\(\$\{smoothY\}px\) scale\(\$\{currentScale\}\)`;/, `
						if(window.innerWidth < 768) {
							floatingCta.style.transform = \`translateX(-50%) translateY(0) scale(\${currentScale})\`;
						} else {
							floatingCta.style.transform = \`translateX(-50%) translateY(\${smoothY}px) scale(\${currentScale})\`;
						}`);

fs.writeFileSync('index.html', html);
console.log('index.html updated!');
