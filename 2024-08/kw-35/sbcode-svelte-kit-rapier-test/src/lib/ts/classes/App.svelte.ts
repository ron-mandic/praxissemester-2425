import type { AppCamera, AppRenderer, AppScene } from '../interfaces';
import { createRenderer, createCamera, createScene } from '../functions.svelte';
import {
	AxesHelper,
	CameraHelper,
	Clock,
	GridHelper,
	Mesh,
	MeshMatcapMaterial,
	OrthographicCamera,
	SRGBColorSpace,
	Texture,
	TextureLoader,
	type WebGLRenderer,
	type WebGLRendererParameters
} from 'three';
import { APP_FOVE } from '../constants';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class App {
	public renderer: AppRenderer;
	public camera: AppCamera;
	public scene: AppScene;
	public clock: Clock;
	public loaderTexture: TextureLoader;
	public loaderGLTF: GLTFLoader;
	public matcapTexture: null | Texture;
	public material: null | MeshMatcapMaterial;

	constructor(rendererParameters?: WebGLRendererParameters) {
		this.renderer = createRenderer(rendererParameters);
		this.camera = createCamera(window);
		this.scene = createScene();
		this.clock = new Clock();

		this.loaderTexture = new TextureLoader();
		this.loaderGLTF = new GLTFLoader();
		this.loaderGLTF.setPath('/models/gltf/');

		this.matcapTexture = null;
		this.material = null;
		this.player = null;

		this.setup();
		this.setupHelpers();
		this.load();
	}

	setup(
		cbRenderer?: (renderer: WebGLRenderer) => void,
		cbCamera?: (camera: OrthographicCamera) => void
	) {
		const renderer = this.renderer.get();
		const camera = this.camera.get();
		const scene = this.scene.get();

		if (cbRenderer) cbRenderer(renderer);
		if (cbCamera) cbCamera(camera);

		scene.add(camera);
	}

	setupHelpers() {
		const camera = this.camera.get();
		const scene = this.scene.get();

		const axesHelper = new AxesHelper(5);
		scene.add(axesHelper);

		const gridHelper = new GridHelper(100, 100);
		scene.add(gridHelper);

		const cameraHelper = new CameraHelper(camera);
		scene.add(cameraHelper);
	}

	load() {
		this.matcapTexture = this.loaderTexture.load('/textures/matcaps/2.png');
		this.matcapTexture.colorSpace = SRGBColorSpace;
		this.material = new MeshMatcapMaterial({
			matcap: this.matcapTexture
		});

		this.loaderGLTF.load('robot.glb', (gltf) => {
			this.player = gltf.scene;
			this.player.traverse((child) => {
				if (child instanceof Mesh) {
					child.material = this.material;
				}
			});

			this.scene.get().add(this.player);
		});

		this.draw();
	}

	resize(window: Window) {
		const camera = this.camera.get();
		const renderer = this.renderer.get();
		const aspectRatio = window.innerWidth / window.innerHeight;

		window.addEventListener('resize', function () {
			camera.top = APP_FOVE;
			camera.bottom = -APP_FOVE;
			camera.left = -APP_FOVE * aspectRatio;
			camera.right = APP_FOVE * aspectRatio;
			camera.lookAt(0, 0, 0);
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});
	}

	private _draw_() {
		// const dt = this.clock.getDelta();

		const renderer = this.renderer.get();
		const camera = this.camera.get();
		const scene = this.scene.get();

		renderer.render(scene, camera);
	}

	draw() {
		this.renderer.get().setAnimationLoop(this._draw_.bind(this));
	}

	dispose() {
		// Clean up
		this.renderer.get().dispose();
		this.camera.get().clear();
		this.scene.get().clear();

		// Remove EventListeners
		window.removeEventListener('resize', () => {});
	}
}

const app = new App();
export default app;
