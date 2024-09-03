<script>
	import '../app.scss';
	import UI from '$lib/components/UI.svelte';
</script>

<div id="app" class="relative h-screen w-screen bg-slate-950">
	<UI />

	<main id="app-canvas" class="fixed inset-0 h-screen w-screen">
		<slot></slot>
	</main>
</div>
