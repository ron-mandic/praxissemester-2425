import { Mistral } from '@mistralai/mistralai';
import { MISTRAL_API_KEY } from '$env/static/private';
import { tools, functions } from '$lib/tools';
import type { RequestHandler } from './$types';
import type { TMessages } from '$lib/types';
import type { Tool } from '@mistralai/mistralai/models/components';

const mistral = new Mistral({
	apiKey: MISTRAL_API_KEY
});
const messages: TMessages = [];

async function agent() {
	// https://github.com/mistralai/client-js/issues/53
	const response = await mistral.chat.stream({
		model: 'mistral-small-latest',
		messages: messages,
		tools: tools as Tool[],
		toolChoice: 'any',
		responseFormat: {
			type: 'text'
		}
	});
	return response;
}

export const POST: RequestHandler = async ({ request }) => {
	const { content: input } = await request.json();
	if (!input) return new Response('No content provided', { status: 400 });

	// Starte mit einer anfänglichen Message
	messages.push({ role: 'user', content: input });

	const response = await agent();

	/**
	 * Nächste Schritte
	 *
	 * Wenn finish_reason === 'tool_calls' dann:
	 * 		Dann extrahiere name und arguments aus message.tool_calls[0].function
	 * 		Führe die Funktion mit den Argumenten aus
	 * 		Füge messages.push({ role: 'tool', name: <Funktionsname>, content: <Funktionsoutput> }) hinzu
	 *      Mache eine erneute Abfrage an Mistral mit den geupdateten messages (am besten in einer Schleife)
	 *
	 * Wenn finish_reason === 'stop' dann:
	 * 		Extrahiere aus der Message den Content
	 * 		Beende die Schleife und damit die Funktion
	 *
	 */

	/*
		TODO: Review on later versions of MistralAI
		GitHub Issue #1: https://github.com/mistralai/client-js/issues/53

		ZodError: [
		{
			"code": "invalid_type",
			"expected": "string",
			"received": "null",
			"path": [
			"data",
			"choices",
			0,
			"delta",
			"content"
			],
			"message": "Expected string, received null"
		},
		{
			"code": "invalid_literal",
			"expected": "function",
			"path": [
			"data",
			"choices",
			0,
			"delta",
			"tool_calls",
			0,
			"type"
			],
			"message": "Invalid literal value, expected \"function\""
		}
		]
			at get error [as error] (C:\Users\Ron\Git Projects\praxissemester-2425\08-2024\kw-33\scrimba-intro-to-mistral-ai\node_modules\zod\lib\types.js:55:31)
			at ZodObject.parse (C:\Users\Ron\Git Projects\praxissemester-2425\08-2024\kw-33\scrimba-intro-to-mistral-ai\node_modules\zod\lib\types.js:160:22)
			at decoder (C:\Users\Ron\Git Projects\praxissemester-2425\08-2024\kw-33\scrimba-intro-to-mistral-ai\node_modules\@mistralai\mistralai\funcs\chatStream.js:96:31)
			at parseEvent (C:\Users\Ron\Git Projects\praxissemester-2425\08-2024\kw-33\scrimba-intro-to-mistral-ai\node_modules\@mistralai\mistralai\lib\event-streams.js:149:12)
			at [Symbol.asyncIterator] (C:\Users\Ron\Git Projects\praxissemester-2425\08-2024\kw-33\scrimba-intro-to-mistral-ai\node_modules\@mistralai\mistralai\lib\event-streams.js:42:35)
			at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
			at async POST (eval at instantiateModule (file:///C:/Users/Ron/Git%20Projects/praxissemester-2425/08-2024/kw-33/scrimba-intro-to-mistral-ai/node_modules/vite/dist/node/chunks/dep-Cy9twKMn.js:52849:24), <anonymous>:32:20)
			at async Module.render_endpoint (eval at instantiateModule (file:///C:/Users/Ron/Git%20Projects/praxissemester-2425/08-2024/kw-33/scrimba-intro-to-mistral-ai/node_modules/vite/dist/node/chunks/dep-Cy9twKMn.js:52849:24), <anonymous>:49:18)
			at async resolve (eval at instantiateModule (file:///C:/Users/Ron/Git%20Projects/praxissemester-2425/08-2024/kw-33/scrimba-intro-to-mistral-ai/node_modules/vite/dist/node/chunks/dep-Cy9twKMn.js:52849:24), <anonymous>:457:17)
			at async Module.respond (eval at instantiateModule (file:///C:/Users/Ron/Git%20Projects/praxissemester-2425/08-2024/kw-33/scrimba-intro-to-mistral-ai/node_modules/vite/dist/node/chunks/dep-Cy9twKMn.js:52849:24), <anonymous>:333:20) {
		issues: [
			{
			code: 'invalid_type',
			expected: 'string',
			received: 'null',
			path: [Array],
			message: 'Expected string, received null'
			},
			{
			received: undefined,
			code: 'invalid_literal',
			expected: 'function',
			path: [Array],
			message: 'Invalid literal value, expected "function"'
			}
		],
		addIssue: [Function (anonymous)],
		addIssues: [Function (anonymous)],
		errors: [
			{
			code: 'invalid_type',
			expected: 'string',
			received: 'null',
			path: [Array],
			message: 'Expected string, received null'
			},
			{
			received: undefined,
			code: 'invalid_literal',
			expected: 'function',
			path: [Array],
			message: 'Invalid literal value, expected "function"'
			}
		]
		}

	 */
	for await (const completionChunk of response) {
		const choice = completionChunk.data.choices[0];
		console.log(choice);
	}

	console.log(content, toolCalls);

	return new Response(JSON.stringify({ data: messages }), { status: 200 });
};
