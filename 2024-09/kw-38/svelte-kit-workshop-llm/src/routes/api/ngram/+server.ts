import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { URL_SERVER } from '$env/static/private';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const context = url.searchParams.get('context');
	const contextLength = url.searchParams.get('context_length');
	const numSamples = url.searchParams.get('num_samples');
	const seed = url.searchParams.get('seed');

	// Guard clauses
	if (!context) return error(400, 'Missing query parameter: num_samples or context');
	if (!contextLength) return error(400, 'Missing query parameter: context_length');

	// URL construction
	let fetchUrl = `${URL_SERVER}/ngram?context=${context.replace(/[\s+]/g, '%2B')}&context_length=${contextLength}`;
	if (numSamples !== null) fetchUrl += `&num_samples=${numSamples}`;
	if (seed !== null) fetchUrl += `&seed=${seed}`;

	// Fetching data
	const response = await fetch(fetchUrl);
	const data = await response.json();

	return json(data);
};
