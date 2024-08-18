// src/routes/api/stream/+server.ts
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

	const result = await mistral.chat.stream({
		model: 'mistral-small-latest',
		messages: [
			{
				content,
				role: 'user'
			},
			{
				content:
					'Behave like a super smart assistant and provide the best possible response. But, if appropriate, you can also reply humorously or with a touch of sarcasm.',
				role: 'system'
			}
		]
	});

	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of result) {
					console.log(chunk.data.choices[0].delta.content);
					controller.enqueue(JSON.stringify(chunk));
				}
				controller.close();
			} catch (error) {
				controller.error(error);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
