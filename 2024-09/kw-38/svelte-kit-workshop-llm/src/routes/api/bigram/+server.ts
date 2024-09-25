import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const context = url.searchParams.get('context');
	const numSamples = url.searchParams.get('num_samples');
	if (!context) return error(400, 'Missing query parameter: num_samples or context');

	const fetchUrl = numSamples
		? `http://127.0.0.1:8000/bigram?context=${context}&num_samples=${numSamples}`
		: `http://127.0.0.1:8000/bigram?context=${context}`;

	const response = await fetch(fetchUrl);
	const data = await response.json();

	return json(data);
};
