import "./style.css";
import * as THREE from "three";
import { createWorld } from "./ts/functions";

const canvas = document.querySelector("#app canvas")! as HTMLCanvasElement;
const world = createWorld(canvas);
const { renderer, camera, scene } = world!;

// @ts-expect-error Cannot invoke an object which is possibly 'null'.
world.loadTexture("/textures/matcaps/2.png", (texture: THREE.Texture) => {
	if (world && world.createMaterial) world.createMaterial(texture);
});
// @ts-expect-error Cannot invoke an object which is possibly 'null'.
world.loadGLTF("robot-shapr3d.glb", (gltf) => {
	world.player = gltf.scene;
});
world.onReady = function () {
	console.log(this.player);
};

function animate(/* time: number */) {
	world.stats.begin();

	let dt = world.clock.getDelta();
	// console.log(time);

	if (world.player && world.keysPressed.size <= 1) {
		world.player.position.add(world.vec3Dir.clone().multiplyScalar(2 * dt));
	}

	camera.position.x = (world.player?.position?.x || 0) + 20;
	camera.position.z = (world.player?.position?.z || 0) + 20;

	world.stats.end();
	renderer.render(scene, camera);
}

world.renderer.setAnimationLoop(animate);
