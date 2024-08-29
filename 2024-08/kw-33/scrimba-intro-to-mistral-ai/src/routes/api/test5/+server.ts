import { Mistral } from '@mistralai/mistralai';
import { MISTRAL_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const mistral = new Mistral({
	apiKey: MISTRAL_API_KEY
});

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

export const GET: RequestHandler = async ({ fetch }) => {
	const chunks = await splitDocument('/handbook.txt', fetch);
	if (!chunks) return new Response('Could not split document', { status: 500 });

	const embeddings = await createEmbeddings(chunks);
	if (!embeddings) return new Response('Could not create embeddings', { status: 500 });

	return new Response(JSON.stringify({ embeddings }));
};
