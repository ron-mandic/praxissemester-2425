// import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";

const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({
	openAIApiKey,
	temperature: 0, // 0 is deterministic thus great for a more knowledge-centered, less daring bot
});
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
const client = createClient(sbUrl, sbApiKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
	client,
	tableName: "documents",
	queryName: "match_documents",
});

const NUMBER_OF_CHUNKS = 4;
const retriever = vectorStore.asRetriever(NUMBER_OF_CHUNKS);

export { retriever };