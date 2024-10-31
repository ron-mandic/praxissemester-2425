<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '@/ui/button';

	const {
		imgSrc,
		title,
		paragraphs,
		cta = 'Hier klicken',
		href = '#'
	} = $props<{
		imgSrc: string;
		title: string;
		paragraphs: string[];
		cta?: string;
		href?: string;
	}>();
</script>

<Card.Root class="dark mt-6 w-full">
	<Card.Header class="gap-2 p-1.5">
		<div class="relative mb-4 flex h-[325px] w-full overflow-clip rounded-md bg-muted/50">
			<img src={imgSrc} alt="SandwichNet" class="object-cover" />
		</div>

		<Card.Title class="pl-[1.125rem]">{title}</Card.Title>
		<div class="px-[1.125rem] pb-[1.125rem] pt-2">
			<Card.Description>
				{#each paragraphs as p (p)}
					<p class="mb-3 text-muted-foreground">
						{p}
					</p>
				{/each}

				<Button class="mt-8 flex items-center gap-x-2" {href}>
					<span>{cta}</span>
					<!-- <ExternalLink class="-mt-0.5 inline-block h-4 w-4" /> -->
				</Button>
			</Card.Description>
		</div>
	</Card.Header>
</Card.Root>
