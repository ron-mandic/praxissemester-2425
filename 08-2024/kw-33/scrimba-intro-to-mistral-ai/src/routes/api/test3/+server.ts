import { Mistral } from '@mistralai/mistralai';
import { MISTRAL_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const mistral = new Mistral({
	apiKey: MISTRAL_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	const { content } = await request.json();
	console.log(content);

	if (!content) return new Response('No content provided', { status: 400 });

	const { choices } = await mistral.chat.complete({
		model: 'mistral-small-latest',
		messages: [
			{
				content,
				role: 'user'
			},
			{
				content:
					'Behave like a super smart assistant and provide the best possible response. But, if appropriate, you can also reply humorously or with a touch of sarcasm. Reply with JSON',
				role: 'system'
			}
		],
		temperature: 0.375,
		responseFormat: {
			type: 'json_object'
		},
		safePrompt: true
	});

	if (choices && choices.length > 0 && choices[0].message) {
		return new Response(JSON.stringify(choices[0].message.content), { status: 200 });
	} else {
		return new Response('Error: choices not defined or empty', { status: 400 });
	}
};
