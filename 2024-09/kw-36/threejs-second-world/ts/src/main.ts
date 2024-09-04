import "./style.css";
import * as THREE from "three";
import { createWorld } from "./ts/functions";
import RAPIER from "@dimforge/rapier3d-compat";
import {
	PLAYER_DEPTH,
	PLAYER_HEIGHT,
	PLAYER_HEIGHT_OFFSET,
	PLAYER_RESTITUTION,
	PLAYER_WEIGHT,
	PLAYER_WIDTH,
	RAPIER_WORLD_GRAVITY,
	RAPIER_WORLD_Y_OFFSET,
} from "./ts/constants";

const canvas = document.querySelector("#app canvas")! as HTMLCanvasElement;
const world = createWorld(canvas);
const { renderer, camera, scene } = world!;

let worldRAPIER: RAPIER.World;
let dynamicBodies: [
	THREE.Mesh | THREE.Group<THREE.Object3DEventMap>,
	RAPIER.RigidBody
][] = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// @ts-expect-error Cannot invoke an object which is possibly 'null'.
world.loadTexture("/textures/matcaps/2.png", (texture: THREE.Texture) => {
	if (world && world.createMaterial) world.createMaterial(texture);
});
// @ts-expect-error Cannot invoke an object which is possibly 'null'.
world.loadGLTF("robot-blender.glb", (gltf) => {
	world.player = gltf.scene;
	world.scene.add(world.player);
	world.player.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			world.playerDescendants.push(child);
		}
	});
});

world.onReady = async function () {
	await RAPIER.init();
	const gravity = new RAPIER.Vector3(0.0, -RAPIER_WORLD_GRAVITY, 0.0);
	worldRAPIER = new RAPIER.World(gravity);

	// Floor
	const floorBody = worldRAPIER.createRigidBody(
		RAPIER.RigidBodyDesc.fixed().setTranslation(
			0,
			-0.05694 / 2 + RAPIER_WORLD_Y_OFFSET,
			0
		)
	);
	const floorShape = RAPIER.ColliderDesc.cuboid(1.5, 0.05694 / 2, 1.5);
	worldRAPIER.createCollider(floorShape, floorBody);

	// Player
	const playerBody = worldRAPIER.createRigidBody(
		RAPIER.RigidBodyDesc.dynamic()
			.setTranslation(0, PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET, 0)
			.setCanSleep(false)
	);
	const playerShape = RAPIER.ColliderDesc.cuboid(
		PLAYER_WIDTH / 2,
		PLAYER_HEIGHT / 2,
		PLAYER_DEPTH / 2
	)
		.setMass(PLAYER_WEIGHT)
		.setRestitution(PLAYER_RESTITUTION);
	worldRAPIER.createCollider(playerShape, playerBody);
	dynamicBodies.push([world.player!, playerBody]);

	this.renderer.domElement.addEventListener("click", (e) => {
		mouse.set(
			(e.clientX / renderer.domElement.clientWidth) * 2 - 1,
			-(e.clientY / renderer.domElement.clientHeight) * 2 + 1
		);
		raycaster.setFromCamera(mouse, this.camera);
		const intersects = raycaster.intersectObjects(
			world.playerDescendants,
			true
		);

		if (intersects[0]?.object.name === "Robot") {
			const playerBody = dynamicBodies[0][1];
			playerBody.applyImpulse(
				new RAPIER.Vector3(0, RAPIER_WORLD_GRAVITY, 0),
				true
			);
		}
	});
};

function animate(/* time: number */) {
	world.stats.begin();

	let dt = world.clock.getDelta();

	if (worldRAPIER) {
		worldRAPIER.timestep = Math.min(dt, 0.1);
		worldRAPIER.step();

		for (let i = 0, n = dynamicBodies.length; i < n; i++) {
			dynamicBodies[i][0].position.copy(
				dynamicBodies[i][1].translation()
			);
			dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation());
		}
	}
	// console.log(time);

	// if (world.player && world.keysPressed.size <= 1) {
	// 	world.player.position.add(world.vec3Dir.clone().multiplyScalar(2 * dt));
	// }

	camera.position.x = (world.player?.position?.x || 0) + 20;
	camera.position.z = (world.player?.position?.z || 0) + 20;

	world.stats.end();
	renderer.render(scene, camera);
}

world.renderer.setAnimationLoop(animate);
