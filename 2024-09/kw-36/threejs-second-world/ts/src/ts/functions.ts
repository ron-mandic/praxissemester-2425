import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import {
	PLAYER_HEIGHT,
	PLAYER_HEIGHT_OFFSET,
	WORLD_CAMERA_FOVE,
} from "./constants";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import gsap from "gsap";
import { getAngle, ptToM } from "./math";
// import { DRACOLoader } from "three/examples/jsm/Addons.js";

// Getters
export function getAllDescendants(object: THREE.Object3D): THREE.Object3D[] {
	const descendants: THREE.Object3D[] = [];

	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			descendants.push(child);
			return;
		}

		if (child instanceof THREE.Group) {
			for (const c of child.children) {
				if (c instanceof THREE.Mesh) descendants.push(c);
			}
		}
	});

	return descendants;
}

// Handlers
function onLoadPlayer(this: ReturnType<typeof createWorld>) {
	const player = this.player!;

	player.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.material = this.materials[0];
		}
	});

	player.position.setY(PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET);
	this.scene.add(player);
}
function onReady(this: ReturnType<typeof createWorld>) {
	const world = this;

	onResize(world.renderer, world.camera);
	onKeydown(world);
	onKeyup(world);

	if (world.onReady) world.onReady();
}
export function onResize(
	renderer: THREE.WebGLRenderer,
	camera: THREE.OrthographicCamera
) {
	window.addEventListener("resize", () => {
		const aspect = window.innerWidth / window.innerHeight;
		camera.top = WORLD_CAMERA_FOVE;
		camera.bottom = -WORLD_CAMERA_FOVE;
		camera.left = -WORLD_CAMERA_FOVE * aspect;
		camera.right = WORLD_CAMERA_FOVE * aspect;

		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}
export function onKeydown(world: ReturnType<typeof createWorld>) {
	window.addEventListener("keydown", function (event) {
		if (!world.player) return;
		world.keyPressed = event.code;
		if (!world.keysPressed.has(event.code) && world.keysPressed.size < 2) {
			world.keysPressed.set(event.code, true);
		}
		if (world.keysPressed.size === 2) return;

		switch (event.code) {
			case "KeyW":
				if (world.keysPressed.size === 2) return;
				world.vec3Dir.set(-1, 0, 0);
				if (!event.repeat) {
					gsap.to(world.player.rotation, {
						y: `+=${getAngle(world.vec3Dir, world.vec3DirLast)}`,
						duration: 0.5,
						ease: "slow(0.7,0.7,false)",
					});
				}
				world.vec3DirLast.copy(world.vec3Dir);
				break;
			case "KeyA":
				if (world.keysPressed.size === 2) return;
				world.vec3Dir.set(0, 0, 1);
				if (!event.repeat) {
					gsap.to(world.player.rotation, {
						y: `+=${getAngle(world.vec3Dir, world.vec3DirLast)}`,
						duration: 0.5,
						ease: "slow(0.7,0.7,false)",
					});
				}
				world.vec3DirLast.copy(world.vec3Dir);
				break;
			case "KeyS":
				if (world.keysPressed.size === 2) return;
				world.vec3Dir.set(1, 0, 0);
				if (!event.repeat) {
					gsap.to(world.player.rotation, {
						y: `+=${getAngle(world.vec3Dir, world.vec3DirLast)}`,
						duration: 0.5,
						ease: "slow(0.7,0.7,false)",
					});
				}
				world.vec3DirLast.copy(world.vec3Dir);
				break;
			case "KeyD":
				if (world.keysPressed.size === 2) return;
				world.vec3Dir.set(0, 0, -1);
				world.keyPressed = event.code;
				if (
					!world.keysPressed.has(event.code) &&
					world.keysPressed.size < 2
				) {
					world.keysPressed.set(event.code, true);
				}
				if (world.keysPressed.size === 2) return;
				if (!event.repeat) {
					gsap.to(world.player.rotation, {
						y: `+=${getAngle(world.vec3Dir, world.vec3DirLast)}`,
						duration: 0.5,
						ease: "slow(0.7,0.7,false)",
					});
				}
				world.vec3DirLast.copy(world.vec3Dir);
				break;
			default:
				return;
		}
	});
}
export function onKeyup(world: ReturnType<typeof createWorld>) {
	window.addEventListener("keyup", (event) => {
		world.vec3Dir.set(0, 0, 0);
		world.keyPressed = null;
		if (world.keysPressed.has(event.code))
			world.keysPressed.delete(event.code);
	});
}

// Init
export function initLoaders(
	world: ReturnType<typeof createWorld>,
	loaders: ReturnType<typeof createLoaders>
) {
	world.loaders = loaders;
	world.loadTexture = function (
		path: string,
		onLoad?: (texture: THREE.Texture) => void
	) {
		const texture = this.loaders!.textureLoader.load(path);
		texture.colorSpace = THREE.SRGBColorSpace;
		if (onLoad) onLoad(texture);
		this.textures.push(texture);
		return texture;
	};
	world.loadCubeTexture = function (
		imgs: string[],
		onLoad?: (cubeTexture: THREE.CubeTexture) => void
	) {
		const cubeTexture = this.loaders!.cubeTextureLoader.load(imgs);
		if (onLoad) onLoad(cubeTexture);
		this.texturesCube = cubeTexture;
		return cubeTexture;
	};
	world.loadOBJ = function (
		path: string,
		onLoad: (data: THREE.Group) => void
	) {
		this.loaders!.objLoader.load(path, onLoad);
		return world;
	};
	world.loadGLTF = function (path: string, onLoad: (data: GLTF) => void) {
		this.loaders!.gltfLoader.load(path, onLoad, (_: ProgressEvent) => {
			// console.log(~~((ev.loaded / ev.total) * 100) + "%");
		});
		return world;
	};
	world.createMaterial = function (matcap: THREE.Texture) {
		const material = new THREE.MeshMatcapMaterial({
			matcap,
		});
		this.materials.push(material);
		return material;
	};
}
export function initStats(world: ReturnType<typeof createWorld>) {
	document.body.appendChild(world.stats.dom);
}
export function initScene(world: ReturnType<typeof createWorld>) {
	const geometry = new THREE.BoxGeometry(...ptToM([216, 4.1, 216]), 4, 1, 4);
	const objFloor = new THREE.Mesh(
		geometry,
		new THREE.MeshBasicMaterial({
			color: 0xfafafa,
		})
	);

	objFloor.position.set(0, -0.056944 / 2, 0);
	world.scene.add(objFloor);
}

// Create
export function createRenderer(canvas: HTMLCanvasElement) {
	const renderer = new THREE.WebGLRenderer({
		powerPreference: "high-performance",
		precision: "highp",
		antialias: true,
		canvas,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 2;

	return renderer;
}
export function createCamera() {
	const aspectRatio = window.innerWidth / window.innerHeight;
	const camera = new THREE.OrthographicCamera(
		-WORLD_CAMERA_FOVE * aspectRatio,
		WORLD_CAMERA_FOVE * aspectRatio,
		WORLD_CAMERA_FOVE,
		-WORLD_CAMERA_FOVE,
		0.001,
		1000
	);
	camera.position.set(20, 20, 20);
	camera.lookAt(0, 0, 0);

	return camera;
}
export function createScene(color: number | string) {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(color);

	return scene;
}
export function createControls(
	object: THREE.Camera,
	domElement: HTMLCanvasElement
) {
	const controls = new OrbitControls(object, domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	controls.enablePan = false;
	controls.enableRotate = false;
	controls.autoRotate = false;
	controls.update();
}
export function createHelpers(
	scene: THREE.Scene,
	camera: THREE.OrthographicCamera
) {
	const gridHelper = new THREE.GridHelper(3, 3, undefined, 0xcdcdcd);
	scene.add(gridHelper);
	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);
	const cameraHelper = new THREE.CameraHelper(camera);
	scene.add(cameraHelper);
}
export function createLoaders(onLoad: () => void, onReady?: () => void) {
	const manager = new THREE.LoadingManager(onLoad, (url, loaded, total) => {
		console.log(`Loading ${url}: ${loaded} of ${total}`);

		if (loaded === total) if (onReady) onReady();
	});

	const textureLoader = new THREE.TextureLoader(manager);
	const cubeTextureLoader = new THREE.CubeTextureLoader(manager);
	cubeTextureLoader.setPath("/textures/cube/");
	const objLoader = new OBJLoader(manager);
	// const dracoLoader = new DRACOLoader();
	// dracoLoader.setDecoderPath("/models/gltf/");
	const gltfLoader = new GLTFLoader(manager);
	gltfLoader.setPath("/models/gltf/");
	// gltfLoader.setDRACOLoader(dracoLoader);

	return {
		textureLoader,
		cubeTextureLoader,
		objLoader,
		gltfLoader,
		// dracoLoader,
	};
}

export function createWorld(canvas: HTMLCanvasElement, color = 0xfafafa) {
	const renderer = createRenderer(canvas);
	const camera = createCamera();
	const scene = createScene(color);
	const clock = new THREE.Clock();
	const stats = new Stats();

	createHelpers(scene, camera);
	createControls(camera, renderer.domElement);

	const world = {
		// General
		renderer,
		camera,
		scene,
		clock,
		stats,
		textures: [] as THREE.Texture[],
		texturesCube: null as THREE.CubeTexture | null,
		materials: [] as THREE.MeshMatcapMaterial[],
		// Player
		player: null as THREE.Group<THREE.Object3DEventMap> | null,
		playerDescendants: [] as THREE.Object3D[],
		vec3Dir: new THREE.Vector3(),
		vec3DirLast: new THREE.Vector3(),
		keyPressed: null as string | null,
		keysPressed: new Map<string, boolean>(),
		loaders: null as ReturnType<typeof createLoaders> | null,
		// Loading mechanisms
		loadTexture: null as
			| ((
					path: string,
					onLoad?: (texture: THREE.Texture) => void
			  ) => THREE.Texture)
			| null,
		loadCubeTexture: null as
			| ((
					imgs: string[],
					onLoad: (data: THREE.CubeTexture) => void
			  ) => THREE.CubeTexture)
			| null,
		loadOBJ: null as
			| ((path: string, onLoad: (data: THREE.Group) => void) => void)
			| null,
		loadGLTF: null as
			| ((path: string, onLoad: (data: GLTF) => void) => void)
			| null,
		createMaterial: null as
			| ((matcap: THREE.Texture) => THREE.MeshMatcapMaterial)
			| null,
		animate: null as ((callback: (delta?: number) => void) => void) | null,
		onReady: null as (() => void) | null,
	};

	initLoaders(
		world,
		createLoaders(onLoadPlayer.bind(world), onReady.bind(world))
	);
	initStats(world);
	initScene(world);

	return world;
}
