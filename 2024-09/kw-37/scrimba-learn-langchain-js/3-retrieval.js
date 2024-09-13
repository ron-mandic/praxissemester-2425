import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { StringOutputParser } from "langchain/schema/output_parser";

document.addEventListener("submit", (e) => {
	e.preventDefault();
	progressConversation();
});

const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
const client = createClient(sbUrl, sbApiKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
	client,
	tableName: "documents",
	queryName: "match_documents",
});

const retriever = vectorStore.asRetriever();

const llm = new ChatOpenAI({ openAIApiKey });

const standaloneQuestionTemplate =
	"Given a question, convert it to a standalone question. question: {question} standalone question:";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
	standaloneQuestionTemplate
);

const chain = standaloneQuestionPrompt
	.pipe(llm)
	/*
        without .pipe(new StringOutputParser())
        {lc: 1, type: 'constructor', id: ['langchain', 'schema', 'AIMessage'], kwargs: {content: 'Can Scrimba be run on a very old, less powerful laptop?', additional_kwargs: {function_call: undefined}}}
        That would lead to an error (e.replace is not a function)
            
        with parser
        What are the technical requirements for running Scrimba on a low-powered, old laptop?
        That would be fine for the pipeline
    */
	.pipe(new StringOutputParser())
	.pipe(retriever);

const response = await chain.invoke({
	question:
		"What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});

console.log(response);

async function progressConversation() {
	const userInput = document.getElementById("user-input");
	const chatbotConversation = document.getElementById(
		"chatbot-conversation-container"
	);
	const question = userInput.value;
	userInput.value = "";

	// add human message
	const newHumanSpeechBubble = document.createElement("div");
	newHumanSpeechBubble.classList.add("speech", "speech-human");
	chatbotConversation.appendChild(newHumanSpeechBubble);
	newHumanSpeechBubble.textContent = question;
	chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

	// add AI message
	const newAiSpeechBubble = document.createElement("div");
	newAiSpeechBubble.classList.add("speech", "speech-ai");
	chatbotConversation.appendChild(newAiSpeechBubble);
	newAiSpeechBubble.textContent = result;
	chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
