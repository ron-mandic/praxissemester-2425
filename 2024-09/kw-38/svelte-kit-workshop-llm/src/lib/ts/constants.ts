export const LINKS = [
	{
		heading: 'Einführung'
	},
	{
		innerText: 'Übersicht',
		href: '/sections/chapter-0'
	},
	{
		innerText: 'Daten',
		href: '/sections/chapter-1'
	},
	{
		heading: 'Grundlagen'
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
	},
	{
		heading: 'Tokens'
	},
	{
		innerText: 'Leerzeichen',
		href: '/sections/chapter-5'
	},
	{
		innerText: 'Zeichensetzung',
		href: '/sections/chapter-6'
	},
	{
		innerText: 'Affixe',
		href: '/sections/chapter-7'
	},
	{
		innerText: 'Byte-Pair',
		href: '/sections/chapter-8'
	},
	{
		heading: 'Embeddings'
	},
	{
		innerText: 'Generierung'
	},
	{
		innerText: 'Visualisierung'
	},
	{
		heading: 'Exkurs'
	},
	{
		innerText: 'Eliza'
	},
	{
		// TODO: https://github.com/eleventigers/mitsuku-api
		innerText: 'Mitsuku',
		available: false
	},
	{
		heading: 'Inferenz'
	},
	{
		innerText: 'Seed und Temperatur'
	},
	{
		innerText: 'Dialog Engineering'
	},
	{
		innerText: 'Chatbot'
	},
	{
		heading: 'Beispiele'
	},
	{
		innerText: 'Fill-Mask'
	},
	{
		innerText: 'Frage-Antwort-Systeme'
	},
	{
		innerText: 'Textklassifizierung'
	},
	{
		innerText: 'Textvervollständigung'
	},
	{
		innerText: 'Textzusammenfassung'
	},
	{
		innerText: 'Textübersetzung'
	},
	{
		// TODO: https://huggingface.co/dslim/bert-base-NER
		innerText: 'Tokenklassifizierung',
		available: false
	},
	{
		innerText: 'Reasoning'
	},
	{
		innerText: 'Satzähnlichkeit'
	},
	{
		innerText: 'Zero-Shot'
	}
];

// TODO: Add more colors or use a more uniform color palette
export const TOKEN_COLORS = [
	'#f1cfc6',
	'#cbf2bd',
	'#bbdaf1',
	'#d9e8a2',
	'#eff1b6',
	'#d7b0ec',
	'#efe8af',
	'#e4d59a',
	'#f4ddcf',
	'#e4f8d5',
	'#d68ca8',
	'#91c2dd'
];

export const END_TOKEN = `[end]`;
export const END_TOKEN_HTML = `<br/>`;

export const EXAMPLE_OBJ_SONG = {
	text: 'Shape of You Lyrics\nThe club isnt the best place to find a lover\nSo the bar is where I ... Im in love with the shape of you405Embed'
};

export const EXAMPLE_OBJ_SONG_PREFORMATTED = {
	text: 'the club isnt the best place to find a lover [end] so the bar is where i ... im in love with the shape of you'
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
