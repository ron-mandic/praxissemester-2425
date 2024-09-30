import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { URL_SERVER } from '$env/static/private';
// import { delay } from '$lib/ts/functions';

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch(URL_SERVER);
	const data = await response.json();

	return json(data);
};
