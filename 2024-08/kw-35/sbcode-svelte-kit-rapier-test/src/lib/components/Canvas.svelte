<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import Stats from 'three/addons/libs/stats.module.js';
	import UI from './UI.svelte';
	import { GUI } from 'dat.gui';
	import { onMount, setContext } from 'svelte';

	let canvas: HTMLCanvasElement;
	let renderer: THREE.WebGLRenderer;
	let camera: THREE.PerspectiveCamera;
	let sceneA: THREE.Scene, sceneB: THREE.Scene, sceneC: THREE.Scene;
	let hasGUI = false;
	let gui = new GUI();
	let stats = new Stats();
	let activeScene: THREE.Scene;
	const setScene = {
		sceneA: () => {
			activeScene = sceneA;
		},
		sceneB: () => {
			activeScene = sceneB;
		},
		sceneC: () => {
			activeScene = sceneC;
		}
	};
	let hasInitialized = false;

	// $inspect(hasGUI).with(console.trace);

	$effect(() => {
		if (hasInitialized) return;
		hasInitialized = true;
		console.log('Effect #1');

		sceneA = new THREE.Scene();
		sceneA.background = new THREE.Color(0x123456);

		sceneB = new THREE.Scene();
		sceneB.background = new THREE.TextureLoader().load('https://sbcode.net/img/grid.png');

		sceneC = new THREE.Scene();
		sceneC.background = new THREE.CubeTextureLoader()
			.setPath('https://sbcode.net/img/')
			.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

		activeScene = sceneC;

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 1.5;

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance',
			alpha: true,
			canvas
		});

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});

		setContext('three', { renderer, camera, sceneA, sceneB, sceneC });

		return () => {
			document.body.removeChild(stats.dom);
			window.removeEventListener('resize', () => {});
		};
	});

	$effect(() => {
		console.log('Effect #2');
		if (!hasInitialized) return;

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.update();

		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshNormalMaterial({ wireframe: true });

		const cube = new THREE.Mesh(geometry, material);
		// sceneA.add(cube);
		sceneC.add(cube);
		cube.userData = { URL: 'https://sbcode.net' };
		console.log(cube);

		stats = new Stats();
		document.body.appendChild(stats.dom);

		function animate() {
			requestAnimationFrame(animate);

			//cube.rotation.x += 0.01
			//cube.rotation.y += 0.01

			renderer.render(activeScene, camera);

			stats.update();
		}

		animate();
		sceneC.backgroundBlurriness = 0.5;
	});

	$effect(() => {
		if (!hasGUI) {
			gui.add(setScene, 'sceneA');
			gui.add(setScene, 'sceneB');
			gui.add(setScene, 'sceneC');
			hasGUI = true;

			console.log('GUI created');
		}
	});
</script>

<canvas bind:this={canvas}></canvas>
<UI />
