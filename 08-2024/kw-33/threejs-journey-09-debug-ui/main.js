import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const debugObject = {
	color: "#a778d8",
	widthSegments: 1,
	heightSegments: 1,
	depthSegments: 1,
	spin() {
		gsap.to(mesh.rotation, {
			duration: 1,
			y: mesh.rotation.y + Math.PI * 2,
		});
	},
};

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: debugObject.color,
	wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// lil-gui
const gui = new GUI({
	title: "09 Debug UI",
	width: 250,
});
// gui.close();
gui.add(mesh, "visible");
gui.add(mesh.material, "wireframe");
gui.addFolder("Animations").add(debugObject, "spin");
gui.addFolder("Color")
	.addColor(debugObject, "color")
	.onChange((_) => {
		material.color.set(debugObject.color);
	});
const folderPosition = gui.addFolder("Position");
folderPosition.add(mesh.position, "x", -5, 5, 0.1);
folderPosition.add(mesh.position, "y", -5, 5, 0.1);
folderPosition.add(mesh.position, "z", -5, 5, 0.1);
const folderScale = gui.addFolder("Scale");
folderScale.add(mesh.scale, "x", -5, 5, 0.1);
folderScale.add(mesh.scale, "y", -5, 5, 0.1);
folderScale.add(mesh.scale, "z", -5, 5, 0.1);
const folderRotation = gui.addFolder("Rotation");
folderRotation.add(mesh.rotation, "x", -Math.PI, Math.PI, 0.01);
folderRotation.add(mesh.rotation, "y", -Math.PI, Math.PI, 0.01);
folderRotation.add(mesh.rotation, "z", -Math.PI, Math.PI, 0.01);
const folderDivisions = gui.addFolder("Divisions");
folderDivisions
	.add(debugObject, "widthSegments", 1, 20, 1)
	.onFinishChange(() => {
		mesh.geometry.dispose();
		mesh.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.widthSegments,
			debugObject.heightSegments,
			debugObject.depthSegments
		);
	});
folderDivisions
	.add(debugObject, "heightSegments", 1, 20, 1)
	.onFinishChange(() => {
		mesh.geometry.dispose();
		mesh.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.widthSegments,
			debugObject.heightSegments,
			debugObject.depthSegments
		);
	});
folderDivisions
	.add(debugObject, "depthSegments", 1, 20, 1)
	.onFinishChange(() => {
		mesh.geometry.dispose();
		mesh.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.widthSegments,
			debugObject.heightSegments,
			debugObject.depthSegments
		);
	});
window.addEventListener("keydown", (event) => {
	if (event.key.toLowerCase() === "g") {
		gui.show(gui._hidden);
	}
});

// Tweakpane

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

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
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
