export const load = async ({ fetch, params }) => {
	const fetchPost = async (id) => {
		const res = await fetch(`/api-routes-endpoints/api/posts/${id}`);
		const data = await res.json();
		return data;
	};

	return {
		post: await fetchPost(params.postId)
	};
};
