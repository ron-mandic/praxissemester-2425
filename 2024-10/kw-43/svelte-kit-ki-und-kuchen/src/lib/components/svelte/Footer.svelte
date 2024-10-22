<div class="mt-24 flex h-auto w-full items-center justify-between px-8 py-6 opacity-50 md:px-0">
	<span>&copy; HfG</span>
	<a href="https://aid-lab.hfg-gmuend.de/" aria-label="wrapper">
		<img src="/svg/logo.svg" alt="AI+D Lab" class="h-16 w-16" />
	</a>
	<span>{new Date().getFullYear()}</span>
</div>

<style lang="scss">
	a:hover {
		@apply animate-pulse;

		img {
			transform: translate3d(0, -2px, 0);
		}
	}

	img {
		@apply transition-transform;
	}
</style>
