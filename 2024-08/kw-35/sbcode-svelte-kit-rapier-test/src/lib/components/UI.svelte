<script lang="ts">
	import app from '$lib/ts/classes/App.svelte';
</script>

<div id="app-ui" class="pointer-events-none flex h-full w-full items-end justify-between p-3 debug">
	<aside
		class="h-full w-1/2 max-w-64 rounded-2xl border-[.125rem] border-slate-400/10 bg-slate-900 p-6"
	>
		{#each app.scene.get().children as child}
			<p class="px-2 py-3 text-slate-300">{child.type}</p>
		{/each}
	</aside>
	<footer
		class="h-24 w-24 max-w-64 rounded-2xl border-[.125rem] border-slate-400/10 bg-slate-900"
	></footer>
</div>
