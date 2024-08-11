// Import private env variables e.g. for the API key

export const load = async () => {
	const fetchMovies = async () => {
		const response = await fetch(
			`https://api.themoviedb.org/3/movie/popular?api_key=...&language=en-US&page=...`
		);
		const data = await response.json();
		return data.results;
    };
    
    return {
        movies: await fetchMovies()
    }
};
