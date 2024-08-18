async function delay<T>(arg: T, ms: number): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(arg), ms));
}

function formatDate(date: Date): string {
	// Wochentage und Monate auf Deutsch
	const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	// Tag des Wochentages
	const day = days[date.getDay()];

	// Formatierte Zeit
	return `${day}, ${hours}:${minutes}`;
}

export { delay, formatDate };
