import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/handbook.txt');
	const text = await response.text();
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 250,
		chunkOverlap: 40
	});
	const output = await splitter.createDocuments([text]);

	return {
		text,
		output
	};
};
