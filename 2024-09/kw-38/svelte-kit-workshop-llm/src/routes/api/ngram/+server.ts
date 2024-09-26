import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const context = url.searchParams.get('context');
	const contextLength = url.searchParams.get('context_length');
	const numSamples = url.searchParams.get('num_samples');

	console.log('\n#############################');

	console.log('context:', context);
	console.log('contextLength:', contextLength);
	console.log('numSamples:', numSamples);

	if (!context) return error(400, 'Missing query parameter: num_samples or context');
	if (!contextLength) return error(400, 'Missing query parameter: context_length');

	const fetchUrl =
		numSamples !== null
			? `http://127.0.0.1:8000/ngram?context=${context.replace(/[\s+]/g, '%2B')}&context_length=${contextLength}&num_samples=${numSamples}`
			: `http://127.0.0.1:8000/ngram?context=${context.replace(/[\s+]/g, '%2B')}&context_length=${contextLength}`;

	const response = await fetch(fetchUrl);
	const data = await response.json();

	console.log(data);

	return json(data);
};
