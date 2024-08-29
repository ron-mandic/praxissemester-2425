import { Mistral } from '@mistralai/mistralai';
import { MISTRAL_API_KEY, SUPABASE_URL, SUPABASE_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createClient } from '@supabase/supabase-js';

const mistral = new Mistral({
	apiKey: MISTRAL_API_KEY
});
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

async function init(fetch): any {
	const chunks = await splitDocument('/handbook.txt', fetch);
	if (!chunks) return;

	// Mistral
	const embeddings = await createEmbeddings(chunks);

	// Supabase
	const { error } = await supabase.from('handbook_docs').select('id');
	if (!error) {
		// If the table is empty, populate it
		await supabase.from('handbook_docs').insert(embeddings);
	}

	let triggered = false;

	return {
		getStatus: () => {
			if (!triggered) {
				triggered = true;
				return 'Triggered once';
			}
			return 'Triggered multiple times';
		},
		getEmbeddings: () => embeddings
	};
}

async function splitDocument(path: string, func: any) {
	const response = await func(path);
	const text = await response.text();
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 250,
		chunkOverlap: 40
	});
	const output = await splitter.createDocuments([text]);
	return output.map((doc) => doc.pageContent);
}

async function createEmbedding(chunk: string) {
	const embedding = await mistral.embeddings.create({
		model: 'mistral-embed',
		inputs: [chunk]
	});
	if (!embedding) throw new Error('Could not resolve chunk using Mistral API');
	return embedding.data[0].embedding;
}

async function createEmbeddings(chunks: string[]) {
	/*
        {
            id: "1bc142e8d65c41fda03ab865e0d72c5e",
            object: "list",
            data: [
                {
                    object: "embedding",
                    embedding: [-0.07147216796875, -0.02557373046875, 0.01155853271484375, 0.015960693359375, 0.003314971923828125, 0.005268096923828125, 0.042022705078125, -0.031524658203125, -0.0131988525390625, -0.0135498046875, -0.00844573974609375, 0.06512451171875, 0.01163482666015625, 0.0008182525634765625, -0.049835205078125, 0.061737060546875, 0.006103515625, 0.036651611328125, 0.0020656585693359375, 0.00848388671875, -0.0259552001953125, -0.0218963623046875, -0.044189453125, -0.005054473876953125, 0.0171051025390625, -0.006488800048828125, -0.022796630859375, -0.0653076171875, -0.04547119140625, -0.014190673828125, ...],
                    index: 0
                }
            ],
            model: "mistral-embed",
            usage: {
                prompt_tokens: 29,
                total_tokens: 29,
                completion_tokens: 0
            }
        }
    */
	const embeddings = await mistral.embeddings.create({
		model: 'mistral-embed',
		inputs: chunks
	});
	if (!embeddings) throw new Error('Could not resolve chunks using Mistral API');

	return chunks.map((chunk, i) => {
		return {
			content: chunk,
			embedding: embeddings.data[i].embedding
		};
	});
}

async function retrieveMatches(embedding) {
	// rpc = remote procedure call
	const { data } = await supabase.rpc('match_handbook_docs', {
		query_embedding: embedding,
		match_threshold: 0.78,
		match_count: 5
	});
	return data.map((doc: any) => doc.content).join(' ');
}

async function generateChatResponse(context: string, query: string) {
	const { choices } = await mistral.chat.complete({
		model: 'mistral-small-latest',
		messages: [
			{
				content:
					'Behave like a super smart assistant and provide the best possible response. You get a context provided followed by the question',
				role: 'system'
			},
			// Embedding used for prompt engineering
			{
				content: `Handbook context: ${context} - Question: ${query}`,
				role: 'user'
			}
		],
		temperature: 0.375
	});

	if (choices && choices[0].message) return { data: choices[0].message.content };
	return { error: new Error('Could not generate chat response') };
}

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { content: input } = await request.json();
	if (!input) return new Response('No content provided', { status: 400 });
	await init(fetch);

	const embedding = await createEmbedding(input);
	const context = await retrieveMatches(embedding);
	const { data, error } = await generateChatResponse(context, input);

	if (error) return new Response(error.message, { status: 500 });
	return new Response(JSON.stringify(data), { status: 200 });
};
