<script>
	import ObjectBox from './ObjectBox.svelte';
	const { boxes } = $props();
</script>

{#each boxes as { label, score, box }}
	<ObjectBox {label} {score} {box} />
{/each}
