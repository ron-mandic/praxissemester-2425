<script lang="ts">
	import '../app.scss';
	import '@fontsource/jetbrains-mono/100.css';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '@fontsource/jetbrains-mono/800.css';
	import { fly } from 'svelte/transition';
	import Marquee from '../components/Marquee.svelte';
	import { backIn, backOut, quartOut, quadIn, quartIn } from 'svelte/easing';

	let { children, data } = $props();

	$effect(() => {
		// Source: https://www.npmjs.com/package/socket.io-client
		localStorage.debug = '*';
	});
</script>

<!-- TODO: Custom transitions (see https://joyofcode.xyz/sveltekit-page-transitions#custom-transitions) -->
{#key data.url}
	<div
		id="app"
		class="flex h-screen w-full items-center justify-center"
		in:fly={{ x: window.innerWidth / 4, duration: 300, delay: 300, easing: quartOut }}
		out:fly={{ x: -window.innerWidth / 4, duration: 300, easing: quartIn }}
	>
		<Marquee />
		<main class="flex h-full w-full items-center justify-center">
			{@render children()}
		</main>
		<Marquee position="bottom" direction="right" />
	</div>
{/key}

<style>
	main {
		width: min(100dvw, 1920px);
		height: min(100dvh, 1080px);
	}
</style>
