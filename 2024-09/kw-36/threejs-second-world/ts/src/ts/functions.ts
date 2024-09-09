import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import {
	KEYS,
	PLAYER_HEIGHT,
	PLAYER_HEIGHT_OFFSET,
	PLAYER_SPEED,
	PLAYER_SPEED_MAX,
	RAPIER_WORLD_FRAME_RATE,
	RAPIER_WORLD_GRAVITY,
	RAPIER_WORLD_SPRITES,
	WORLD_CAMERA_FOVE,
} from "./constants";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { lerp, ptToM } from "./math";
import { RAPIER, RAPIER_WORLD_BODY } from "./types";
import {
	RigidBody,
	RigidBodyDesc,
	ColliderDesc,
	Vector3,
	World,
	Quaternion,
	EventQueue,
	ActiveEvents,
} from "@dimforge/rapier3d-compat";
import {
	Group,
	Mesh,
	MeshBasicMaterial,
	Object3DEventMap,
	Raycaster,
} from "three";
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
function getDirOffset(num: number) {
	switch (num) {
		case null:
			return;
		case 0:
			return 0; // KeyW
		case 1:
			return Math.PI / 4; // KeyW + KeyA
		case 2:
			return Math.PI / 2; // KeyA
		case 3:
			return Math.PI / 4 + Math.PI / 2; // KeyS + KeyA
		case 4:
			return Math.PI; // KeyS
		case 5:
			return -Math.PI / 4 - Math.PI / 2; // KeyS + KeyD
		case 6:
			return -Math.PI / 2; // KeyD
		case 7:
			return -Math.PI / 4; // KeyW + KeyD
	}
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
function setRotationQuaternion(numDir: number, quaternion: THREE.Quaternion) {
	let offset = getDirOffset(numDir);
	if (offset === undefined) return;

	quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), offset);
}
function resetPlayerDir(
	experience: ReturnType<typeof createExperience>
	/* releasedKey?: string */
) {
	const keys = experience.keysPressed;
	const vec3 = experience.playerDir;
	// console.log(releasedKey);

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
	const { renderer, scene, camera, bodies, mouse, raycaster } = experience;

	renderer.domElement.addEventListener("click", (e) => {
		mouse.set(
			(e.clientX / renderer.domElement.clientWidth) * 2 - 1,
			-(e.clientY / renderer.domElement.clientHeight) * 2 + 1
		);
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(
			scene.children.filter((child) => child.name),
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
		experience.playerSpeed = PLAYER_SPEED; // m/s

		setRotationQuaternion(
			experience.playerDirNum!,
			experience.playerRotationQuaternion
		);
	});
}
export function onKeyup(experience: ReturnType<typeof createExperience>) {
	const keys = experience.keysPressed;

	window.addEventListener("keyup", (event) => {
		if (event.repeat) return;
		keys.delete(event.code);
		resetPlayerDir(experience);

		if (keys.size === 0) {
			experience.playerSpeed = 0;
			experience.playerDirNum = null;
		} else {
			setRotationQuaternion(
				experience.playerDirNum!,
				experience.playerRotationQuaternion
			);
		}
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
			collisionGroups,
			translation,
			shape: s,
			sizes,
			mass,
			restitution,
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
			shape = ColliderDesc.cuboid(hx, hy, hz).setCollisionGroups(
				collisionGroups
			);
		} else if (s === "cylinder") {
			let { halfHeight, radius } = sizes as {
				halfHeight: number;
				radius: number;
			};
			// @ts-ignore
			shape = ColliderDesc.cylinder(
				halfHeight,
				radius
			).setCollisionGroups(collisionGroups);
		}

		if (type === "dynamic") {
			shape?.setMass(mass || 1);
			if (restitution) shape?.setRestitution(restitution);
			if (friction) shape?.setFriction(friction);
			shape?.setActiveEvents(ActiveEvents.COLLISION_EVENTS);

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

export function initSprites(
	experience: ReturnType<typeof createExperience>,
	data: any[],
	isTransparent = false
) {
	const { scene } = experience;
	const materialObj = new MeshBasicMaterial({
		color: 0x00ff00,
		opacity: isTransparent ? 0 : 0.5,
		transparent: true,
	});
	const getMaterialPlane = (image: THREE.Texture) => {
		return new MeshBasicMaterial({
			map: image,
			color: 0xffffff,
			transparent: true,
			opacity: 1,
		});
	};

	let bodies = [];

	for (const sprite of data) {
		const { mesh: _mesh, plane: _plane, bodies } = sprite;

		// Bodies
		for (const body of bodies) {
			bodies.push(body);
		}

		// Mesh
		const { o, x, y, z, type, show } = _mesh;
		const vec3O = new THREE.Vector3(o.x, o.y || 0, o.z);
		const vec3X = new THREE.Vector3(x, 0, 0);
		const vec3Y = new THREE.Vector3(0, y, 0);
		const vec3Z = new THREE.Vector3(0, 0, z);
		const vec3M = vec3O
			.clone()
			.add(vec3X.clone().multiplyScalar(0.5))
			.add(vec3Y.clone().multiplyScalar(0.5))
			.add(vec3Z.clone().multiplyScalar(0.5));

		const w = Math.abs(vec3X.x);
		const h = Math.abs(vec3Y.y);
		const d = Math.abs(vec3Z.z);

		let geometryObj, meshObj;

		switch (type) {
			case "box":
				geometryObj = new THREE.BoxGeometry(w, h, d);
				break;
			case "cylinder":
				geometryObj = new THREE.CylinderGeometry(w / 2, w / 2, h, 32);
				break;
		}

		meshObj = new Mesh(geometryObj, materialObj);
		meshObj.position.set(...vec3M.toArray());
		// TODO: Remove this after debugging
		show && scene.add(meshObj);

		// Plane
		const { path, width, height, offsetX, offsetY, offsetZ, scaleX } = _plane;
		const plane = new THREE.PlaneGeometry(width, height);
		const image = experience.sprites[path];

		if (!image) throw new Error("Image not found");
		const materialPlane = getMaterialPlane(image);
		const meshPlane = new Mesh(plane, materialPlane);
		meshPlane.position.set(
			vec3O.x + offsetX,
			vec3O.y + height / 2 + (offsetY || 0),
			vec3O.z + offsetZ
		);
		meshPlane.rotation.y = Math.PI / 4;
		meshPlane.scale.set(scaleX || 0.835, 1, 1);
		meshPlane.name = "Sprite";
		scene.add(meshPlane);
	}

	// TODO: Initiate world building
	// initWorld(experience, bodies);
}

// export function initAssets(experience: ReturnType<typeof createExperience>, data: any) {

// }

export function initLoaders(
	experience: ReturnType<typeof createExperience>,
	loaders: ReturnType<typeof createLoaders>
) {
	experience.loaders = loaders;
	experience.loadTexture = function (
		path: string,
		onLoad?: (texture: THREE.Texture, path?: string) => void
	) {
		const texture = this.loaders!.textureLoader.load(path);
		texture.colorSpace = THREE.SRGBColorSpace;
		if (onLoad) onLoad(texture, path);
		this.textures.push(texture);
		return texture;
	};
	experience.loadCubeTexture = function (
		imgs: string[],
		onLoad?: (cubeTexture: THREE.CubeTexture) => void
	) {
		const cubeTexture = this.loaders!.cubeTextureLoader.load(imgs);
		if (onLoad) onLoad(cubeTexture);
		this.texturesCube = cubeTexture;
		return cubeTexture;
	};
	experience.loadOBJ = function (
		path: string,
		onLoad: (data: THREE.Group) => void
	) {
		this.loaders!.objLoader.load(path, onLoad);
		return experience;
	};
	experience.loadGLTF = function (
		path: string,
		onLoad: (data: GLTF) => void
	) {
		this.loaders!.gltfLoader.load(path, onLoad, (_: ProgressEvent) => {
			// console.log(~~((ev.loaded / ev.total) * 100) + "%");
		});
		return experience;
	};
	experience.createMaterial = function (matcap: THREE.Texture) {
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
		color: 0xfbfbfb,
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
	controls.zoomSpeed = 1;
	controls.update();
}
export function createHelpers(
	scene: THREE.Scene,
	camera: THREE.OrthographicCamera
) {
	const gridHelper = new THREE.GridHelper(3, 3, undefined, 0xcdcdcd);
	scene.add(gridHelper);
	const axesHelper = new THREE.AxesHelper(100);
	// scene.add(axesHelper);
	const cameraHelper = new THREE.CameraHelper(camera);
	// scene.add(cameraHelper);
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
	const eventQueue = new EventQueue(true);

	const raycaster = new Raycaster();
	const mouse = new THREE.Vector2();

	createHelpers(scene, camera);
	createControls(camera, renderer.domElement);

	const experience = {
		// Rapier
		rapier,
		world,
		eventQueue,
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
			0.5,
			PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET,
			-0.75
		),
		playerRAPIERSpawnR: new Quaternion(0, 0, 0, 1),
		playerRAPIERSpawnLinvel: new Vector3(0, 0, 0),
		playerRAPIERSpawnAngvel: new Vector3(0, 0, 0),
		playerDescendants: [] as THREE.Object3D[],
		playerDir: new Vector3(0, 0, 0),
		playerDirNum: null as number | null,
		playerSpeed: 0,
		playerMaxSpeed: PLAYER_SPEED_MAX,
		playerInputVelocity: new THREE.Vector3(0, 0, 0),
		playerGrounded: false,
		playerRotationAxis: new THREE.Vector3(0, 1, 0),
		playerRotationQuaternion: new THREE.Quaternion(),
		keysPressed: new Map<string, boolean>(),
		triggerRotation: false,
		loaders: null as ReturnType<typeof createLoaders> | null,
		sprites: {} as { [key: string]: THREE.Texture },
		// Loading mechanisms
		loadTexture: null as
			| ((
					path: string,
					onLoad?: (texture: THREE.Texture, path?: string) => void
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
		setGrounded: null as ((grounded: boolean) => void) | null,
		spawnPlayerAt: null as ((y?: number) => void) | null,
		trackPlayer: null as ((delta: number) => void) | null,
		onReady: null as (() => void) | null,
	};

	initLoaders(
		experience,
		createLoaders(onLoadPlayer.bind(experience), onReady.bind(experience))
	);
	// initAssets(experience, ASSETS);
	initStats(experience);
	initScene(experience);
	initDebug(experience);

	experience.updatePlayer = function (delta: number) {
		let { x, y, z } = experience.playerDir;
		let vecDirection = new THREE.Vector3(x, y, z);
		vecDirection.multiplyScalar(
			this.playerSpeed * (delta / RAPIER_WORLD_FRAME_RATE)
		);

		// Static
		// this.player!.children[0].quaternion.copy(
		// 	experience.playerRotationQuaternion
		// );

		// Animated
		this.player!.children[0].quaternion.rotateTowards(
			experience.playerRotationQuaternion,
			delta * 8.75
		);

		if (!this.playerRAPIER) return;
		// If player fell from platform or if no keys are pressed
		if (
			this.playerRAPIER!.translation().y < -0.05694 / 2 ||
			this.playerDirNum === null
		)
			return;

		this.playerRAPIER!.applyImpulse(
			new Vector3(...vecDirection.toArray()),
			true
		);

		let { x: velX, y: velY, z: velZ } = this.playerRAPIER!.linvel();
		let currentVelocity = new THREE.Vector3(velX, velY, velZ);

		if (currentVelocity.length() > PLAYER_SPEED_MAX) {
			currentVelocity.setLength(PLAYER_SPEED_MAX);
			this.playerRAPIER?.setLinvel(
				new Vector3(...currentVelocity.toArray()),
				true
			);
		}
	};

	experience.update = function (delta: number) {
		if (!this.bodies) return;

		this.world.timestep = Math.min(delta, 0.1);
		this.world.step(experience.eventQueue);
		this.eventQueue.drainCollisionEvents((_, __, started) => {
			if (experience.setGrounded) experience.setGrounded(started);
			console.log(_, __);
		});

		for (let i = 0, n = this.bodies.length; i < n; i++) {
			let bodyTHREE = this.bodies[i][0];
			let bodyRAPIER = this.bodies[i][1];

			bodyTHREE.position.copy(bodyRAPIER.translation());
			bodyTHREE.quaternion.copy(bodyRAPIER.rotation());
		}

		if (this.updatePlayer) this.updatePlayer(delta);
		if (this.trackPlayer) this.trackPlayer(delta);
		if (this.spawnPlayerAt) this.spawnPlayerAt();
		// if (this.debugRenderer) this.debugRenderer.update();
	};

	experience.setGrounded = function (grounded: boolean) {
		this.playerGrounded = grounded;
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

		this.playerRAPIER!.setTranslation(this.playerRAPIERSpawnT, true);
		this.playerRAPIER!.setRotation(this.playerRAPIERSpawnR, true);
		this.playerRAPIER!.setLinvel(this.playerRAPIERSpawnLinvel, true);
		this.playerRAPIER!.setAngvel(this.playerRAPIERSpawnAngvel, true);

		this.playerDir = new Vector3(0, 0, 0);
		this.playerDirNum = null;
	};

	experience.trackPlayer = function (delta: number) {
		this.camera.position.x = lerp(
			this.camera.position.x,
			(this.player?.position?.x || 0) + 20,
			delta * (delta / RAPIER_WORLD_FRAME_RATE) * 2.75
		);
		this.camera.position.z = lerp(
			this.camera.position.z,
			(this.player?.position?.z || 0) + 20,
			delta * (delta / RAPIER_WORLD_FRAME_RATE) * 2.75
		);
	};

	return experience;
}
