import { openai, supabase } from "./config.js";
import podcasts from "./content.js";

/** Create embeddings representing the input text */
async function main(content) {
	const data = await Promise.all(
		content.map(async (phrase) => {
			// Retrieve the embeddings for each phrase
			const embeddingResponse = await openai.embeddings.create({
				model: "text-embedding-ada-002",
				input: phrase,
			});

			// Create a new record in the database
			return {
				content: phrase,
				embedding: embeddingResponse.data[0].embedding,
			};
		})
	);
	console.info("Embedding complete!");

	// Insert content and embeddings into the database
	await supabase.from("documents").insert(data);

	console.info("Storing complete!");
}

main(podcasts);
