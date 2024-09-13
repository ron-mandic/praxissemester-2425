/**
 * User input: I am a complete beginner and really nervous. Is Scrimba for me?
 * Standalone question: Is Scrimba suitable for complete beginners?
 *
 * Response with standalone question:
 * Yes, Scrimba is suitable for complete beginners.
 *
 * Response with original user input:
 * Yes, Scrimba is perfect for you! We are a friendly community so don't be nervous
 *
 * As you can see, the standalone question might not be suitable for generating
 * the final response as it might not contain all the necessary information that
 * might satisfy the user. However, it is useful for retrieving the semantic
 * information from the vector store only!
 */

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { retriever } from "./js/retriever";

document.addEventListener("submit", (e) => {
	e.preventDefault();
	progressConversation();
});

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const standaloneQuestionTemplate =
	"Given a question, convert it to a standalone question. question: {question} standalone question:";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
	standaloneQuestionTemplate
);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer:
`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

/**
 * Challenge:
 * 1. Create a template and prompt to get an answer to
 *    the user's original question. Remember to include
 *    the original question and the text chunks we got
 *    back from the vector store as input variables. Call
 *    these input variables 'question' and 'context'.
 * ⚠️ Feel free to add this to the chain, but you will get
 *    an error.
 * 
 *    "Error: Missing value for input context" with "combineDocuments"
 *
 * We want this chatbot to:
 *  - be friendly
 *  - only answer from the context provided and never make up
 *    answers
 *  - apologise if it doesn't know the answer and advise the
 *    user to email help@scrimba.com
 */

const chain = standaloneQuestionPrompt
	.pipe(llm)
	.pipe(new StringOutputParser())
	.pipe(retriever)
	.pipe(answerPrompt);

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
