/**
 * 1. Get user input
 * 2. Pre-process the input
 * 		a. Store it in a conversation memory
 * 		b. Create a standalone question
 * 3. Create embeddings for the question
 * 4. Perform the nearest search algorithm to find contextual information
 * 5. Use LLM to generate a response with the context
 * 	a. Nearest match from the vector store
 * 		b. User input
 * 		c. Conversation memory
 * 6. Store the response in the conversation memory
 * 7. Output the response and ask for more input
 */

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const openAIApiKey = process.env.OPENAI_API_KEY;
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL;

const client = createClient(sbUrl, sbApiKey);

try {
	const result = await fetch("scrimba-info.txt");
	const text = await result.text();

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 500,
		separators: ["\n\n", "\n", " ", "", "##"], // default setting
		chunkOverlap: 50,
	});

	const output = await splitter.createDocuments([text]);
	const sbDetails = {
		client,
		tableName: "documents", // has to exist before running this script
	};

	await SupabaseVectorStore.fromDocuments(
		output,
		new OpenAIEmbeddings({ openAIApiKey }),
		sbDetails
	);
} catch (err) {
	console.log(err);
}
