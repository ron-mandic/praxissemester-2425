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

// TODO: Try alpha or depth test for the plane material of the sprites
// TODO: Also try depthWrite to specify if the sprites appear in the depth buffer

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
	// initSprites(experience, RAPIER_WORLD_SPRITES);

	// Table football
	const loader = new THREE.TextureLoader();
	const mapA = loader.load("/images/png/sprite-stairs-left-person-mug.png");
	mapA.colorSpace = THREE.SRGBColorSpace;
	const materialA = new THREE.SpriteMaterial({
		map: mapA,
		transparent: true,
	});
	const spriteA = new THREE.Sprite(materialA);
	const w = 174.7 / 72;
	const h = 206.6 / 72;
	const SCALE_WH_CORRECTION = 0.8174504883242477; // the mean of the x and z scale, custom ones might be assigned too
	const SCALE_WH_CORRECTION_SWING = 0.8285714285714286; // Custom scale for the swing sprite
	spriteA.applyMatrix4(
		new THREE.Matrix4().set(
			// x
			w * SCALE_WH_CORRECTION,
			0,
			0,
			0,
			// y
			0,
			h * SCALE_WH_CORRECTION,
			0,
			0,
			// z
			0,
			0,
			w * SCALE_WH_CORRECTION,
			0,
			// w
			0,
			0,
			0,
			1
		)
	);
	spriteA.position.set(-0.57, (h * SCALE_WH_CORRECTION) / 2, 0);
	spriteA.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);

	const boxA = new THREE.Box3().setFromObject(spriteA);
	const boxAHelper = new THREE.Box3Helper(boxA, 0xff0000);

	const spriteACenter = boxA.getCenter(new THREE.Vector3());
	const spriteASize = boxA.getSize(new THREE.Vector3());

	const { x, y, z } = spriteASize;
	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry(Math.sqrt(x ** 2 + z ** 2), y),
		new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
	);
	plane.position.copy(spriteACenter);
	plane.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);

	console.log(spriteA);
	console.log("spriteACenter", spriteACenter);
	console.log("spriteASize", spriteASize);

	scene.add(spriteA);
	// scene.add(boxAHelper);
	scene.add(plane);

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
