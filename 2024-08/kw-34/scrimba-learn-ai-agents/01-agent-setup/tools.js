export async function getCurrentWeather() {
	return JSON.stringify({
		tempature: "72",
		unit: "F",
		forecast: "Sunny",
	});
}

export async function getLocation() {
	return "Salt Lake City UT";
}
