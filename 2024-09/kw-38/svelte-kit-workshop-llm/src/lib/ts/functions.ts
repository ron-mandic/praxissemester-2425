export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function preprocess({ text }: { text: string }) {
	const title = text.match(/^(.*) Lyrics/)?.[1] || 'N/A';
	const str = text
		.replace(/^.* Lyrics\n/, '')
		.replace(/\d+Embed$/, '')
		.replace(/[,'’.!?;:()[\]{}…¨]+/g, '')
		.replace(/[-—]+/g, ' ')
		.replace(/[\s]{2,}/g, ' ')
		.toLowerCase();

	const dict = {} as Record<string, number>;
	const words = str.split(/[\s\n]/);

	for (const word of words) {
		if (dict[word]) dict[word]++;
		else dict[word] = 1;
	}

	return {
		title: title ?? 'N/A',
		dict,
		words
	};
}

export function formatSearch(inputText: string, searchText: string) {
	if (!searchText) return inputText;

	const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const regExp = new RegExp(`(${escapedSearchText})`, 'gi');
	const markedText = inputText.replace(
		regExp,
		'<mark class="bg-blue-200 text-blue-700 rounded-[.25rem]">$1</mark>'
	);

	return markedText;
}
