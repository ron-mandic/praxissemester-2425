import type { PageServerLoad } from './$types';
import { URL_SERVER } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	async function loadData() {
		const response = await fetch(URL_SERVER);
		const data = await response.json();
		return data;
	}

	return {
		fastapi: await loadData()
	};
};
