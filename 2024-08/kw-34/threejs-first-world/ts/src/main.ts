import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { getAngle } from "./ts/math";

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/2.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const Player = {
	mesh: null as THREE.Group<THREE.Object3DEventMap> | null,
};
const material = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const fove = 1.75; // Field of view expansion
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
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;

// Create GridHelper
const gridHelper = new THREE.GridHelper(4, 4, undefined, 0x666666);
scene.add(gridHelper);

// Create AxesHelper
const axesHelper = new THREE.AxesHelper(100);
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

camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

const gltfLoader = new GLTFLoader().setPath("/models/gltf/");
gltfLoader.load("robot.glb", function (gltf) {
	console.log(gltf);
	const model = gltf.scene;
	model.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			child.material = material;
		}
	});

	// Berechne die Bounding Box des Modells
	const boundingBox = new THREE.Box3().setFromObject(model);

	// Ermittle die Maße des Modells
	const size = new THREE.Vector3();
	boundingBox.getSize(size);

	console.log("Breite:", size.x);
	console.log("Höhe:", size.y);
	console.log("Tiefe:", size.z);

	// Zielmaße (1x1x1)
	const targetSize = new THREE.Vector3(1, 1, 1);

	const SCALAR = size.x / 100;
	// Berechne den Skalierungsfaktor
	const scale = new THREE.Vector3(
		targetSize.x / size.x,
		targetSize.y / size.y,
		targetSize.z / size.z
	).applyMatrix3(new THREE.Matrix3(SCALAR, 0, 0, 0, SCALAR, 0, 0, 0, SCALAR));

	// Wähle den kleinsten Skalierungsfaktor, um das Objekt so zu skalieren, dass es innerhalb der 1x1x1-Einheit bleibt
	const minScale = Math.min(scale.x, scale.y, scale.z);

	// Skaliere das Modell
	Player.mesh = model;
	model.scale.set(minScale, minScale, minScale);

	scene.add(model);
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

const vec3Dir = new THREE.Vector3();
const vec3DirLast = new THREE.Vector3();

let keyPressed: null | string = null;
const keysPressed = new Map<string, boolean>();

window.addEventListener("keydown", function (event) {
	if (!Player || !Player.mesh) return;
	keyPressed = event.code;
	if (!keysPressed.has(event.code) && keysPressed.size < 2) {
		keysPressed.set(event.code, true);
	}
	if (keysPressed.size === 2) return;

	switch (event.code) {
		case "KeyW":
			if (keysPressed.size === 2) return;
			vec3Dir.set(-1, 0, 0);
			if (!event.repeat) {
				gsap.to(Player.mesh.rotation, {
					y: `+=${getAngle(vec3Dir, vec3DirLast)}`,
					duration: 0.5,
					ease: "slow(0.7,0.7,false)",
				});
			}
			vec3DirLast.copy(vec3Dir);
			break;
		case "KeyA":
			if (keysPressed.size === 2) return;
			vec3Dir.set(0, 0, 1);
			if (!event.repeat) {
				gsap.to(Player.mesh.rotation, {
					y: `+=${getAngle(vec3Dir, vec3DirLast)}`,
					duration: 0.5,
					ease: "slow(0.7,0.7,false)",
				});
			}
			vec3DirLast.copy(vec3Dir);
			break;
		case "KeyS":
			if (keysPressed.size === 2) return;
			vec3Dir.set(1, 0, 0);
			if (!event.repeat) {
				gsap.to(Player.mesh.rotation, {
					y: `+=${getAngle(vec3Dir, vec3DirLast)}`,
					duration: 0.5,
					ease: "slow(0.7,0.7,false)",
				});
			}
			vec3DirLast.copy(vec3Dir);
			break;
		case "KeyD":
			if (keysPressed.size === 2) return;
			vec3Dir.set(0, 0, -1);
			keyPressed = event.code;
			if (!keysPressed.has(event.code) && keysPressed.size < 2) {
				keysPressed.set(event.code, true);
			}
			if (keysPressed.size === 2) return;
			if (!event.repeat) {
				gsap.to(Player.mesh.rotation, {
					y: `+=${getAngle(vec3Dir, vec3DirLast)}`,
					duration: 0.5,
					ease: "slow(0.7,0.7,false)",
				});
			}
			vec3DirLast.copy(vec3Dir);
			break;
		default:
			return;
	}
});

window.addEventListener("keyup", function (event) {
	vec3Dir.set(0, 0, 0);
	keyPressed = null;
	if (keysPressed.has(event.code)) keysPressed.delete(event.code);
});

const clock = new THREE.Clock();

function animate(_: number) {
	// console.log(time);

	// Update Player
	const dt = clock.getDelta();

	if (Player.mesh && keysPressed.size <= 1) {
		Player.mesh.position.add(vec3Dir.clone().multiplyScalar(2 * dt));
	}

	camera.position.x = (Player.mesh?.position?.x || 0) + 20;
	camera.position.z = (Player.mesh?.position?.z || 0) + 20;
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
