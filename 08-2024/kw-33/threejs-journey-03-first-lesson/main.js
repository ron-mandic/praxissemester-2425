import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");
console.log(canvas);

// Scene
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, 800 / 600);
camera.position.x = 1;
camera.position.z = 3;

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(800, 600);
renderer.render(scene, camera);
