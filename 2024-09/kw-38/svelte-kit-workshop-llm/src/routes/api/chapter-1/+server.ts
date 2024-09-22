import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const numSamples = url.searchParams.get('num_samples');
	const fetchUrl = numSamples
		? `http://127.0.0.1:8000/chapter-1?num_samples=${numSamples}`
		: 'http://127.0.0.1:8000/chapter-1';

	const response = await fetch(fetchUrl);
	const data = await response.json();

	return json(data);
};
