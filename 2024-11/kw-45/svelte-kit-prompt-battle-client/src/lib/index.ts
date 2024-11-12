// place files you want to import through the `$lib` alias in this folder.

export const SOCKET_SERVER_URL = 'http://localhost:8080';
export const SOCKET_CLIENT_OPTIONS = {
	transports: ['websocket'],
	reconnection: false,
	reconnectionAttempts: 1,
	reconnectionDelay: 1000,
	pingInterval: 10000,
	pingTimeout: 5000,
	query: {
		'player-1': '1',
		'player-2': '2'
	}
};

export const MAX_INPUT_LENGTH = 1500;
export const CONTROL_NET_MODEL = 'control_v11p_sd15_scribble [d4ba51ff]';

export const BATCH_SIZE = 3;
export const NEGATIVE_PROMPT =
	'naked, sex, porn, erotic, adult, XXX, nudity, obscene, r-rated, hardcore, nsfw, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature';

export const SD_SERVER_URL = 'https://71d3b90f125d29c23f.gradio.live'; // NOTE: Without / at the end
export const SD_ENDPOINT_TXT2IMG = '/sdapi/v1/txt2img';

export const UNKNOWN = '?';
export const TIMER_PROMPT_SECONDS = 60;
export const TIMER_SCRIBBLE_SECONDS = 30;

export const COUNTER_ROUND_CURRENT = [
	'Carry on!',
	'Almost there!',
	'Keep it up!',
	'Keep it going!',
	'You got this!',
	'Stay strong!',
	'Push through!',
	'Keep pushing!',
	"Don't quit!",
	'Stay focused!'
];

export const COUNTER_ROUND_NEW = [
	'Here we go!',
	'Round start!',
	'Time to shine!',
	"Let's do this!",
	'Showtime!',
	'Get ready!',
	'Bring it on!',
	'The game is on!'
];
