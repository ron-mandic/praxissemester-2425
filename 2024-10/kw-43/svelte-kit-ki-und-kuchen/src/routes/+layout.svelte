<script lang="ts">
	import '../app.scss';
	import { page } from '$app/stores';
	import { blur, fade, fly, type EasingFunction, type TransitionConfig } from 'svelte/transition';

	import Menu from 'lucide-svelte/icons/menu';
	import Cake from 'lucide-svelte/icons/cake-slice';

	import { LINKS } from '$lib/ts/constants';
	import LLMNav from '$lib/components/svelte/LLMNav.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { backIn, backOut, circIn, circOut } from 'svelte/easing';

	// 1. back
	// 2. circ
	// 3. sine / quad / quint

	type Params = {
		delay?: number;
		duration?: number;
		easing?: EasingFunction;
	};
	type Options = {
		direction?: 'in' | 'out' | 'both';
	};

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

	function opacity(
		node: Element,
		{ delay = 0, duration = 300, easing }: Params = {},
		{ direction = 'both' }: Options = {}
	): TransitionConfig {
		return {
			delay,
			duration,
			easing,
			css: (t) => `
        opacity: ${t};
      `
		};
	}
</script>

<div class="grid h-full max-h-screen w-full max-[319px]:hidden lg:grid-cols-[290px_1fr]">
	<div class="relative hidden border-r bg-muted/40 lg:block">
		<div class="fixed flex h-full w-[290px] flex-col gap-2">
			<div class="relative flex h-[60px] items-center px-6">
				<div class="flex items-center gap-2 font-semibold">
					<Cake class="h-6 w-6" />
					<span class="select-none text-xl font-bold">KI & Kuchen</span>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto">
				<LLMNav {...attrA} />
			</div>
		</div>
	</div>
	<div class="relative flex flex-col">
		<header
			class="sticky top-0 z-[2] flex h-[60px] items-center gap-4 border-b bg-background px-4 py-8 lg:hidden"
		>
			<Sheet.Root bind:open={isOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="-ml-1 shrink-0 lg:hidden"
						builders={[builder]}
					>
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex flex-col px-0 pb-0">
					<div class="flex items-center gap-2 px-6 font-semibold">
						<Cake class="h-6 w-6" />
						<span class="select-none text-xl font-bold">KI & Kuchen</span>
					</div>
					<LLMNav {...attrB} />
				</Sheet.Content>
			</Sheet.Root>
		</header>
		<main
			class="relative mx-auto flex h-full min-h-screen flex-1 flex-col gap-6 px-2 pb-20 pt-10 lg:px-3 lg:pt-20"
		>
			{#key data.url}
				<div
					in:fly={{ x: 15, duration: 500, delay: 300, opacity: 0, easing: backOut }}
					out:fly={{ x: -15, duration: 300, opacity: 0, easing: backIn }}
				>
					{@render children()}
				</div>
			{/key}
		</main>
	</div>
</div>
