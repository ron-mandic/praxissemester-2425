<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Kbd from './Kbd.svelte';
	import Sticker from './Sticker.svelte';

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { teams }: { teams: { name: string; logo: any; label: string; disabled?: boolean }[] } =
		$props();

	const sidebar = useSidebar();
	let currentTeam = $state(teams[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground"
						>
							<currentTeam.logo class="size-4 text-black" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{currentTeam.name}
							</span>
							<span class="truncate text-xs text-muted-foreground">{currentTeam.label}</span>
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>

			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg bg-sidebar"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-xs text-muted-foreground no-interaction"
					>Applications
				</DropdownMenu.Label>

				{#each teams as team, index (team.name)}
					<div
						class={{
							'group relative': true,
							'after:absolute after:inset-0 after:bg-gradient-to-r after:from-sidebar after:via-sidebar/10 after:to-sidebar/0 after:content-[""]':
								team.disabled
						}}
					>
						<DropdownMenu.Item
							disabled={team.disabled}
							onSelect={() => {
								if (team.disabled) return;
								currentTeam = team;
							}}
							class="relative gap-2 p-2"
						>
							<div class="flex size-6 items-center justify-center bg-transparent">
								<team.logo class="size-4 shrink-0" />
							</div>

							<span class="pointer-events-none">{team.name}</span>

							{#if !team.disabled}
								<DropdownMenu.Shortcut class="pointer-events-none">
									<Kbd class="min-w-[48px] py-1 tracking-tighter">⌥ + {index + 1}</Kbd>
								</DropdownMenu.Shortcut>
							{/if}
						</DropdownMenu.Item>

						{#if team.disabled}
							<Sticker
								class="group-hover:animate-jello absolute right-2 top-2 no-interaction"
								title="Coming soon"
							/>
						{/if}
					</div>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
