			let lastScrollY = window.scrollY;
			const loopCta = () => {
				if (ctaRevealed) {
					const scrollY = window.scrollY;
					const scrollVelocity = scrollY - lastScrollY;
					lastScrollY = scrollY;
					
					if (!isHovered && !gsap.isTweening(floatingCta)) {
						targetY = scrollVelocity * 0.2; 
						targetY = gsap.utils.clamp(-30, 30, targetY);
						smoothY += (targetY - smoothY) * 0.1;
						
						const currentScale = floatingCta.classList.contains('idle') ? 1.03 : 1;
						
						if(window.innerWidth < 768) {
							gsap.set(floatingCta, { y: 0, scale: currentScale, x: "-50%", xPercent: 0 });
						} else {
							gsap.set(floatingCta, { y: smoothY, scale: currentScale, x: "-50%", xPercent: 0 });
						}
					}
				}
				requestAnimationFrame(loopCta);
			};
			requestAnimationFrame(loopCta);

