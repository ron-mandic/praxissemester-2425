import "./style.css";
import * as THREE from "three";
import { createExperience, initDebug, initWorld } from "./ts/functions";
import RAPIER from "@dimforge/rapier3d-compat";
import { RAPIER_WORLD_BODIES } from "./ts/constants";
await RAPIER.init();

const canvas = document.querySelector("#app canvas")! as HTMLCanvasElement;
const experience = createExperience(canvas, RAPIER);
const { world, renderer, camera, scene } = experience!;
let frameCount = 0;

// @ts-expect-error Cannot invoke an object which is possibly 'null'.
experience.loadTexture(
	"/textures/matcaps/495CA6_CCD2E6_A5B1D8_1E2852-256px.png",
	(texture: THREE.Texture) => {
		if (experience && experience.createMaterial)
			experience.createMaterial(texture);
	}
);
// @ts-expect-error Cannot invoke an object which is possibly 'null'.
experience.loadGLTF("robot-blender.glb", (gltf) => {
	experience.player = gltf.scene;

	experience.scene.add(experience.player);
	experience.player.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			experience.playerDescendants.push(child);
		}
	});
});

experience.onReady = function () {
	initWorld(this, RAPIER_WORLD_BODIES);
	initDebug(this);

	experience.player?.setRotationFromAxisAngle(
		new THREE.Vector3(0, 1, 0),
		Math.PI
	);
	experience.renderer.setAnimationLoop(animate);
};

function animate(/* time: number */) {
	experience.stats.begin();

	frameCount += 1;
	let delta = experience.clock.getDelta();

	world.timestep = Math.min(delta, 0.1);
	world.step(experience.eventQueue);

	experience.eventQueue.drainCollisionEvents((_, __, started) => {
		if (experience.setGrounded) experience.setGrounded(started);
	});

	if (experience.update) experience.update(delta);
	if (experience.spawnPlayerAt) experience.spawnPlayerAt();
	if (experience.trackPlayer) experience.trackPlayer();

	if (experience.debugRenderer) experience.debugRenderer.update();
	renderer.render(scene, camera);
	experience.stats.end();
}
