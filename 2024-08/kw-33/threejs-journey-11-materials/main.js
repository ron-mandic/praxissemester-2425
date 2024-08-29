import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Texture
const textureLoader = new THREE.TextureLoader();
// Door
const doorTextureAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorTextureAmbientOcclusion = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg"
);
const doorTextureColor = textureLoader.load("/textures/door/color.jpg");
/**
 * Textures used as map / matcap: colorSpace should be set to SRGBColorSpace
 */
doorTextureColor.colorSpace = THREE.SRGBColorSpace;
const doorTextureHeight = textureLoader.load("/textures/door/height.jpg");
const doorTextureMetalness = textureLoader.load("/textures/door/metalness.jpg");
const doorTextureNormal = textureLoader.load("/textures/door/normal.jpg");
const doorTextureRoughness = textureLoader.load("/textures/door/roughness.jpg");
// Gradient
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
// Matcap
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// Scene
const scene = new THREE.Scene();

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

// 1. MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// // Color
// material.map = doorTextureColor;
// // Basic settings
// // material.color = new THREE.Color(0xff0000);
// // material.wireframe = true;
// material.transparent = true;
// // material.opacity = 0.25;
// material.side = THREE.DoubleSide; // demanding on performance
// // Alpha Map
// material.alphaMap = doorTextureAlpha; // transparency needs to be enabled
// // Ambient Occlusion
// material.aoMap = doorTextureAmbientOcclusion;
// material.aoMapIntensity = 1;

// // 2. MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// 3. MeshMatcapMaterial -> needs a reference texture looking like a sphere
// Material will pick colors from the texture depending on the normal of the face relative to the camera
// const material = new THREE.MeshMatcapMaterial();
//  // good at diffuse lighting, bad at specular lighting
// material.matcap = matcapTexture;
// // material.wireframe = true;

// 4. MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

// 5. MeshLambertMaterial -> requires light, same properties as MeshBasicMaterial
// const material = new THREE.MeshLambertMaterial({
// 	map: doorTextureColor,
// });
// // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// // scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// 6. MeshPhongMaterial -> less performant than MeshLambertMaterial, but no strange patterns on the surface
// const material = new THREE.MeshPhongMaterial();
// material.map = doorTextureColor;
// material.shininess = 100;
// material.specular = new THREE.Color(0xf4a261);

// 7. MeshToonMaterial -> similar to MeshPhongMaterial, but with a toon shading (aka cel shading)
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
// // be careful with the unprocessed gradient map, it can be stretched that is why ...
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

// 8. MeshStandardMaterial -> physically based rendering
// const gui = new GUI();
// const material = new THREE.MeshStandardMaterial();
// material.side = THREE.DoubleSide;
// material.map = doorTextureColor;
// material.metalness = 1; // contributing if using a metalness map
// material.roughness = 1; // contributing if using a roughness map
// material.metalnessMap = doorTextureMetalness;
// material.roughnessMap = doorTextureRoughness;
// material.aoMap = doorTextureAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = doorTextureHeight;
// material.displacementScale = 0.0375;
// material.normalMap = doorTextureNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorTextureAlpha;
// gui.add(material, "metalness").min(0).max(1).step(0.01);
// gui.add(material, "roughness").min(0).max(1).step(0.01);
// const environmentMapLoader = new RGBELoader();
// environmentMapLoader.load(
// 	"/textures/environmentMap/2k.hdr",
// 	(environmentMap) => {
// 		environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// 		scene.environment = environmentMap;
// 		scene.background = environmentMap;
// 	}
// );

// 9. MeshPhysicalMaterial -> more advanced version of MeshStandardMaterial
const gui = new GUI();
const material = new THREE.MeshPhysicalMaterial();
// material.side = THREE.DoubleSide;
// material.map = doorTextureColor;
material.metalness = 0; // contributing if using a metalness map
material.roughness = 0; // contributing if using a roughness map
// material.metalnessMap = doorTextureMetalness;
// material.roughnessMap = doorTextureRoughness;
// material.aoMap = doorTextureAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = doorTextureHeight;
// material.displacementScale = 0.0375;
// material.normalMap = doorTextureNormal;
// // material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorTextureAlpha;
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// // material.sheen = 1;
// // material.sheenRoughness = 0.25;
// // material.sheenColor.set(1, 1, 1);
// // material.iridescence = 1;
// // material.iridescenceIOR = 1.5;
// // material.iridescenceThicknessRange = [100, 800];
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;
gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);
// gui.add(material, "clearcoat").min(0).max(1).step(0.01);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.01);
// gui.add(material, "sheen").min(0).max(1).step(0.01);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.01);
// gui.addColor(material, "sheenColor");
// gui.add(material, "iridescence").min(0).max(1).step(0.01);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.01);
// gui.add(material.iridescenceThicknessRange, "0").min(0).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(0).max(1000).step(1);
gui.add(material, "transmission").min(0).max(1).step(0.01);
gui.add(material, "ior").min(1).max(10).step(0.01);
gui.add(material, "thickness").min(0).max(10).step(0.01);
const environmentMapLoader = new RGBELoader();
environmentMapLoader.load(
	"/textures/environmentMap/2k.hdr",
	(environmentMap) => {
		environmentMap.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = environmentMap;
		scene.background = environmentMap;
	}
);

// Objects
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
const planeGeo = new THREE.PlaneGeometry(1, 1, 64, 64);
const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 32, 32);
const sphereMesh = new THREE.Mesh(sphereGeo, material);
sphereMesh.position.x = -1.5;
const planeMesh = new THREE.Mesh(planeGeo, material);
const torusMesh = new THREE.Mesh(torusGeo, material);
torusMesh.position.x = 1.5;
scene.add(sphereMesh, planeMesh, torusMesh);

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

// Axes Helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Loop
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	// Update objects
	sphereMesh.rotation.y = elapsedTime * 0.25;
	planeMesh.position.y = 0.25 * Math.sin(elapsedTime);
	planeMesh.rotation.x -= 0.001;
	planeMesh.rotation.y += 0.0001;
	torusMesh.rotation.y = elapsedTime * 0.25;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
