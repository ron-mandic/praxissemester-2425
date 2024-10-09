import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { URL_SERVER_8001 } from '$env/static/private';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const { input } = await request.json();

	const response = await fetch(URL_SERVER_8001 + '/tsne', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ input })
	});
	const data = await response.json();

	return json(data);
};
