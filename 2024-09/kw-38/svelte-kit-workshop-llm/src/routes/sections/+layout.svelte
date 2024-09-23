<script lang="ts">
	import '../../app.scss';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	import Menu from 'lucide-svelte/icons/menu';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	import { LINKS } from '$lib/ts/constants';
	import LLMNav from '$lib/components/svelte/LLMNav.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { ScrollArea } from '@/ui/scroll-area';

	let content = {
		page,
		links: LINKS
	};

	let attrA = {
		version: 'v1',
		...content
	};

	let attrB = {
		version: 'v2',
		...content
	};

	export let data;
</script>

<ScrollArea class="relative min-h-screen w-full">
	<div class="grid h-full max-h-screen w-full max-[319px]:hidden md:grid-cols-[240px_1fr]">
		<div class="relative hidden border-r bg-muted/40 md:block">
			<div class="fixed flex h-full w-[240px] flex-col gap-2">
				<div class="relative flex h-[60px] items-center px-6">
					<div class="flex items-center gap-2 font-semibold">
						<Sparkles class="h-6 w-6" />
						<span class="select-none text-xl font-bold">LLMs</span>
					</div>
				</div>
				<div class="flex-1">
					<LLMNav {...attrA} />
				</div>
			</div>
		</div>
		<div class="flex flex-col">
			<header class="flex h-[60px] items-center gap-4 border-b bg-muted/40 px-4 md:hidden">
				<Sheet.Root>
					<Sheet.Trigger asChild let:builder>
						<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
							<Menu class="h-5 w-5" />
							<span class="sr-only">Toggle navigation menu</span>
						</Button>
					</Sheet.Trigger>
					<Sheet.Content side="left" class="flex flex-col">
						<div class="flex items-center gap-2 font-semibold">
							<Sparkles class="h-6 w-6" />
							<span class="select-none text-xl font-bold">LLMs</span>
						</div>
						<LLMNav {...attrB} />
					</Sheet.Content>
				</Sheet.Root>
			</header>
			<main
				class="relative mx-auto flex h-full min-h-screen min-w-[319px] max-w-[540px] flex-1 flex-col gap-6 px-4 pb-32 pt-10 md:px-6 md:pt-20"
			>
				{#key data.url}
					<div in:fly={{ x: -25, duration: 300, delay: 300 }} out:fly={{ x: 25, duration: 300 }}>
						<slot />
					</div>
				{/key}
			</main>
		</div>
	</div>
</ScrollArea>
