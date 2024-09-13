import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { retriever } from "./js/retriever";
import { combineDocuments } from "./js/combineDocuments";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "langchain/schema/runnable";

document.addEventListener("submit", (e) => {
	e.preventDefault();
	progressConversation();
});

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

// Standalone Question
const templateSQ =
		"Given a question, convert it to a standalone question. question: {question} standalone question:",
	promptSQ = PromptTemplate.fromTemplate(templateSQ);

// Answer
const templateA = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer: `,
	promptA = PromptTemplate.fromTemplate(templateA);

// Chain for standalone question
const chainSQ = promptSQ.pipe(llm).pipe(new StringOutputParser());

// Chain for retriever
const chainR = RunnableSequence.from([
	(prevResult) => prevResult.standalone_question,
	retriever,
	combineDocuments,
]);

// Chain for answer
const chainA = promptA.pipe(llm).pipe(new StringOutputParser());

const __chain__ = RunnableSequence.from([
	{
		standalone_question: chainSQ,
		original_input: new RunnablePassthrough(),
	},
	{
		context: chainR,
		question: ({ original_input }) => original_input.question,
	},
	chainA,
]);

const response = await __chain__.invoke({
	question:
		"What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});

console.log(response); // Scrimba is designed to be lightweight and can be used on low-spec PCs, so your old laptop should work just fine!

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
