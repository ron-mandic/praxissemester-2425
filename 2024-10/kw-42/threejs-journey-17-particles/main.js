import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/1.png");

/**
 * Particles
 */
// Geometry
// const spheresGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry();
const COUNT = 5e4;

const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 10;
	colors[i] = Math.random();
}

particlesGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();

particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = false; // Make particles smaller as they get further from the camera
particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture; // Use the loaded texture for the alpha channel (transparency)
// particlesMaterial.alphaTest = 0.01 // Uncomment to discard pixels with alpha value below 0.01
// particlesMaterial.depthTest = false // Uncomment to disable depth testing, particles will always be drawn
particlesMaterial.depthWrite = false; // Prevent particles from writing to the depth buffer
particlesMaterial.blending = THREE.AdditiveBlending; // Use additive blending for a glowing effect
particlesMaterial.vertexColors = true; // Use colors from the geometry's color attribute + base color (.color)

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Better alternative: Custom shader for the same sinus particle animation

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update particles
	for (let i = 0; i < COUNT * 3; i += 3) {
		const x = particlesGeometry.attributes.position.array[i];
		particlesGeometry.attributes.position.array[i + 1] = Math.sin(
			elapsedTime + x
		);
	}
	particlesGeometry.attributes.position.needsUpdate = true;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
