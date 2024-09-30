import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { URL_SERVER } from '$env/static/private';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const context = url.searchParams.get('context');
	const numSamples = url.searchParams.get('num_samples');
	if (!context) return error(400, 'Missing query parameter: num_samples or context');

	const fetchUrl = numSamples
		? `${URL_SERVER}/bigram?context=${context}&num_samples=${numSamples}`
		: `${URL_SERVER}/bigram?context=${context}`;

	const response = await fetch(fetchUrl);
	const data = await response.json();

	return json(data);
};
