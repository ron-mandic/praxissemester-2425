import { SECRET_API_KEY } from '$env/static/private';

export const GET = async ({ request, url }) => {
	// const authHeader = request.headers.get('Authorization');
	// if (authHeader !== 'MyAuth') {
	// 	return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	// }

	const queryLimit = +url.searchParams.get('limit') ?? '10';
	const querySkip = +url.searchParams.get('skip') ?? '0';
	const query = `limit=${queryLimit}&skip=${querySkip}`;

	const res = await fetch(`https://dummyjson.com/posts?${query}`);
	const data = await res.json();

	return new Response(JSON.stringify(data), { status: 200 });
};

export const POST = async ({ request, url }) => {
	// const authHeader = request.headers.get('Authorization');
	// if (authHeader !== 'MyAuth') {
	// 	return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	// }

	const body = await request.json();

	return new Response(JSON.stringify({ message: 'Success' }), { status: 201 });
};
