const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target1 = `			// FPS counter
			fpsFrames++;
			const fpsNow = performance.now();
			if (fpsNow - fpsLast >= 500) {
				if (fpsEnabled && fpsOverlay) {
					fpsOverlay.textContent = (fpsFrames / ((fpsNow - fpsLast) / 1000)).toFixed(0) + ' FPS';
				}
				fpsFrames = 0;
				fpsLast = fpsNow;
			}`;

const replacement1 = `			// FPS counter
			fpsFrames++;
			const fpsNow = performance.now();
			if (fpsNow - fpsLast >= 500) {
				if (fpsEnabled && fpsOverlay) {
					fpsOverlay.textContent = (fpsFrames / ((fpsNow - fpsLast) / 1000)).toFixed(0) + ' FPS';
				}
				fpsFrames = 0;
				fpsLast = fpsNow;
			}

			if (isTestingPerformance && fpsNow - testStartTime > 2000) {
				const duration = (fpsNow - testStartTime) / 1000;
				const avgFps = testFrames / duration;
				let targetTier = currentTier;
				if (avgFps >= 55 && targetTier < 4) {
					targetTier++;
				} else if (avgFps < 30 && targetTier >= 2) {
					targetTier -= 2;
				} else if (avgFps < 42 && targetTier >= 1) {
					targetTier -= 1;
				}

				if (targetTier !== currentTier && adjustmentsMade < 2) {
					currentTier = targetTier;
					adjustmentsMade++;
					testFrames = 0;
					testStartTime = fpsNow;
					buildGrass(tiers[currentTier]);
					renderer.computeAsync(computeInit);
				} else {
					isTestingPerformance = false;
					sessionStorage.setItem('grass_tier', currentTier);
				}
			}
			if (isTestingPerformance) testFrames++;`;

code = code.replace(target1, replacement1);

const target2 = `		let isTabVisible = !document.hidden;`;

const replacement2 = `		let testFrames = 0;
		let testStartTime = performance.now();
		let adjustmentsMade = 0;
		let isTestingPerformance = !sessionStorage.getItem('grass_tier');

		let isTabVisible = !document.hidden;`;

code = code.replace(target2, replacement2);

fs.writeFileSync('index.html', code, 'utf8');
console.log('Done modifying FPS check');
