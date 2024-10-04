import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { URL_SERVER_8000 } from '$env/static/private';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const numSamples = url.searchParams.get('num_samples');
	const fetchUrl = numSamples
		? `${URL_SERVER_8000}/unigram?num_samples=${numSamples}`
		: `${URL_SERVER_8000}/unigram`;

	const response = await fetch(fetchUrl);
	const data = await response.json();

	return json(data);
};
