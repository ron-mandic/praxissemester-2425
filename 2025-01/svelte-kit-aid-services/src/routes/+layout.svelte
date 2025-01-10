<script lang="ts">
	import 'normalize.css';
	import '@fontsource/montecarlo';
	import '../app.scss';

	import App from '$lib/components/svelte/App.svelte';
	import AppSidebar from '$lib/components/svelte/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Image, AudioLines, BookOpen, LetterText } from 'lucide-svelte/icons';

	let { data, children } = $props();

	const services = $state([
		{
			title: 'Audio',
			url: '/audio',
			icon: AudioLines,
			items: [
				{
					title: 'ElevenLabs',
					url: 'https://elevenlabs.io/'
				},
				{
					title: 'Hume',
					url: 'https://www.hume.ai/'
				},
				{
					title: 'Murf AI',
					url: 'https://murf.ai/'
				},
				{
					title: 'Stable Audio',
					url: 'https://stableaudio.com/'
				},
				{
					title: 'Suno',
					url: 'https://suno.com/'
				},
				{
					title: 'Udio',
					url: 'https://www.udio.com/'
				}
			]
		},
		{
			title: 'Text',
			url: '/text',
			icon: LetterText,
			items: [
				{
					title: 'ChatGPT',
					url: 'https://chatgpt.com/'
				},
				{
					title: 'Claude',
					url: 'https://claude.ai/'
				},
				{
					title: 'Copilot',
					url: 'https://copilot.microsoft.com/'
				},
				{
					title: 'Gemini',
					url: 'https://gemini.google.com/'
				},
				{
					title: 'Grok',
					url: 'https://x.ai/'
				},
				{
					title: 'HuggingChat',
					url: 'https://huggingface.co/chat/'
				},
				{
					title: 'Meta AI',
					url: 'https://www.meta.ai/'
				},
				{
					title: 'Mistral',
					url: 'https://chat.mistral.ai/'
				},
				{
					title: 'Perplexity',
					url: 'https://perplexity.ai/'
				},
				{
					title: 'Phind',
					url: 'https://www.phind.com/'
				},
				{
					title: 'You',
					url: 'https://you.com/'
				}
			]
		},
		{
			title: 'Image',
			url: '/image',
			icon: Image,
			items: [
				{
					title: 'Adobe Firefly',
					url: 'https://firefly.adobe.com/'
				},
				{
					title: 'Ideogram',
					url: 'https://dreamstudio.ai/'
				},
				{
					title: 'Leonardo.Ai',
					url: 'https://leonardo.ai/'
				},
				{
					title: 'Microsoft Designer',
					url: 'https://designer.microsoft.com/'
				},
				{
					title: 'Midjourney',
					url: 'https://www.midjourney.com/'
				},
				{
					title: 'Recraft',
					url: 'https://www.recraft.ai/'
				},
				{
					title: 'Replicate',
					url: 'https://replicate.com/'
				},
				{
					title: 'Stable Diffusion',
					url: 'https://stablediffusionweb.com/'
				}
			]
		},
		{
			title: 'Video',
			url: '#',
			icon: BookOpen,
			items: [
				{
					title: 'AI Studios',
					url: 'https://www.aistudios.com/'
				},
				{
					title: 'Dream Machine',
					url: 'https://dream-machine.lumalabs.ai/'
				},
				{
					title: 'Haiper',
					url: 'https://haiper.ai/'
				},
				{
					title: 'KLING AI',
					url: 'https://klingai.com/'
				},
				{
					title: 'Pika',
					url: 'https://pika.art/'
				},
				{
					title: 'Runway',
					url: 'https://runwayml.com/'
				},
				{
					title: 'Stable Video',
					url: 'https://www.stablevideo.com/'
				},
				{
					title: 'Sora',
					url: 'https://sora.com/'
				},
				{
					title: 'Veo 2',
					url: 'https://deepmind.google/technologies/veo/veo-2/'
				}
			]
		}
	]);
</script>

<Sidebar.Provider
	class="min-h-[calc(100dvh-74px)] focus-visible:border-none"
	style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;"
>
	<AppSidebar {services} />

	<App {services} url={data.url}>
		{@render children?.()}
	</App>
</Sidebar.Provider>
