<script>
	import { Calendar, TextSearch, ReceiptText, CodeXml } from 'lucide-svelte';

	import BentoMarquee from '$lib/components/svelte/magic/BentoMarquee.svelte';
	import BentoCommand from '$lib/components/svelte/magic/BentoCommand.svelte';
	import BentoResizable from '$lib/components/svelte/magic/BentoResizable.svelte';
	import BentoCalendar from '$lib/components/svelte/magic/BentoCalendar.svelte';

	// https://animation-svelte.vercel.app/bento-grid
	import BentoGrid from '$lib/components/svelte/magic/BentoGrid.svelte';
	import BentoCard from '$lib/components/svelte/magic/BentoCard.svelte';

	// Features Array
	let features = [
		{
			Icon: TextSearch,
			name: 'Importformate und Kursbausteine',
			description:
				'Braucht ihr Hilfe bei der Implementierung von KI-gestützten Services in euren Kursen? Wie schauen gerne bei euch vorbei!',
			href: '/topic-1',
			cta: 'Mehr erfahren',
			background: BentoMarquee
		},
		{
			Icon: ReceiptText,
			name: 'Virtual Learning Spaces',
			description:
				'Hier findet ihr Näheres zu einem hochschuleigenen Prototypen für den Transfer und die Abbildung von Services aus dem AI+D-Lab',
			href: '/topic-2',
			cta: 'Mehr erfahren',
			background: BentoCommand
		},
		{
			Icon: CodeXml,
			name: 'Infrastruktur und Services',
			description:
				'Hier stellen wir euch die neue KI-Infrastruktur vor - von dem hauseigenen Service für Bildgenerierung bis hin zum neuen bwGPT',
			href: '/topic-3',
			cta: 'Mehr erfahren',
			background: BentoResizable
		},
		{
			Icon: Calendar,
			name: 'Forschung, Papers und Projekte',
			description:
				'Hier teilen wir unsere Erfahrungen mit euch, was wir in den letzten Monaten im akademisch-forschenenden Bereich aufgestellt haben',
			href: '/topic-4',
			cta: 'Mehr erfahren',
			background: BentoCalendar
		}
	];
</script>

<div class="flex w-full max-w-[605px] items-center justify-center max-sm:max-w-[calc(100vw-16px)]">
	<BentoGrid>
		{#each features as item}
			<BentoCard {...item} />
		{/each}
	</BentoGrid>
</div>
