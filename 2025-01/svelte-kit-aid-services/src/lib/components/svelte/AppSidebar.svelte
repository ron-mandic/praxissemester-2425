<script lang="ts">
	import { Sparkles, Bot, ChevronRight, SquareArrowOutUpRight } from 'lucide-svelte/icons';
	import { useSidebar } from '$lib/components/ui/sidebar';

	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import AppFooter from '$lib/components/svelte/AppFooter.svelte';
	import type { SvelteComponent } from 'svelte';
	import AppTeamSwitcher from './AppTeamSwitcher.svelte';

	let { services } = $props();
	const sidebar = useSidebar();

	const teams = $state([
		{
			name: 'hfg.services',
			logo: Sparkles,
			label: 'HfG Schwäbisch Gmünd'
		},
		{
			name: 'bwGPT',
			logo: Bot,
			label: 'MWK Baden-Württemberg',
			disabled: true
		}
	]);

	const user = {
		name: 'AI+D Lab',
		label: 'H 0.17',
		logo: '/svg/logo.svg'
	};

	const links = [
		{
			title: 'AI+D Mirror',
			url: 'https://hfg-gmuend.github.io/aid-mirror/'
		},
		{
			title: 'Prompt Battle',
			url: 'https://promptbattle.com/'
		},
		{
			title: 'SandwichNet',
			url: 'https://hfg-gmuend.github.io/SandwichNet/'
		}
	];

	function handleButtonKeydown(
		event: KeyboardEvent & { currentTarget: EventTarget & Element },
		mainItem:
			| {
					title: string;
					url: string;
					icon: typeof SvelteComponent;
					isActive: boolean;
					items: { title: string; url: string }[];
			  }
			| {
					title: string;
					url: string;
					icon: typeof SvelteComponent;
					items: { title: string; url: string }[];
					isActive?: undefined;
			  }
	) {
		if (event.repeat) return;

		if (event.code === 'Enter' && sidebar.state === 'collapsed') {
			event.preventDefault();
			sidebar.toggle();
			return;
		}

		if (event.code === 'ArrowLeft' && event.shiftKey && sidebar.state === 'expanded') {
			event.preventDefault();
			sidebar.toggle();
			return;
		}

		const target = event.target as HTMLButtonElement | HTMLAnchorElement;
		const nodeName = target.nodeName;
		console.log(nodeName);

		switch (event.code) {
			case 'ArrowRight': {
				event.preventDefault();
				mainItem.isActive = true;
				break;
			}
			case 'ArrowLeft': {
				event.preventDefault();
				if (nodeName === 'A') break;
				mainItem.isActive = false;
				break;
			}
		}
	}

	function handleAnchorClick(_: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
		if (!sidebar.isMobile) return;

		setTimeout(() => {
			sidebar.toggle();
		}, 375);
	}

	function handleButtonClick(
		_: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
		mainItem:
			| {
					title: string;
					url: string;
					icon: typeof SvelteComponent;
					isActive: boolean;
					items: { title: string; url: string }[];
			  }
			| {
					title: string;
					url: string;
					icon: typeof SvelteComponent;
					items: { title: string; url: string }[];
					isActive?: undefined;
			  }
	) {
		if (sidebar.isMobile) return;

		if (sidebar.state === 'collapsed') {
			sidebar.toggle();
			mainItem.isActive = true;
			return;
		}
	}
</script>

<Sidebar.Root variant="floating" collapsible="icon">
	<Sidebar.Header>
		<AppTeamSwitcher {teams} />
	</Sidebar.Header>

	<Sidebar.Separator />

	<Sidebar.Content>
		<!-- <Sidebar.Group>
			<Sidebar.GroupLabel>Services</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each { length: 5 }, index (index)}
						<Sidebar.MenuItem>
							<Sidebar.MenuSkeleton showIcon />
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Separator /> -->

		<Sidebar.Group>
			<Sidebar.GroupLabel>Collection</Sidebar.GroupLabel>
			<Sidebar.Menu>
				{#each services as service (service.title)}
					<Collapsible.Root
						onclick={(e) => handleButtonClick(e, service)}
						onkeydown={(e) => handleButtonKeydown(e, service)}
						open={service?.isActive}
						class="group/collapsible"
					>
						{#snippet child({ props })}
							<Sidebar.MenuItem {...props}>
								<Collapsible.Trigger>
									{#snippet child({ props })}
										<Sidebar.MenuButton
											tooltipContentProps={{ class: 'bg-sidebar' }}
											class="data-[focus=true]:ring-2"
											{...props}
										>
											{#snippet tooltipContent()}
												{service.title}
											{/snippet}

											{#if service.icon}
												<service.icon />
											{/if}

											<span>{service.title}</span>
											<ChevronRight
												class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
										</Sidebar.MenuButton>
										<Sidebar.MenuBadge class="-translate-x-6 text-right"
											>{service.items.length}</Sidebar.MenuBadge
										>
									{/snippet}
								</Collapsible.Trigger>

								<Collapsible.Content>
									{#if service.items}
										<Sidebar.MenuSub>
											{#each service.items as subItem, i (subItem.title)}
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton
														class="data-[focus=true]:ring-2"
														onclick={handleAnchorClick}
													>
														{#snippet child({ props })}
															<a href={subItem.url} {...props}>
																<!-- Icon -->
																<span>{subItem.title}</span>
															</a>
														{/snippet}
													</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											{/each}
										</Sidebar.MenuSub>
									{/if}
								</Collapsible.Content>
							</Sidebar.MenuItem>
						{/snippet}
					</Collapsible.Root>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>

		<Sidebar.Group class="mt-auto">
			<Sidebar.GroupLabel>Links</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each links as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton tooltipContentProps={{ class: 'bg-sidebar' }}>
								{#snippet tooltipContent()}
									{item.title}
								{/snippet}

								{#snippet child({ props })}
									<a href={item.url} target="_blank" rel="noopener noreferrer" {...props}>
										<SquareArrowOutUpRight />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Separator />

	<Sidebar.Footer>
		<AppFooter {user} />
	</Sidebar.Footer>

	<Sidebar.Rail
		class="-translate-x-[10px] hover:animate-pulse focus-visible:animate-pulse data-[state=collapsed]:-translate-x-[11px]"
		data-state={sidebar.state}
	/>
</Sidebar.Root>
