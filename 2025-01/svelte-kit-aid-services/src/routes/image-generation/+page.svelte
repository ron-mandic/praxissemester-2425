<script>
	import { Skeleton } from '@/components/ui/skeleton';
</script>

<main class="flex flex-1 flex-col gap-4 p-4 pt-0 md:mt-5">
	<div id="services" class="grid grid-cols-1 gap-4">
		{#each { length: 24 }, i (i)}
			<Skeleton class="grid aspect-video place-content-center rounded-xl bg-muted/30"></Skeleton>
		{/each}
	</div>
</main>

<style lang="scss">
	#services {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}
</style>
