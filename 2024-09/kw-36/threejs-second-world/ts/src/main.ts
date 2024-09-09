import "./style.css";
import * as THREE from "three";
import { createExperience, initSprites, initWorld } from "./ts/functions";
import RAPIER from "@dimforge/rapier3d-compat";
import {
	RAPIER_WORLD_BODIES,
	RAPIER_WORLD_SPRITES,
	SPRITES,
} from "./ts/constants";
await RAPIER.init();

const canvas = document.querySelector("#app canvas")! as HTMLCanvasElement;
const experience = createExperience(canvas, RAPIER);
const { renderer, camera, scene } = experience!;
let frameCount = 0;

for (const path of SPRITES) {
	// @ts-expect-error Cannot invoke an object which is possibly 'null'.
	experience.loadTexture(path, (texture: THREE.Texture, path?: string) => {
		experience.sprites[path!] = texture;
	});
}
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
	initSprites(experience, RAPIER_WORLD_SPRITES);

	experience.renderer.setAnimationLoop(animate);
};

function animate(/* time: number */) {
	experience.stats.begin();
	frameCount += 1;
	let delta = experience.clock.getDelta();

	if (experience.update) experience.update(delta);

	renderer.render(scene, camera);
	experience.stats.end();
}
