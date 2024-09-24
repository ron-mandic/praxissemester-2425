import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// import { delay } from '$lib/ts/functions';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const response = await fetch('http://127.0.0.1:8000/');
	const data = await response.json();

	return json(data);
};
