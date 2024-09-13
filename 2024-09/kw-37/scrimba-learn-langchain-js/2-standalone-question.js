/**
 * What is a standalone question?
 *
 * A standalone question is a question that is not part of a conversation.
 * It is a question that is asked without any context. It is therefore just
 * a question reducedd to the minimum amount of information needed to get
 * to express the request for information.
 *
 * Remember: It just needs to be created for being able to retreive information
 * from the vector store. The original question is later used to provide the
 * the ultimate response using the LLM.
 *
 * e.g. "polluted" question:
 * I am thinking of buying one of your shirts but I need to know what your
 * returns policy is as some shirts I have bought online have been too small.
 * I just do not want to waste my money on something that I cannot wear.
 *
 * Hence, extract the semantic meaning of the question and ignore the rest.
 * "I need to know what your returns policy is." aka "What is your returns
 * policy?"
 */

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

document.addEventListener("submit", (e) => {
	e.preventDefault();
	progressConversation();
});

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

/**
 * Challenge:
 * 1. Create a prompt to turn a user's question into a
 *    standalone question. (Hint: the AI understands
 *    the concept of a standalone question. You don't
 *    need to explain it, just ask for it.)
 * 2. Create a chain with the prompt and the model.
 * 3. Invoke the chain remembering to pass in a question.
 * 4. Log out the response.
 * **/

// A string holding the phrasing of the prompt
const standaloneQuestionTemplate =
	"Given a question, convert it to a standalone question. question: {question} standalone question:";

/*
{
  lc: 1,
  type: "constructor",
  id: ["langchain", "prompts", "prompt", "PromptTemplate"],
  kwargs: {
    input_variables: ["question"],
    template_format: "f-string",
    template:
      "Given a question, convert it to a standalone question. question: {question} standalone question:",
    partial_variables: undefined,
  },
};
*/
// A prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
	standaloneQuestionTemplate
);

// Take the standaloneQuestionPrompt and PIPE the model
const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

// Await the response when you INVOKE the chain.
// Remember to pass in a question.
const response = await standaloneQuestionChain.invoke({
	question:
		"What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});

/*
{lc: 1, type: 'constructor', id: ['langchain', 'schema', 'AIMessage'], kwargs: {content: 'Can a very old laptop
meet the technical requirements for running Scrimba?', additional_kwargs: {function_call: undefined}}}
*/
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

const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);
