import { HfInference } from '@huggingface/inference';
import { HK_TOKEN } from '$env/static/private';

const hf = new HfInference(HK_TOKEN);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { inputs } = await request.json();
	const res = await hf.textToSpeech({
		model: 'espnet/kan-bayashi_ljspeech_vits',
		inputs
	});

	console.log(res); // Blob { size: 42355, type: 'audio/flac' }

	let response = new Response(res, {
		headers: {
			'Content-Disposition': `attachment; filename="audio.flac"`
		}
	});

	return response;
}
