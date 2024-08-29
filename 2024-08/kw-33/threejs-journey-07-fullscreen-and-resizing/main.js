import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Cursor
const cursor = {
	x: 0,
	y: 0,
};
window.addEventListener("mousemove", (e) => {
	cursor.x = e.clientX / window.innerWidth - 0.5;
	cursor.y = -(e.clientY / window.innerHeight - 0.5);
});
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
// TODO: Insert solution for Safaris fullscreen bug
window.addEventListener("dblclick", (e) => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
// a) PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.target.y = .5;
controls.enableDamping = true;

// b) OrthographicCamera
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
// 	-1 * aspectRatio,
// 	1 * aspectRatio,
// 	1,
// 	-1,
// 	0.1,
// 	100
// );

camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Axes Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	// mesh.rotation.y = elapsedTime;

	// Update camera position
	// a) cursor
	// camera.position.x = cursor.x * 2;
	// camera.position.y = cursor.y * 2;

	// b) circular movement
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.y = cursor.y * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
	// camera.lookAt(mesh.position);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	requestAnimationFrame(tick);
};

tick();
