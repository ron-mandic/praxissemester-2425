import { HfInference } from '@huggingface/inference';
import { HK_TOKEN } from '$env/static/private';

const hf = new HfInference(HK_TOKEN);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const body = await request.formData();
	const prompt = body.get('prompt');
	const inputs = body.get('blob');

	const res = await hf.imageToImage({
		model: 'timbrooks/instruct-pix2pix',
		inputs,
		parameters: {
			prompt
		}
	});
	console.log(res);

	return new Response(res);
}
