import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	async function loadData() {
		const response = await fetch('http://127.0.0.1:8000/');
		const data = await response.json();
		return data;
	}

	return {
		fastapi: await loadData()
	};
};
