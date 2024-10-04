import type { PageServerLoad } from './$types';
import { URL_SERVER_8000 } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	async function loadData() {
		const response = await fetch(URL_SERVER_8000);
		const data = await response.json();
		return data;
	}

	return {
		fastapi: await loadData()
	};
};
