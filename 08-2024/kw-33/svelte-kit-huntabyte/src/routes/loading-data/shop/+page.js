export const load = async ({ fetch }) => {
	// const productRes = await fetch('https://dummyjson.com/products?limit=10');
	// const productData = await productRes.json();
	// const products = productData.products;

	// const userRes = await fetch('https://dummyjson.com/users?limit=10');
	// const userData = await userRes.json();
	// const users = userData.products;

	const fetchProducts = async () => {
		const res = await fetch('https://dummyjson.com/products?limit=5');
		const data = await res.json();
		return data.products;
	};

	const fetchUsers = async () => {
		const res = await fetch('https://dummyjson.com/users?limit=5&delay=2000');
		const data = await res.json();
		return data.users;
	};

	// Promise streaming or use Promise.all to load them all at once
	// Without all: Duration of the promise being awaited, all other promises follow one by one
	// With all: Estimated time: Duration of the promise that takes the longest
	return {
		users: fetchUsers(),
		products: await fetchProducts()
	};
};
