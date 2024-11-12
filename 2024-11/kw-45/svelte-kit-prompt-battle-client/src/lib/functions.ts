import { CONTROL_NET_MODEL, NEGATIVE_PROMPT, SD_ENDPOINT_TXT2IMG, SD_SERVER_URL } from './index.ts';
import type { DataType } from './interfaces.ts';

export async function fetchImages(
	prompt: string,
	scribble: string,
	mode: string,
	batchSize: number
): Promise<DataType> {
	const payload = {
		prompt: prompt,
		negative_prompt: NEGATIVE_PROMPT,
		steps: 20,
		cfg_scale: 6,
		width: 512,
		height: 512,
		batch_size: batchSize + 1,
		alwayson_scripts: {}
	};

	if (mode && mode === 'ps' && scribble !== '') {
		payload.alwayson_scripts = {
			controlnet: {
				args: [
					{
						enabled: true,
						image: scribble,
						module: 'none',
						model: CONTROL_NET_MODEL
					}
				]
			}
		};
	}

	const url = SD_SERVER_URL + SD_ENDPOINT_TXT2IMG;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	return response.json();
}
