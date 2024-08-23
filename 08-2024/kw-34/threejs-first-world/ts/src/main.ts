import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import gsap from "gsap";

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/2.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const Player = {
	mesh: null as THREE.Group<THREE.Object3DEventMap> | null,
	velocity: new THREE.Vector3(),
	acceleration: 0.35,
	deceleration: 0.875,
	maxSpeed: 0.125,
	direction: new THREE.Vector3(),
};
const material = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});

const loader = new OBJLoader();
function onProgress(xhr: ProgressEvent) {
	if (xhr.lengthComputable) {
		const percentComplete = (xhr.loaded / xhr.total) * 100;
		console.log("model " + percentComplete.toFixed(2) + "% downloaded");
	}
}

function onError() {}
loader.load(
	"/models/obj/robot.obj",
	function (model) {
		model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material = material;
			}
			const rotationMatrix = new THREE.Matrix4().makeRotationY(Math.PI);
			child.getObjectByName("model_1")?.applyMatrix4(rotationMatrix);
			child.rotation.set(0, 0, 0);
		});
		model.scale.set(0.1, 0.1, 0.1);
		model.position.setY(1e-2);
		Player.mesh = model;
		scene.add(model);
	},
	onProgress,
	onError
);

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const fove = 5; // Field of view expansion
const camera = new THREE.OrthographicCamera(
	-fove * aspectRatio,
	fove * aspectRatio,
	fove,
	-fove,
	0.001,
	1000
);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#app canvas")!,
	antialias: true,
	precision: "lowp",
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create GridHelper
const gridHelper = new THREE.GridHelper(16, 16, undefined, 0x666666);
scene.add(gridHelper);

// Create AxesHelper
const axesHelper = new THREE.AxesHelper(8);
scene.add(axesHelper);

// Create CameraHelper
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enablePan = false;
controls.enableRotate = false;
controls.autoRotate = false;
controls.update();

camera.position.x = 20;
camera.position.y = 20;
camera.position.z = 20;
camera.lookAt(0, 0, 0);

window.addEventListener("keydown", (e) => {
	const deltaSpeed = 0.5;

	switch (e.key) {
		case "w":
		case "W":
			Player.direction.x = -deltaSpeed;
			console.log(Player.direction);
			if (e.repeat) break;
			gsap.to(Player.mesh!.rotation, {
				duration: 0.25,
				y: 0,
			});
			break;
		case "s":
		case "S":
			Player.direction.x = deltaSpeed;
			console.log(Player.direction);
			if (e.repeat) break;
			// TODO: Fix rotation issue
			gsap.to(Player.mesh!.rotation, {
				duration: 0.25,
				y: -Math.PI,
			});
			break;
		case "a":
		case "A":
			Player.direction.z = deltaSpeed;
			console.log(Player.direction);
			if (e.repeat) break;
			gsap.to(Player.mesh!.rotation, {
				duration: 0.25,
				y: Math.PI / 2,
			});
			break;
		case "d":
		case "D":
			Player.direction.z = -deltaSpeed;
			console.log(Player.direction);
			if (e.repeat) break;
			gsap.to(Player.mesh!.rotation, {
				duration: 0.25,
				y: -Math.PI / 2,
			});
			break;
	}
});

window.addEventListener("keyup", (e) => {
	console.log(e.key);

	switch (e.key) {
		case "w":
		case "W":
		case "s":
		case "S":
			Player.direction.x = 0;
			break;
		case "a":
		case "A":
		case "d":
		case "D":
			Player.direction.z = 0;
			break;
	}
});

window.addEventListener("resize", function () {
	const aspect = window.innerWidth / window.innerHeight;
	camera.top = fove;
	camera.bottom = -fove;
	camera.left = -fove * aspect;
	camera.right = fove * aspect;
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate(_: number) {
	// console.log(time);

	// Update Player
	// if (Player.direction.length() > 0)
	Player.velocity.addScaledVector(Player.direction, Player.acceleration); // if
	Player.velocity.clampLength(0, Player.maxSpeed); // else
	Player.velocity.multiplyScalar(Player.deceleration);
	Player.mesh?.position.add(Player.velocity);
	if (Player.velocity.length() < 0.01) {
		Player.velocity.set(0, 0, 0);
	}

	camera.position.x = (Player.mesh?.position?.x || 0) + 20;
	camera.position.z = (Player.mesh?.position?.z || 0) + 20;
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
