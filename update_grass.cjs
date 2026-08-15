const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Top section
code = code.replace(
`		let initialBladeCount = 120000;
		if (isMobile) {
			initialBladeCount = (cores <= 4 || mem <= 4) ? 12000 : 20000;
		} else if (isTablet || isCoarse) {
			initialBladeCount = 40000;
		} else if (cores <= 4 || mem <= 4) {
			initialBladeCount = 75000;
		}

		const BLADE_COUNT = initialBladeCount;`,
`		const res = window.innerWidth * window.innerHeight;
		const tiers = [15000, 30000, 50000, 75000, 100000];
		let currentTier = 3;

		if (sessionStorage.getItem('grass_tier')) {
			currentTier = parseInt(sessionStorage.getItem('grass_tier'), 10);
		} else {
			if (isMobile) {
				currentTier = (cores <= 4 || mem <= 4) ? 0 : 1;
			} else if (isTablet || isCoarse) {
				currentTier = (cores >= 8 && mem >= 8) ? 3 : 2;
			} else {
				if (cores >= 8 && mem >= 8 && res > 1920 * 1080) {
					currentTier = 4;
				} else if (cores <= 4 || mem <= 4) {
					currentTier = 2;
				} else {
					currentTier = 3;
				}
			}
		}

		let BLADE_COUNT = tiers[currentTier];
		let bladeData, bendState, bladeBound;
		let computeInit, computeUpdate, grassMat, grass;
		const dummy = new THREE.Object3D();`
);

// 2. GPU Buffers
code = code.replace(
`		// ─── GPU Buffers ────────────────────────────────────────────────────
		const bladeData = instancedArray(BLADE_COUNT, 'vec4');
		const bendState = instancedArray(BLADE_COUNT, 'vec4');
		const bladeBound = instancedArray(BLADE_COUNT, 'float');`,
`		// ─── GPU Buffers ────────────────────────────────────────────────────`
);

// 3. Wrapping compute nodes and grass creation
const startMark = `		// ─── Compute Init ──────────────────────────────────────────────────`;
const endMark = `		// ─── Ground ────────────────────────────────────────────────────────`;

const part1 = code.substring(0, code.indexOf(startMark));
const part2 = code.substring(code.indexOf(startMark), code.indexOf(endMark));
const part3 = code.substring(code.indexOf(endMark));

let updatedPart2 = part2
	.replace(`const computeInit = Fn(() => {`, `computeInit = Fn(() => {`)
	.replace(`const computeUpdate = Fn(() => {`, `computeUpdate = Fn(() => {`)
	.replace(`const grassMat = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide, fog: true });`, `grassMat = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide, fog: true });`)
	.replace(`const grass = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);`, `grass = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);`)
	.replace(`const dummy = new THREE.Object3D();`, ``)
	.replace(/283/g, 'side');

updatedPart2 = `
		function buildGrass(count) {
			if (grass) {
				scene.remove(grass);
				grass.geometry.dispose();
				grass.material.dispose();
			}
			BLADE_COUNT = count;
			const side = Math.ceil(Math.sqrt(BLADE_COUNT));
			const sideF = float(side);
			
			bladeData = instancedArray(BLADE_COUNT, 'vec4');
			bendState = instancedArray(BLADE_COUNT, 'vec4');
			bladeBound = instancedArray(BLADE_COUNT, 'float');

` + updatedPart2.replace(/float\(side\)/g, 'sideF') + `
		}
		buildGrass(BLADE_COUNT);

`;

code = part1 + updatedPart2 + part3;

fs.writeFileSync('index.html', code, 'utf8');
console.log('Done modifying grass creation');
