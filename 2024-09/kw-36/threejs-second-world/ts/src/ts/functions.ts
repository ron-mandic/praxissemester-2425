import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import {
	KEYS,
	PLAYER_HEIGHT,
	PLAYER_HEIGHT_OFFSET,
	RAPIER_WORLD_GRAVITY,
	WORLD_CAMERA_FOVE,
} from "./constants";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import gsap from "gsap";
import { getAngle, ptToM } from "./math";
import { RAPIER, RAPIER_WORLD_BODY } from "./types";
import {
	RigidBody,
	RigidBodyDesc,
	ColliderDesc,
	Vector3,
	World,
	Quaternion,
} from "@dimforge/rapier3d-compat";
import { Group, Mesh, Object3DEventMap, Raycaster } from "three";
import { RapierDebugRenderer } from "./classes";

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

// Setters
function setVec3(vec3: Vector3, x: number, y: number, z: number) {
	vec3.x = x;
	vec3.y = y;
	vec3.z = z;
}
function setPlayerDir(experience: ReturnType<typeof createExperience>) {
	const ROOT_OF_TWO = Math.sqrt(2) / 2;
	const keys = experience.keysPressed;
	const vec3 = experience.playerDir;

	// WASD Diagonals (normalised)
	// Hint: The maximum size is already capped at 2
	if (keys.has("KeyW") && keys.has("KeyA")) {
		// Negative x, positive z
		setVec3(vec3, -ROOT_OF_TWO, 0, ROOT_OF_TWO);
		experience.playerDirNum = 1;
		return;
	}
	if (keys.has("KeyS") && keys.has("KeyA")) {
		// Positive x, positive z
		setVec3(vec3, ROOT_OF_TWO, 0, ROOT_OF_TWO);
		experience.playerDirNum = 3;
		return;
	}
	if (keys.has("KeyS") && keys.has("KeyD")) {
		// Positive x, negative z
		setVec3(vec3, ROOT_OF_TWO, 0, -ROOT_OF_TWO);
		experience.playerDirNum = 5;
		return;
	}
	if (keys.has("KeyW") && keys.has("KeyD")) {
		// Negative x, negative z
		setVec3(vec3, -ROOT_OF_TWO, 0, -ROOT_OF_TWO);
		experience.playerDirNum = 7;
		return;
	}

	// WASD (Isometric Landscape)
	if (keys.has("KeyW") && keys.size === 1) {
		// Negative x
		setVec3(vec3, -1, 0, 0);
		experience.playerDirNum = 0;
		return;
	}
	if (keys.has("KeyA") && keys.size === 1) {
		// Positive z
		setVec3(vec3, 0, 0, 1);
		experience.playerDirNum = 2;
		return;
	}
	if (keys.has("KeyS") && keys.size === 1) {
		// Positive x
		setVec3(vec3, 1, 0, 0);
		experience.playerDirNum = 4;
		return;
	}
	if (keys.has("KeyD") && keys.size === 1) {
		// Negative z
		setVec3(vec3, 0, 0, -1);
		experience.playerDirNum = 6;
		return;
	}

	// Only if invalid keys or no keys are pressed
	setVec3(vec3, 0, 0, 0);
}
function resetPlayerDir(
	experience: ReturnType<typeof createExperience>
	/* releasedKey?: string */
) {
	const keys = experience.keysPressed;
	const vec3 = experience.playerDir;
	// console.log(releasedKey);
	if (keys.size === 0) {
		setVec3(vec3, 0, 0, 0);
		experience.playerDirNum = null;
		return;
	}

	// WASD (Isometric Landscape)
	if (keys.has("KeyW") && keys.size === 1) {
		// Negative x
		setVec3(vec3, -1, 0, 0);
		experience.playerDirNum = 0;
		return;
	}
	if (keys.has("KeyA") && keys.size === 1) {
		// Positive z
		setVec3(vec3, 0, 0, 1);
		experience.playerDirNum = 2;
		return;
	}
	if (keys.has("KeyS") && keys.size === 1) {
		// Positive x
		setVec3(vec3, 1, 0, 0);
		experience.playerDirNum = 4;
		return;
	}
	if (keys.has("KeyD") && keys.size === 1) {
		// Negative z
		setVec3(vec3, 0, 0, -1);
		experience.playerDirNum = 6;
		return;
	}
}

