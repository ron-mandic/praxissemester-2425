<script lang="ts">
	import TopicCard from '@/svelte/TopicCard.svelte';
	import TopicHeader from '@/svelte/TopicHeader.svelte';

	const header = {
		title: 'Importformate und Kursbausteine',
		subtitle: 'Lorem ipsum',
		description:
			'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam fuga nam beatae culpa quos, saepe esse magnam cum laboriosam sapiente vero consectetur, nemo labore sunt tempore. Molestias soluta quia beatae voluptatum quod quam id non qui placeat alias voluptates eius veritatis, tempore pariatur, illum iste nesciunt accusamus animi et aliquid.'
	};

	const cards = [
		{
			imgSrc: '/png/image-sandwichnet.png',
			title: 'Lorem ipsum',
			paragraphs: [
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam fuga nam beatae culpa quos, saepe esse magnam cum laboriosam sapiente vero consectetur, nemo labore sunt tempore.'
			]
		}
	];
</script>

<section class="h-full w-full max-w-[605px] max-sm:max-w-[calc(100vw-16px)]">
	<TopicHeader {...header} />
	{#each cards as card}
		<TopicCard {...card} />
	{/each}
</section>
