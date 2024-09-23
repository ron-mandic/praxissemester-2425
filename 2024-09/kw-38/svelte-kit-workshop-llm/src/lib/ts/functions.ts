export function formatSearch(inputText: string, searchText: string) {
	if (!searchText) return inputText;

	const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const regExp = new RegExp(`(${escapedSearchText})`, 'gi');
	const markedText = inputText.replace(
		regExp,
		'<mark class="bg-blue-200 text-blue-700 rounded-sm">$1</mark>'
	);

	return markedText;
}
