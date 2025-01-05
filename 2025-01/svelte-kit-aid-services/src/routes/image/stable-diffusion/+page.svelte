<script>
	import Section from '@/components/svelte/Section.svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { Settings2, Sparkles } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import Kbd from '@/components/svelte/Kbd.svelte';

	let value = $state('');
	let refTextarea = $state();

	$inspect(value);
</script>

<Section class="relative">
	<div class="h-full w-full">
		<form
			class="absolute bottom-0 left-1/2 flex h-auto w-full -translate-x-1/2 flex-col items-center justify-end"
		>
			<div
				class="relative h-full w-full max-w-[560px] rounded-lg border border-slate-200/10 bg-sidebar/70 p-2.5 shadow-sm backdrop-blur-xl transition-[width,transform,margin]"
			>
				<Textarea
					bind:this={refTextarea}
					bind:value
					placeholder="What will you create?"
					class="max-h-[350px] w-full resize-none border-none bg-transparent p-1 text-base transition-colors focus-visible:ring-0 focus-visible:ring-[none]"
					oninput={(e) => {
						let height = e.currentTarget.scrollHeight;
						e.currentTarget.style.height = height + 'px';

						if (e.currentTarget.value.trim() === '') {
							e.currentTarget.style.height = 'auto';
						}
					}}
				/>
				<div class="align-items mt-4 flex flex-row justify-between">
					<div class="flex items-center gap-x-2">
						<Button size="icon" variant="secondary">
							<Settings2 />
						</Button>
						<Button class="px-3" variant="ghost">
							<Sparkles />
							Prompt verbessern
						</Button>
					</div>
					<div>
						<Button class=" px-3md:px-2.5" type="submit" disabled={value.length === 0}>
							<Sparkles />
							Generate
							<Kbd
								class="ml-1 hidden items-center gap-x-1 border-slate-300 bg-transparent md:inline-flex"
							>
								<span class="text-sm">⌘</span>
								<span class="-translate-y-px text-sm">↵</span>
							</Kbd>
						</Button>
					</div>
				</div>
			</div>
		</form>
	</div>
</Section>

<style lang="scss">
	#input-container {
		@apply absolute h-full w-full bg-none;
		width: 100%;
		height: auto;
		bottom: 0.5rem;
		left: 50%;
		transform: translateX(-50%);
	}

	:global(.drawer) {
		outline: none;
		border: none;
	}
</style>
