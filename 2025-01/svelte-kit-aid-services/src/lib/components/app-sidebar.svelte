<script lang="ts" module>
	import {
		Video,
		Bot,
		Image,
		Sparkles,
		ExternalLink,
		Brain,
		LetterText
	} from 'lucide-svelte/icons';

	export const data = {
		user: {
			name: 'AI+D Lab',
			label: 'HfG Schwäbisch Gmünd',
			logo: '/svg/logo.svg'
		},
		teams: [
			{
				name: 'HfG Services',
				logo: Sparkles,
				label: 'AI+D Lab'
			},
			{
				name: 'bwGPT',
				logo: Bot,
				label: 'MWK Baden-Württemberg',
				disabled: true
			}
		],
		nav: [
			{
				title: 'Text Generation',
				url: '/text-generation',
				icon: LetterText,
				items: []
			},
			{
				title: 'Image Generation',
				url: '/image-generation',
				icon: Image,
				items: [
					{
						title: 'Stable Diffusion',
						url: '/image-generation/stable-diffusion'
					}
				]
			},
			{
				title: 'Video Generation',
				url: '/video-generation',
				icon: Video,
				items: []
			},
			{
				title: 'Miscellaneous',
				url: '/misc',
				icon: Brain,
				items: []
			}
		],
		links: [
			{
				name: 'SandwichNet',
				url: 'https://hfg-gmuend.github.io/SandwichNet/',
				icon: ExternalLink
			},
			{
				name: 'AI+D Mirror',
				url: 'https://hfg-gmuend.github.io/aid-mirror/',
				icon: ExternalLink
			},
			{
				name: 'OpenMoji',
				url: 'https://openmoji.org/',
				icon: ExternalLink
			}
		]
	};
</script>

<script lang="ts">
	import NavServices from '@/components/nav-services.svelte';
	import NavLinks from '@/components/nav-links.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import ApplicationsSwitcher from '@/components/applications-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps} class="border-none bg-background p-2">
	<Sidebar.Header class="bg-background">
		<ApplicationsSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content class="bg-background">
		<NavServices items={data.nav} />
		<NavLinks projects={data.links} />
	</Sidebar.Content>
	<Sidebar.Footer class="bg-background">
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail class="bg-background" />
</Sidebar.Root>
