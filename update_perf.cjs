const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Tiers
code = code.replace(
    `const tiers = [15000, 30000, 50000, 75000, 100000];`,
    `const tiers = [7000, 14000, 25000, 40000, 60000];`
);

// 2. Adaptive DPR
code = code.replace(
`		function getAdaptiveDPR() {
			let maxDPR = 1.75;
			if (isMobile) {
				maxDPR = 1.2;
			} else if (isTablet || isCoarse) {
				maxDPR = 1.35;
			} else if (cores <= 4 || mem <= 4) {
				maxDPR = 1.5;
			}
			return Math.min(window.devicePixelRatio || 1, maxDPR);
		}`,
`		function getAdaptiveDPR() {
			const maxDPRs = [0.85, 1.0, 1.1, 1.25, 1.35];
			const limit = maxDPRs[currentTier] || 1.0;
			return Math.min(window.devicePixelRatio || 1, limit);
		}`
);

// 3. FPS Rules
const fpsRulesOld = `				if (avgFps >= 55 && targetTier < 4) {
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
				} else {`;
const fpsRulesNew = `				if (avgFps < 35 && targetTier >= 2) {
					targetTier -= 2;
				} else if (avgFps < 35 && targetTier === 1) {
					targetTier = 0;
				} else if (avgFps < 45 && targetTier >= 1) {
					targetTier -= 1;
				}

				if (targetTier < currentTier && adjustmentsMade < 2) {
					currentTier = targetTier;
					adjustmentsMade++;
					testFrames = 0;
					testStartTime = fpsNow;
					buildGrass(tiers[currentTier]);
					renderer.setPixelRatio(getAdaptiveDPR());
					renderer.setSize(window.innerWidth, window.innerHeight);
					renderer.computeAsync(computeInit);
				} else {`;
code = code.replace(fpsRulesOld, fpsRulesNew);

// 4. 45 FPS Grass Rendering limit
const stateSetupOld = `		let testFrames = 0;
		let testStartTime = performance.now();
		let adjustmentsMade = 0;
		let isTestingPerformance = !sessionStorage.getItem('grass_tier');

		let isTabVisible = !document.hidden;`;

const stateSetupNew = `		let testFrames = 0;
		let testStartTime = performance.now();
		let adjustmentsMade = 0;
		let isTestingPerformance = !sessionStorage.getItem('grass_tier');

		let lastGrassRenderTime = performance.now();
		const grassRenderInterval = 1000 / 45; // ~22.22ms

		let isTabVisible = !document.hidden;`;
code = code.replace(stateSetupOld, stateSetupNew);

const rendererCallOld = `			if (isTestingPerformance) testFrames++;

			renderer.compute(computeUpdate);
			postProcessing.render();
		}`;
const rendererCallNew = `			if (isTestingPerformance) testFrames++;

			if (fpsNow - lastGrassRenderTime >= grassRenderInterval) {
				renderer.compute(computeUpdate);
				postProcessing.render();
				lastGrassRenderTime = fpsNow - ((fpsNow - lastGrassRenderTime) % grassRenderInterval);
			}
		}`;
code = code.replace(rendererCallOld, rendererCallNew);

fs.writeFileSync('index.html', code);
console.log('Update script completed.');
