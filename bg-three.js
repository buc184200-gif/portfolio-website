import * as THREE from 'three';

const container = document.getElementById('three-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
renderer.powerPreference = 'high-performance';
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0e);
scene.fog = new THREE.FogExp2(0x0e0e0e, 0.02);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

// Lights
const ambient = new THREE.AmbientLight(0xffeedd, 3);
scene.add(ambient);
const keyLight = new THREE.PointLight(0xc4a882, 15, 50);
keyLight.position.set(3, 3, 4);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x4a6fa5, 8, 50);
fillLight.position.set(-4, -2, 3);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0x8b7355, 10, 50);
rimLight.position.set(0, 4, -3);
scene.add(rimLight);

const PARTICLE_COUNT = 25000;
function sampleGeometry(geometry, count) {
    const pos = new Float32Array(count * 3);
    const posAttr = geometry.attributes.position;
    const indexAttr = geometry.index;
    const triangles = [];
    const triCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
    const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
    const areas = [];
    let totalArea = 0;
    for (let i = 0; i < triCount; i++) {
        let a, b, c;
        if (indexAttr) {
            a = indexAttr.getX(i * 3); b = indexAttr.getX(i * 3 + 1); c = indexAttr.getX(i * 3 + 2);
        } else {
            a = i * 3; b = i * 3 + 1; c = i * 3 + 2;
        }
        vA.fromBufferAttribute(posAttr, a); vB.fromBufferAttribute(posAttr, b); vC.fromBufferAttribute(posAttr, c);
        const area = new THREE.Triangle(vA.clone(), vB.clone(), vC.clone()).getArea();
        areas.push(area); totalArea += area;
        triangles.push([vA.clone(), vB.clone(), vC.clone()]);
    }
    for (let i = 0; i < count; i++) {
        let r = Math.random() * totalArea;
        let triIdx = 0;
        for (let j = 0; j < areas.length; j++) {
            r -= areas[j]; if (r <= 0) { triIdx = j; break; }
        }
        const tri = triangles[triIdx];
        let u = Math.random(), v = Math.random();
        if (u + v > 1) { u = 1 - u; v = 1 - v; }
        const w = 1 - u - v;
        pos[i * 3]     = tri[0].x * w + tri[1].x * u + tri[2].x * v;
        pos[i * 3 + 1] = tri[0].y * w + tri[1].y * u + tri[2].y * v;
        pos[i * 3 + 2] = tri[0].z * w + tri[1].z * u + tri[2].z * v;
    }
    return pos;
}

function makeSkull() {
    const geo = new THREE.DodecahedronGeometry(1.2, 1);
    const nonIdx = geo.toNonIndexed();
    const idxGeo = new THREE.BufferGeometry();
    idxGeo.setAttribute('position', nonIdx.attributes.position);
    const idxArr = [];
    for (let i = 0; i < nonIdx.attributes.position.count; i++) idxArr.push(i);
    idxGeo.setIndex(idxArr);
    return sampleGeometry(idxGeo, PARTICLE_COUNT);
}

const shapes = [makeSkull()];

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const colors = new Float32Array(PARTICLE_COUNT * 3);
const sizes = new Float32Array(PARTICLE_COUNT);
const randoms = new Float32Array(PARTICLE_COUNT);

positions.set(shapes[0]);

