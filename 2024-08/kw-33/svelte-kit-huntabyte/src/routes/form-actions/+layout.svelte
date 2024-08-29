<script>
	import '$lib/scss/app.scss';
</script>

<svelte:head>
	<meta name="color-scheme" content="light" />
</svelte:head>

<div class="flex min-h-full flex-col py-12 sm:px-6 lg:px-8 w-full">
	<slot />
</div>
