import { untrack } from 'svelte';

export class IsScrolling {
	#threshold: number;
	#current = $state<boolean>(false);

	constructor(threshold: number = 20) {
		this.#threshold = threshold;

		$effect(() => {
			return untrack(() => {
				const onScroll = () => {
					this.#current = window.scrollY > this.#threshold;
				};

				onScroll();
				window.addEventListener('scroll', onScroll);

				return () => {
					window.removeEventListener('scroll', onScroll);
				};
			});
		});
	}

	get current() {
		return this.#current;
	}
}
