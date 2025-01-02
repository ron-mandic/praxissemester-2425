<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { ChevronsUpDown, Github, Globe, Mail } from 'lucide-svelte/icons';

	let { user }: { user: { name: string; label: string; logo: string } } = $props();
	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="h-8 w-8 rounded-lg border border-white bg-white">
							<Avatar.Image src={user.logo} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">AID</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs text-muted-foreground">{user.label}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 cursor-pointer rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Group>
					<DropdownMenu.Item class="cursor-pointer">
						<a
							class="inline-flex w-full items-center gap-x-2"
							href="https://aid-lab.hfg-gmuend.de/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Globe />
							<span class="pointer-events-none">Website</span>
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="cursor-pointer">
						<a
							class="inline-flex w-full items-center gap-x-2"
							href="https://github.com/hfg-gmuend"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github />
							<span class="pointer-events-none">GitHub</span>
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="cursor-pointer">
						<a
							class="inline-flex w-full items-center gap-x-2"
							href="mailto:medienlabor@hfg-gmuend.de"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Mail />
							<span class="pointer-events-none">E-Mail</span>
						</a>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
