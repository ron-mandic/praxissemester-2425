import { openai, supabase } from "./config.js";

// User query about podcasts
// const query = "Decoding orca calls";    // Songs of the Sea (1 hr): Dive deep with marine biologists to understand the intricate whale songs echoing in our vast oceans. 0.816175652996512
const query = "What can I listen to in half an hour?"; // The soundscape of silence (30 min): Traverse the globe with sonic explorers to find the world's most serene and silent spots. 0.799330449224047
// Explanation: Contextually completely unrelated, but still semantically similar due to animals
// const query = "Training puppies" // Songs of the Sea (1 hr): Dive deep with marine biologists to understand the intricate whale songs echoing in our vast oceans. 0.747745998539667

main(query);

/*
  Create an embedding from the user input and return a 
  semantically matching text chunk from the database 
*/
async function main(input) {
	// Create a vector embedding representing the input text
	const embeddingResponse = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input,
	});

	// The vector generated by OpenAI
	const embedding = embeddingResponse.data[0].embedding;

	// Query Supabase for nearest vector match
	const { data } = await supabase.rpc("match_documents", {
		query_embedding: embedding,
		match_threshold: 0.5,
		match_count: 1,
	});
	console.log(data[0].content, data[0].similarity);
}
