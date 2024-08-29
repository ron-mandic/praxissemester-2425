import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
	width: 800,
	height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

let clicks = 0;
const DIVISOR = 36;
let divisor = DIVISOR;
document.addEventListener("keydown", (e) => {
	if (e.key !== "Enter") return;
	console.log("wdqwd");

	switch (clicks % 3) {
		case 0:
			divisor = (DIVISOR * 2) / 3; // +150% rotation speed
			break;
		case 1:
			divisor = DIVISOR / 2; // +200% rotation speed
			break;
		case 2:
			divisor = DIVISOR / 3; // +300% rotation speed
			break;
	}

	clicks += 1;
});

let time = Date.now();
const clock = new THREE.Clock();
const degtoRad = (deg) => (deg * Math.PI) / 180;
const rotationPerSecond = (deg) => degtoRad(deg);

gsap.to(mesh.position, { duration: 1, delay: 1, x: 1, y: 1 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 1, y: -1 });
gsap.to(mesh.position, { duration: 1, delay: 3, x: -1, y: -1 });
gsap.to(mesh.position, { duration: 1, delay: 4, x: -1, y: 1 });
gsap.to(mesh.position, { duration: 1, delay: 5, x: 0, y: 0 });

// Animations
const tick = () => {
	// 1. deltaTime
	// const currentTime = Date.now();
	// const deltaTime = currentTime - time;
	// time = currentTime;
	// mesh.rotation.y += 0.001 * deltaTime;

	// 2. Clock
	const elapsedTime = clock.getElapsedTime();
	// a) Rotation per second
	// mesh.rotation.y = elapsedTime * rotationPerSecond(45);
	// b) Counter clockwise rotation
	// mesh.position.y = Math.sin(elapsedTime);
	// mesh.position.x = Math.cos(elapsedTime);
	// c) Clockwise rotation
	// mesh.position.y = Math.sin(-elapsedTime);
	// mesh.position.x = Math.cos(-elapsedTime);
	// d) Camera animation
	// camera.position.y = Math.sin(elapsedTime);
	// camera.position.x = Math.cos(elapsedTime);
	// camera.lookAt(mesh.position);

	mesh.rotation.y = elapsedTime * rotationPerSecond(45);

	// mesh.rotation.y += Math.PI / divisor;
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
