<script>
	import Section from '@/components/svelte/Section.svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { Settings2, Sparkles, Pencil } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import Kbd from '@/components/svelte/Kbd.svelte';

	let value = $state('');
	let refTextarea = $state();

	$inspect(value);
</script>

<Section class="relative">
	<form
		class="absolute bottom-9 left-1/2 flex h-auto w-full max-w-[560px] -translate-x-1/2 flex-col items-center justify-end"
	>
		<div
			class="relative h-full w-full rounded-lg border border-sidebar-border bg-sidebar/80 p-2 shadow-sm backdrop-blur-xl transition-[width,transform,margin]"
		>
			<Textarea
				bind:this={refTextarea}
				bind:value
				name="prompt"
				placeholder="What will you create?"
				class="max-h-[150px] w-full resize-none border-none bg-transparent text-base transition-colors focus-visible:ring-0 focus-visible:ring-[none] md:max-h-[220px]"
				oninput={(e) => {
					let height = e.currentTarget.scrollHeight;
					e.currentTarget.style.height = height + 'px';

					if (e.currentTarget.value.trim() === '') {
						e.currentTarget.style.height = 'auto';
					}
				}}
			/>
			<div class="align-items mt-4 flex flex-row justify-between">
				<div class="flex items-center gap-x-1.5">
					<Button size="icon" variant="ghost" tabindex={0} class="text-muted-foreground">
						<Settings2 />
					</Button>
					<Button class="inline-flex gap-x-2.5 bg-transparent px-3 text-muted-foreground" variant="ghost" tabindex={0}>
						<Pencil />
						<span>Improve prompt</span>
					</Button>
				</div>
				<div>
					<Button
						class="disabled:opacity-30 h-11 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-3 text-white transition-[opacity,transform] duration-300 ease-out-cubic hover:-translate-y-[2px] active:-translate-y-[2px]"
						type="submit"
						tabindex={0}
						disabled={value.length === 0}
					>
						<Sparkles class="mx-.5" />
						<span>Generate</span>
						<Kbd
							class="ml-3 hidden items-center gap-x-1 border-slate-300/30 bg-transparent md:inline-flex"
						>
							<span class="text-sm">⌘</span>
							<span class="-translate-y-px text-sm">↵</span>
						</Kbd>
					</Button>
				</div>
			</div>
		</div>
	</form>
</Section>

<style lang="scss">
	form::after {
		content: 'Do not use for malicious purposes';
		@apply absolute left-1/2 top-full w-full transition-transform duration-200 ease-out-cubic -translate-x-1/2 translate-y-3 cursor-auto text-center text-xs text-muted-foreground/50 no-interaction;
	}
</style>
