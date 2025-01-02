<script lang="ts">
	import '$lib/styles/normalize.css';
	import '../app.scss';
	// import { ModeWatcher } from 'mode-watcher';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import * as Breadcrumb from '@/components/ui/breadcrumb/index.js';
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import { Separator } from '@/components/ui/separator/index.js';
	import { page } from '$app/state';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

	let { children } = $props();
	let mobile = new IsMobile();
	let paths = $derived.by(() => {
		let segments = page.url.pathname.split('/');
		return segments.map((segment, i, arr) => {
			if (segment === '') {
				return { path: 'Overview', href: '/' };
			}

			let path = segment
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			if (i === arr.length - 1) {
				return { path, href: null };
			}

			return {
				path,
				href: `/${segment}`
			};
		});
	});

	$inspect(page.url.pathname);
</script>

<!-- <ModeWatcher /> -->

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="md:p-2">
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List class="select-none">
						{#if page.url.pathname === '/'}
							<Breadcrumb.Item>
								<Breadcrumb.Page>Overview</Breadcrumb.Page>
							</Breadcrumb.Item>
						{:else}
							{#each paths as { path, href }, i (path)}
								{#if href}
									<Breadcrumb.Item>
										<Breadcrumb.Link {href}
											>{mobile.current && i < paths.length - 1
												? `${path.slice(0, 3)}...`
												: path}</Breadcrumb.Link
										>
									</Breadcrumb.Item>
									<Breadcrumb.Separator />
								{:else}
									<Breadcrumb.Item>
										<Breadcrumb.Page
											class="pointer-events-none overflow-hidden text-ellipsis whitespace-nowrap min-[320px]:max-w-[12ch] min-[393px]:max-w-[21ch] sm:max-w-full"
											>{path}</Breadcrumb.Page
										>
									</Breadcrumb.Item>
								{/if}
							{/each}
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		{@render children?.()}
	</Sidebar.Inset>
</Sidebar.Provider>
