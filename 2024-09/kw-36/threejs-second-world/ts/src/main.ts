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
	const mapA = loader.load("/images/png/test1.png");
	const mapB = loader.load("/images/png/test2.png");
	mapA.colorSpace = THREE.SRGBColorSpace;
	mapB.colorSpace = THREE.SRGBColorSpace;
	const materialA = new THREE.SpriteMaterial({
		map: mapA,
		transparent: true,
	});
	const materialB = new THREE.SpriteMaterial({
		map: mapB,
		transparent: true,
	});
	const spriteA = new THREE.Sprite(materialA);
	const spriteB = new THREE.Sprite(materialB);
	const wA = 645.8 / 72;
	const hA = 553.3 / 72;
	const wB = 40.5 / 72;
	const hB = 118.2 / 72;
	const SCALE_WH_CORRECTION = 0.8174504883242477; // the mean of the x and z scale, custom ones might be assigned too
	const SCALE_WH_CORRECTION_SWING = 0.8285714285714286; // Custom scale for the swing sprite
	spriteA.applyMatrix4(
		new THREE.Matrix4().set(
			// x
			wA * SCALE_WH_CORRECTION,
			0,
			0,
			0,
			// y
			0,
			hA * SCALE_WH_CORRECTION,
			0,
			0,
			// z
			0,
			0,
			wA * SCALE_WH_CORRECTION,
			0,
			// w
			0,
			0,
			0,
			1
		)
	);
	spriteB.applyMatrix4(
		new THREE.Matrix4().set(
			// x
			wB * SCALE_WH_CORRECTION,
			0,
			0,
			0,
			// y
			0,
			hB * SCALE_WH_CORRECTION,
			0,
			0,
			// z
			0,
			0,
			wB * SCALE_WH_CORRECTION,
			0,
			// w
			0,
			0,
			0,
			1
		)
	);
	spriteA.position.set(-0.57, (hA * SCALE_WH_CORRECTION) / 2, 0);
	spriteA.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
	spriteB.position.set(0, (hB * SCALE_WH_CORRECTION) / 2, 0);
	spriteB.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);

	const boxA = new THREE.Box3().setFromObject(spriteA);
	const boxAHelper = new THREE.Box3Helper(boxA, 0xff0000);
	const boxB = new THREE.Box3().setFromObject(spriteB);
	const boxBHelper = new THREE.Box3Helper(boxB, 0xff0000);

	const spriteACenter = boxA.getCenter(new THREE.Vector3());
	const spriteASize = boxA.getSize(new THREE.Vector3());
	const spriteBCenter = boxB.getCenter(new THREE.Vector3());
	const spriteBSize = boxB.getSize(new THREE.Vector3());

	const planeA = new THREE.Mesh(
		new THREE.PlaneGeometry(
			Math.sqrt(spriteASize.x ** 2 + spriteASize.z ** 2),
			spriteASize.y
		),
		new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
	);
	planeA.position.copy(spriteACenter);
	planeA.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
	const planeB = new THREE.Mesh(
		new THREE.PlaneGeometry(
			Math.sqrt(spriteBSize.x ** 2 + spriteBSize.z ** 2),
			spriteBSize.y
		),
		new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
	);
	planeB.position.copy(spriteBCenter);
	planeB.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);

	console.log(spriteA);
	console.log("spriteACenter", spriteACenter);
	console.log("spriteASize", spriteASize);

	scene.add(spriteA);
	scene.add(spriteB);
	// scene.add(boxAHelper);
	scene.add(planeA);
	scene.add(planeB);

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
