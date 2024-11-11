// place files you want to import through the `$lib` alias in this folder.

export const SOCKET_SERVER_URL = 'http://localhost:8080';
export const SOCKET_CLIENT_OPTIONS = {
	transports: ['websocket', 'polling'],
	reconnection: false,
	reconnectionAttempts: 3,
	reconnectionDelay: 2000,
	pingInterval: 10000,
	pingTimeout: 15000
};

export const MAX_INPUT_LENGTH = 1500;

export const BATCH_SIZE = 3;
export const NEGATIVE_PROMPT =
	'naked, sex, porn, erotic, adult, XXX, nudity, obscene, r-rated, hardcore, nsfw, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature';

export const SD_SERVER_URL = 'https://71d3b90f125d29c23f.gradio.live'; // NOTE: Without / at the end
export const UNKNOWN = '?';
export const TIMER_PROMPT_SECONDS = 10;
export const TIMER_SCRIBBLE_SECONDS = 10;
