import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// LangChain text splitter
async function splitDocument(path) {
	const response = await fetch(path);
	const text = await response.text();

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 150,
		chunkOverlap: 15,
	});
	const output = await splitter.createDocuments([text]);
	console.log(output);
}

splitDocument("podcasts.txt");
