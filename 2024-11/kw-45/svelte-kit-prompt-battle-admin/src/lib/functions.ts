export function getRandomFrom(array: unknown[]) {
	return array[Math.floor(Math.random() * array.length)];
}
