import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
// Source: three/examples/fonts/*.json
import typefaceFont from "/fonts/helvetiker_regular.typeface.json?url";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Debug
const gui = new GUI();
const donuts = [];

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// Fonts
const fontLoader = new FontLoader();
fontLoader.load(typefaceFont, (font) => {
	const BEVEL_SIZE = 0.02;
	const BEVEL_THICKNESS = 0.03;
	const textGeometry = new TextGeometry("Hello Three.js", {
		font,
		size: 0.5,
		depth: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: BEVEL_SIZE,
		bevelOffset: BEVEL_THICKNESS,
		bevelSegments: 4,
	});
	// a) Algorithmic way
	textGeometry.center();
	// b) Manual way
	// textGeometry.computeBoundingBox();
	// textGeometry.translate(
	// 	-(textGeometry.boundingBox.max.x - BEVEL_SIZE) * 0.5,
	// 	-(textGeometry.boundingBox.max.y - BEVEL_SIZE) * 0.5,
	// 	-(textGeometry.boundingBox.max.z - BEVEL_THICKNESS) * 0.5
	// );
	// textGeometry.computeBoundingBox();
	// console.log(textGeometry.boundingBox); // Confirm that the bounding box is correct

	const material = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	const text = new THREE.Mesh(textGeometry, material);
	// text.translateX(-textGeometry.boundingBox.max.x * 0.5); // Alternative
	scene.add(text);

	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

	console.time("Donuts");

	for (let i = 0; i < 400; i++) {
		const donut = new THREE.Mesh(donutGeometry, material);
		donut.position.x = (Math.random() - 0.5) * 17;
		donut.position.y = (Math.random() - 0.5) * 17;
		donut.position.z = (Math.random() - 0.5) * 17;
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		donuts.push(donut);
		scene.add(...donuts);
	}

	console.timeEnd("Donuts");
});

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
camera.position.z = 3.125;
camera.lookAt(new THREE.Vector3());
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Axes Helper
const axesHelper = new THREE.AxesHelper(100);
axesHelper.visible = false;
gui.add(axesHelper, "visible");
scene.add(axesHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const random = (min, max) => Math.random() * (max - min) + min;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Update each donut
	donuts.forEach((donut, index) => {
		donut.rotation.x += 1e-2;
		donut.rotation.y += 1e-2;
	});

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
