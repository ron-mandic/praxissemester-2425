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

	// const markedText = inputText.replace(
	// 	regExp,
	// 	'<mark class="bg-blue-200 text-blue-700 rounded-[.25rem]">$1</mark>'
	// );

	// Keep the whitespace and newlines
	const markedText = inputText.replace(
		regExp,
		(match) => `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem]">${match}</mark>`
	);

	return markedText;
}

export function formatSearchToken(
	inputText: string,
	searchText: string,
	dict: Record<string, string>
) {
	// If there is no searchText, please render the end_token by replacing it with a valid HTML entity
	if (!searchText) return inputText.replace(dict.endToken, dict.endTokenEscaped);

	// First treat it like ordinary token text with </w> at the end
	const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regExp = new RegExp(`(${escapedSearchText})`, 'gi');

	// Right after that we need to make sure that individual characters of </w> are being converted into html entities
	const markedText = inputText.replace(
		regExp,
		(match) =>
			`<mark class="bg-blue-200 text-blue-700 rounded-[.25rem]">${match.replaceAll('<', dict.lt).replaceAll('/', dict.slash).replaceAll('>', dict.gt)}</mark>`
	);

	// That way we made sure that all characters other than the mark tag itself are being converted into html entities
	return markedText.replace(/<\/w>$/, dict.endTokenEscaped); // At the end of the string, it can still contain </w>, that is why we need to replace it with a valid HTML entity as well (but just right at the end)
}