const c1 = new THREE.Color(0xf0d9b5);
const c2 = new THREE.Color(0xd4a574);
const c3 = new THREE.Color(0x7eb8e0);
for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ratio = i / PARTICLE_COUNT;
    const color = ratio < 0.5 ? c1.clone().lerp(c2, ratio * 2) : c2.clone().lerp(c3, (ratio - 0.5) * 2);
    colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
    sizes[i] = 0.012 + Math.random() * 0.02;
    randoms[i] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uMorph: { value: 0 },
        uMouse3D: { value: new THREE.Vector3(0, 0, 0) },
        uMouseActive: { value: 0 },
    },
    vertexShader: `
        attribute float aSize; attribute float aRandom;
        varying vec3 vColor; varying float vAlpha;
        uniform float uTime; uniform float uPixelRatio; uniform float uMorph;
        uniform vec3 uMouse3D; uniform float uMouseActive;
        void main() {
            vColor = color; vec3 pos = position;
            float breath = sin(uTime * 0.5 + aRandom * 6.28) * 0.02;
            pos += normalize(pos) * breath;
            float scatter = sin(uMorph * 3.14159) * 0.3;
            pos += normalize(pos + vec3(0.001)) * scatter * aRandom;
            vec3 toParticle = pos - uMouse3D;
            float xyDist = length(toParticle.xy);
            float fullDist = length(toParticle);
            float mouseRadius = 1.4;
            float influence = 1.0 - smoothstep(0.0, mouseRadius, xyDist);
            influence = influence * influence * uMouseActive;
            if (influence > 0.001) {
                vec3 pushDir = fullDist > 0.001 ? normalize(toParticle) : vec3(0.0, 1.0, 0.0);
                float pushStrength = influence * 0.3;
                pos += pushDir * pushStrength;
                float swirlSpeed = uTime * 2.0 + aRandom * 6.28;
                float swirlStrength = influence * 0.25;
                vec2 radial = pos.xy - uMouse3D.xy;
                float angle = swirlStrength * (1.0 + sin(swirlSpeed) * 0.3);
                float cosA = cos(angle); float sinA = sin(angle);
                vec2 rotated = vec2(radial.x * cosA - radial.y * sinA, radial.x * sinA + radial.y * cosA);
                pos.xy = uMouse3D.xy + rotated;
                pos.z += sin(swirlSpeed * 0.7 + aRandom * 3.14) * influence * 0.15;
                float jitter = sin(uTime * 4.0 + aRandom * 18.0) * 0.02 * influence;
                pos += pushDir * jitter;
            }
            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aSize * uPixelRatio * 500.0 / -mvPos.z;
            gl_PointSize = max(gl_PointSize, 1.5);
            gl_Position = projectionMatrix * mvPos;
            vAlpha = 0.85 + 0.15 * (1.0 - smoothstep(0.0, 10.0, -mvPos.z));
        }
    `,
    fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
            vec3 brightColor = vColor * 2.2 + 0.15;
            gl_FragColor = vec4(brightColor, alpha);
        }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2(9999, 9999);
const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const _invMatrix = new THREE.Matrix4();
const _localMouse = new THREE.Vector3();
const _intersectPoint = new THREE.Vector3();
let mouseOnScreen = false;
let mouseActiveSmooth = 0;

document.addEventListener('mousemove', (e) => {
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseOnScreen = true;
});
document.addEventListener('mouseleave', () => {
    mouseNDC.set(9999, 9999);
    mouseOnScreen = false;
});

function animateThree() {
    requestAnimationFrame(animateThree);
    const elapsed = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsed;

    const mouseTarget = mouseOnScreen ? 1 : 0;
    mouseActiveSmooth += (mouseTarget - mouseActiveSmooth) * 0.08;
    material.uniforms.uMouseActive.value = mouseActiveSmooth;

    raycaster.setFromCamera(mouseNDC, camera);
    raycaster.ray.intersectPlane(mousePlane, _intersectPoint);
    _invMatrix.copy(particles.matrixWorld).invert();
    _localMouse.copy(_intersectPoint).applyMatrix4(_invMatrix);
    material.uniforms.uMouse3D.value.copy(_localMouse);

    particles.rotation.y = elapsed * 0.05;
    particles.position.y = Math.sin(elapsed * 0.3) * 0.05;
    
    const sinT = Math.sin(elapsed * 0.2);
    const cosT = Math.cos(elapsed * 0.2);
    keyLight.position.x = sinT * 4;
    keyLight.position.z = cosT * 4;

    renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
});
animateThree();
