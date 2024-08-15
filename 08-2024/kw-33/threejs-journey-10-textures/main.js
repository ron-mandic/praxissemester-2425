import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Image sources
import imgAlpha from "/textures/door/alpha.jpg";
import imgAmbientOcclusion from "/textures/door/ambientOcclusion.jpg";
import imgColor from "/textures/door/color.jpg";
import imgHeight from "/textures/door/height.jpg";
import imgMetalness from "/textures/door/metalness.jpg";
import imgNormal from "/textures/door/normal.jpg";
import imgRoughness from "/textures/door/roughness.jpg";

// Textures
// a) Manual, hard way
/*
    const image = new Image();
    image.src = imgColor;
    const texture = new THREE.Texture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    image.onload = () => {
        texture.needsUpdate = true;
    };
*/
// b) Using TextureLoader and LoadManager
const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
// 	console.log("Loading started");
// };
// loadingManager.onLoad = () => {
// 	console.log("Loading finished");
// };
// loadingManager.onProgress = () => {
// 	console.log("Loading in progress");
// };
// loadingManager.onError = () => {
// 	console.log("Loading error");
// };
const textureLoader = new THREE.TextureLoader(loadingManager);
const textureColor = textureLoader.load(
	imgColor,
	() => {
		console.log("textureColor loaded");
	},
	() => {
		console.log("textureColor loading");
	},
	(error) => {
		console.log(error);
	}
);
textureColor.colorSpace = THREE.SRGBColorSpace;
// textureColor.repeat.x = 2;
// textureColor.repeat.y = 3;
// textureColor.offset.x = 0.5; // [0, 1]
// textureColor.offset.y = 0.5; // [0, 1]
// textureColor.center.x = 0.5; // [0, 1]
// textureColor.center.y = 0.5; // [0, 1]
// textureColor.rotation = Math.PI / 4;
// textureColor.wrapS = THREE.RepeatWrapping; // MirroredRepeatWrapping
// textureColor.wrapT = THREE.RepeatWrapping; // MirroredRepeatWrapping
// Filtering and mipmapping
// textureColor.minFilter = THREE.NearestFilter;
// textureColor.generateMipmaps = false; // when using NearestFilter on minFilter
// textureColor.magFilter = THREE.NearestFilter;

const textureAlpha = textureLoader.load(imgAlpha);
const textureAmbientOcclusion = textureLoader.load(imgAmbientOcclusion);
const textureHeight = textureLoader.load(imgHeight);
const textureMetalness = textureLoader.load(imgMetalness);
const textureNormal = textureLoader.load(imgNormal);
const textureRoughness = textureLoader.load(imgRoughness);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
console.log(geometry.attributes);

const material = new THREE.MeshBasicMaterial({ map: textureColor });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Axes helper
const axesHelper = new THREE.AxesHelper(100);
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

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
