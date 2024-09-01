<script lang="ts">
	import './style.css';
	import { Canvas } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { Pane, Text } from 'svelte-tweakpane-ui';
	import Scene from '$lib/components/Scene.svelte';
</script>

<Pane title="World" position="fixed">
	<Text value="Use the arrow keys to move around" disabled />
</Pane>

<div>
	<Canvas size={{ width: window.innerWidth, height: window.innerHeight }}>
		<World>
			<Scene />

			<HTML slot="fallback" transform>
				<p>
					It seems your browser<br />
					doesn't support WASM.<br />
					I'm sorry.
				</p>
			</HTML>
		</World>
	</Canvas>
</div>

<style>
	div {
		height: 100%;
	}
	p {
		font-size: 0.75rem;
		line-height: 1rem;
	}
</style>