// Handlers
function onLoadPlayer(this: ReturnType<typeof createExperience>) {
	const player = this.player!;

	player.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.material = this.materials[0];
		}
	});

	player.position.setY(PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET);
	this.scene.add(player);
}
function onReady(this: ReturnType<typeof createExperience>) {
	const experience = this;

	onResize(experience.renderer, experience.camera);
	onKeydown(experience);
	onKeyup(experience);
	onClick(experience);

	if (experience.onReady) experience.onReady();
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
export function onClick(experience: ReturnType<typeof createExperience>) {
	const { renderer, camera, bodies, mouse, raycaster } = experience;

	renderer.domElement.addEventListener("click", (e) => {
		mouse.set(
			(e.clientX / renderer.domElement.clientWidth) * 2 - 1,
			-(e.clientY / renderer.domElement.clientHeight) * 2 + 1
		);
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(
			experience.playerDescendants,
			true
		);

		if (intersects[0]?.object.name === "Robot") {
			const playerBody = bodies[0][1];
			playerBody.applyImpulse(
				new Vector3(0, RAPIER_WORLD_GRAVITY, 0),
				true
			);
		}
	});
}
export function onKeydown(experience: ReturnType<typeof createExperience>) {
	const keys = experience.keysPressed;

	window.addEventListener("keydown", function (event) {
		if (keys.size > 2) return;
		if (event.repeat) return;
		if (!KEYS.some((key) => key === event.code)) return;

		keys.set(event.code, true);
		setPlayerDir(experience);
		experience.playerSpeed = 0.28; // m/s
	});
}
export function onKeyup(experience: ReturnType<typeof createExperience>) {
	const keys = experience.keysPressed;

	window.addEventListener("keyup", (event) => {
		if (event.repeat) return;
		keys.delete(event.code);
		resetPlayerDir(experience);
		if (keys.size === 0) experience.playerSpeed = 0;
	});
}

// Init
export function initDebug(experience: ReturnType<typeof createExperience>) {
	const { scene, world } = experience;
	const debug = new RapierDebugRenderer(scene, world);
	experience.debugRenderer = debug;
}

export function initWorld(
	experience: ReturnType<typeof createExperience>,
	data: RAPIER_WORLD_BODY[]
) {
	const { world } = experience;
	if (!world) throw new Error("World not found");

	for (let obj of data) {
		const {
			type,
			translation,
			shape: s,
			sizes,
			mass,
			restitution,
			linearDamping,
			friction,
			getObject,
		} = obj;
		const { x, y, z } = translation;

		let body;
		if (type === "fixed") {
			body = world.createRigidBody(
				// @ts-ignore
				RigidBodyDesc[type]().setTranslation(x, y, z)
			);
		} else if (type === "dynamic") {
			body = world.createRigidBody(
				// @ts-ignore
				RigidBodyDesc[type]().setTranslation(x, y, z).setCanSleep(false)
			);
		}

		let shape;
		if (s === "cuboid") {
			let { hx, hy, hz } = sizes as {
				hx: number;
				hy: number;
				hz: number;
			};
			// @ts-ignore
			shape = ColliderDesc.cuboid(hx, hy, hz);
		} else if (s === "cylinder") {
			let { halfHeight, radius } = sizes as {
				halfHeight: number;
				radius: number;
			};
			// @ts-ignore
			shape = ColliderDesc.cylinder(halfHeight, radius);
		}

		if (type === "dynamic") {
			shape?.setMass(mass || 1);
			if (restitution) shape?.setRestitution(restitution);
			if (friction) shape?.setFriction(friction);
			// @ts-ignore
			experience.bodies.push([
				// @ts-ignore
				experience.scene.children.find(getObject),
				// @ts-ignore
				body,
			]);
		}

		// @ts-ignore
		world.createCollider(shape, body);
	}
}

export function initLoaders(
	world: ReturnType<typeof createExperience>,
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
export function initStats(world: ReturnType<typeof createExperience>) {
	document.body.appendChild(world.stats.dom);
}
export function initScene(world: ReturnType<typeof createExperience>) {
	const geometry = new THREE.BoxGeometry(...ptToM([216, 4.1, 216]), 4, 1, 4);
	const material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
	});
	const objFloor = new THREE.Mesh(geometry, material);

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
		alpha: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.toneMapping = THREE.NoToneMapping;
	renderer.toneMappingExposure = 1.0;

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
export function createScene(color?: number | string) {
	const scene = new THREE.Scene();
	if (color) scene.background = new THREE.Color(color);

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

export function createExperience(
	canvas: HTMLCanvasElement,
	rapier: RAPIER,
	color?: number
) {
	const renderer = createRenderer(canvas);
	const camera = createCamera();
	const scene = createScene(color);
	const clock = new THREE.Clock();
	const stats = new Stats();
	const world = new World(new Vector3(0.0, -RAPIER_WORLD_GRAVITY, 0.0));

	const raycaster = new Raycaster();
	const mouse = new THREE.Vector2();

	createHelpers(scene, camera);
	createControls(camera, renderer.domElement);

	const experience = {
		// Rapier
		rapier,
		world,
		bodies: [] as [Mesh | Group<Object3DEventMap>, RigidBody][],
		debugRenderer: null as RapierDebugRenderer | null,
		// General
		renderer,
		camera,
		scene,
		clock,
		stats,
		textures: [] as THREE.Texture[],
		texturesCube: null as THREE.CubeTexture | null,
		materials: [] as THREE.MeshMatcapMaterial[],
		// Interaction
		raycaster,
		mouse,
		// Player
		player: null as THREE.Group<THREE.Object3DEventMap> | null,
		playerRAPIER: null as RigidBody | null,
		playerRAPIERSpawnT: new Vector3(
			0,
			PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET * 0.5,
			0
		),
		playerRAPIERSpawnR: new Quaternion(0, 0, 0, 1),
		playerRAPIERSpawnLinvel: new Vector3(0, 0, 0),
		playerRAPIERSpawnAngvel: new Vector3(0, 0, 0),
		playerDescendants: [] as THREE.Object3D[],
		playerDir: new Vector3(0, 0, 0),
		playerDirNum: null as number | null,
		playerSpeed: 0,
		playerInputVelocity: new THREE.Vector3(0, 0, 0),
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
		updatePlayer: null as ((delta: number) => void) | null,
		update: null as ((delta: number) => void) | null,
		spawnPlayerAt: null as ((y?: number) => void) | null,
		trackPlayer: null as (() => void) | null,
		onReady: null as (() => void) | null,
	};

	initLoaders(
		experience,
		createLoaders(onLoadPlayer.bind(experience), onReady.bind(experience))
	);
	initStats(experience);
	initScene(experience);

	experience.updatePlayer = function (delta: number) {
		this.playerInputVelocity.set(0, 0, 0);
		this.playerInputVelocity
			.copy(this.playerDir)
			.multiplyScalar(this.playerSpeed);

		if (this.playerRAPIER)
			this.playerRAPIER.applyImpulse(
				new Vector3(...this.playerInputVelocity.toArray()),
				true
			);
	};

	experience.update = function (delta: number) {
		if (!this.bodies) return;

		if (this.updatePlayer) this.updatePlayer(delta * this.playerSpeed);

		for (let i = 0, n = this.bodies.length; i < n; i++) {
			let bodyTHREE = this.bodies[i][0];
			let bodyRAPIER = this.bodies[i][1];

			bodyTHREE.position.copy(bodyRAPIER.translation());
			bodyTHREE.quaternion.copy(bodyRAPIER.rotation());
		}
	};

	experience.spawnPlayerAt = function (y: number = -10) {
		if (!this.playerRAPIER) {
			this.bodies.find(([bodyTHREE, bodyRAPIER]) => {
				if (bodyTHREE.children[0]?.name === "Robot") {
					this.playerRAPIER = bodyRAPIER;
				}
			});
		}
		if (this.playerRAPIER!.translation().y > y) return;

		this.playerRAPIER!.setTranslation(this.playerRAPIERSpawnT, false);
		this.playerRAPIER!.setRotation(this.playerRAPIERSpawnR, true);
		this.playerRAPIER!.setLinvel(this.playerRAPIERSpawnLinvel, true);
		this.playerRAPIER!.setAngvel(this.playerRAPIERSpawnAngvel, true);
	};

	experience.trackPlayer = function () {
		this.camera.position.x = (this.player?.position?.x || 0) + 20;
		this.camera.position.z = (this.player?.position?.z || 0) + 20;
	};

	return experience;
}
