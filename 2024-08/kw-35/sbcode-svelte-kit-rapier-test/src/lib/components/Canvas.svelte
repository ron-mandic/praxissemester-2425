<script lang="ts">
	import app from '$lib/ts/classes/App.svelte';
	import { CineonToneMapping } from 'three';

	let canvas: unknown = $state(null);

	$effect(() => {
		app.setup(
			(renderer) => {
				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				renderer.toneMapping = CineonToneMapping;
				renderer.toneMappingExposure = 1.75;
				renderer.domElement = canvas as HTMLCanvasElement;
			},
			(camera) => {
				camera.position.set(20, 20, 20);
				camera.lookAt(0, 0, 0);
			}
		);

		app.resize(window);

		return () => {
			app.dispose();
		};
	});
</script>

<canvas bind:this={canvas} width={window.innerWidth} height={window.innerHeight}></canvas>
