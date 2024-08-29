/**
 * @param {number} min
 * @param {number} max
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const load = async ({ fetch, params }) => {
	console.log(params);

	/**
	 * @param {string} id
	 */
	const fetchProduct = async (id) => {
		// Dummy JSON API
		const res = await fetch(`https://dummyjson.com/products/${id}?delay=${random(500, 2000)}`);
		const data = await res.json();
		return data;
	};

	return {
		product: fetchProduct(params.productId)
	};
};
