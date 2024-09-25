export const LINKS = [
	{
		innerText: 'Einleitung',
		href: '/sections/chapter-0'
	},
	{
		innerText: 'Daten',
		href: '/sections/chapter-1'
	},
	{
		innerText: 'Unigramm',
		href: '/sections/chapter-2'
	},
	{
		innerText: 'Bigramm',
		href: '/sections/chapter-3'
	},
	{
		innerText: 'N-Gramm',
		href: '/sections/chapter-4'
	}
];

export const END_TOKEN = `[end]`;

export const EXAMPLE_OBJ_SONG = {
	text: 'Shape of You Lyrics\nThe club isnt the best place to find a lover\nSo the bar is where I ... Im in love with the shape of you405Embed'
};

export const EXAMPLE_STR_FUNCTION = `
def preprocess(text: str) -> str:
    # Remove the first part with the title (e.g. "Song Title Lyrics")
    text = re.sub(r'^.* Lyrics\\n', '', text)

    # Remove the end part (e.g. "123Embed")
    text = re.sub(r'\\d+Embed$', '', text)

    # Remove unwanted punctuation and symbols
    text = re.sub(r'[,\\'.!?;:()\\[\\]{}…¨]+', '', text)
    text = re.sub(r'[\\-—]+', ' ', text)

    return text
`;
