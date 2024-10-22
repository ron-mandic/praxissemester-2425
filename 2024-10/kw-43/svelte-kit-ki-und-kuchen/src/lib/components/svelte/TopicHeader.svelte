<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	const { title, subtitle, description } = $props();
</script>

<h2 class="mb-12 text-center text-4xl font-bold md:w-3/4 md:text-left">
	{title}
</h2>

<Card.Root class="w-full">
	<Card.Header class="gap-2">
		<Card.Title>{subtitle}</Card.Title>
		<Card.Description>
			<p class="mb-3 mt-2">
				{description}
			</p>
		</Card.Description>
	</Card.Header>
</Card.Root>
