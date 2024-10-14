import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

// Shadow Map
// See https://threejs.org/examples/webgl_shadowmap_viewer.html

// TextureLoader
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
simpleShadow.colorSpace = THREE.SRGBColorSpace;

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
 * Lights
 *
 * Three types of lights that support shadows:
 * - PointLight
 * - DirectionalLight
 * - SpotLight
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

// Shadow map properties
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.radius = 10;

scene.add(directionalLight);

// Camera Helper for Shadow Map
const directionalLightCameraHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

const spotLight = new THREE.SpotLight(
	0xffffff,
	0.4,
	10,
	Math.PI * 0.1,
	0.25,
	1
);
spotLight.position.set(0, 2, 2);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

// Since pointLights look at all 6 faces, it ends up pointing downwards
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;

scene.add(pointLight);
scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(5, 5),
	material // new THREE.MeshBasicMaterial({ map: bakedShadow })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(sphere, plane);

// Fake shadow for the sphere
const sphereShadow = new THREE.Mesh(
	new THREE.PlaneGeometry(1.5, 1.5),
	new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true,
		alphaMap: simpleShadow,
	})
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 1e-2;
scene.add(sphereShadow);

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
camera.position.z = 2;
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

// Enable shadows
// renderer.shadowMap.enabled = true; // only core shadows, no drop shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
    controls.update();
    
    // Update sphere
    sphere.position.x = Math.sin(elapsedTime) * 1.5;
    sphere.position.z = Math.cos(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    // Update fake sphere shadow
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.5;
    sphereShadow.scale.setScalar(1 - Math.abs(sphere.position.y) * 0.3);

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
