import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		message: 'Hello, world!'
	};
};
