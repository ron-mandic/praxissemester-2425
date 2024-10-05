import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { URL_SERVER_8000 } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const req = await request.json();
	const { inputs, iterations } = req;

	const response = await fetch(`${URL_SERVER_8000}/tokenizer/bpe`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ inputs, iterations })
	});
	const data = await response.json();

	return json(data);
};
