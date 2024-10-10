import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { URL_SERVER_8001 } from '$env/static/private';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const { prompt, temperature, seed, num_samples } = await request.json();

	const response = await fetch(URL_SERVER_8001 + '/gpt2', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt, temperature, seed, num_samples })
	});
	const data = await response.json();

	return json(data);
};
