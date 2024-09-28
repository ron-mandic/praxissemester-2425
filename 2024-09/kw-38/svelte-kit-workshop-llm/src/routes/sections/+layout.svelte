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
	import { quartOut } from 'svelte/easing';

	const { data, children } = $props();
	let isOpen = $state(false);

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
		handler: () => {
			isOpen = false;
		},
		...content
	};
</script>

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
	<div class="relative flex flex-col">
		<header
			class="sticky top-0 z-[2] flex h-[60px] items-center gap-4 border-b bg-background/80 px-4 py-8 backdrop-blur-3xl md:hidden"
		>
			<Sheet.Root bind:open={isOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="-ml-1 shrink-0 md:hidden"
						builders={[builder]}
					>
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
			class="relative mx-auto flex h-full min-h-screen max-w-[540px] flex-1 flex-col gap-6 px-2 pb-32 pt-10 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:h-full after:w-full after:from-transparent after:to-white after:content-[''] md:px-3 md:pt-20"
		>
			{#key data.url}
				<div
					in:fly={{ x: 10, duration: 500, delay: 500, opacity: 0, easing: quartOut }}
					out:fly={{ x: -10, duration: 300, opacity: 0, easing: quartOut }}
				>
					{@render children()}
				</div>
			{/key}
		</main>
	</div>
</div>
