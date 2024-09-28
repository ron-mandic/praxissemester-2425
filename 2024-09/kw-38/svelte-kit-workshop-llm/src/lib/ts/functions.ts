import { END_TOKEN } from './constants';

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function preformat(str: string) {
	return str
		.replace(/^.* Lyrics\n/, '')
		.replace(/\d+Embed$/, '')
		.replace(/[,'’.!?;:()[\]{}…¨]+/g, '')
		.replace(/[-—]+/g, ' ')
		.replace(/\n/g, ` ${END_TOKEN} `)
		.replace(/[\s]{2,}/g, ' ')
		.toLowerCase();
}

export function formatOutput(str: string) {
	return str.replace(/\+([^+]*)$/, '<span class="font-mono text-[12px]">-></span>$1');
}

export function preprocess({ text }: { text: string }) {
	const title = text.match(/^(.*) Lyrics/)?.[1] || 'N/A';
	const str = preformat(text);

	const dict = {} as Record<string, number>;
	const words = str.split(/[\s\n]/);

	for (const word of words) {
		if (dict[word]) dict[word]++;
		else dict[word] = 1;
	}

	// Sort entries by frequency
	const entries = Object.entries(dict).sort((a, b) => b[1] - a[1]);
	const sortedDict = Object.fromEntries(entries);

	return {
		title: title ?? 'N/A',
		dictionary: sortedDict,
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
