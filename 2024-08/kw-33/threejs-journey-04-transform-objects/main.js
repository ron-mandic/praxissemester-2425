import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometryA = new THREE.BoxGeometry(1, 1, 1);
const geometryB = new THREE.BoxGeometry(1, 1, 1);
const geometryC = new THREE.BoxGeometry(1, 1, 1);
const materialA = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
const materialB = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true,
});
const materialC = new THREE.MeshBasicMaterial({
	color: 0x0000ff,
	wireframe: true,
});
const meshA = new THREE.Mesh(geometryA, materialA);
const meshB = new THREE.Mesh(geometryB, materialB);
const meshC = new THREE.Mesh(geometryC, materialC);
meshB.position.set(1, 1, 0);
meshC.position.set(-1, 1, 0);
const group = new THREE.Group();
group.add(meshA, meshB, meshC);
scene.add(group);

// Camera
const camera = new THREE.PerspectiveCamera(75, 800 / 600);
camera.position.set(0.5, 1, 3);
scene.add(camera);

// Axes Helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(800, 600);
renderer.render(scene, camera);
