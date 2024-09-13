import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import {
	RunnableSequence,
	RunnablePassthrough,
} from "langchain/schema/runnable";

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const punctuationTemplate = `Given a sentence, add punctuation where needed. 
    sentence: {sentence}
    sentence with punctuation:  
    `;
const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentence correct the grammar.
    sentence: {punctuated_sentence}
    sentence with correct grammar: 
    `;
const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

// Take 1
// const chain = RunnableSequence.from([
// 	punctuationPrompt,
// 	llm,
// 	new StringOutputParser(),
// 	{ punctuated_sentence: (prevResult) => prevResult }, // provide the punctuated sentence to the next step
// 	grammarPrompt,
// 	llm,
// 	new StringOutputParser(),
// ]);

const translationTemplate = `Given a sentence, translate that sentence into {language}
    sentence: {grammatically_correct_sentence}
    translated sentence:
    `;
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

const punctuationChain = RunnableSequence.from([
	punctuationPrompt,
	llm,
	new StringOutputParser(),
]);
const grammarChain = RunnableSequence.from([
	grammarPrompt,
	llm,
	new StringOutputParser(),
]);
const translationChain = RunnableSequence.from([
	translationPrompt,
	llm,
	new StringOutputParser(),
]);

// Take 2 using multiple sequences
// const chain = RunnableSequence.from([
// 	{ punctuated_sentence: punctuationChain },
// 	grammarChain,
// 	translationChain,
// ]);

console.log(response); // "Error: Missing value for input language" instead of "Je n'aime pas les lundis"

// Take 3 using Passthrough

const chain = RunnableSequence.from([
	{
		punctuated_sentence: punctuationChain,
		original_input: new RunnablePassthrough(),
	},
	{
		grammatically_correct_sentence: grammarChain,
		language: ({ original_input }) => original_input.language,
	},
	// now, language is passed down the chain to the translation step
	translationChain,
]);

const response = await chain.invoke({
	sentence: "i dont liked mondays",
	language: "french",
});

console.log(response); // finally "Je n'aime pas les lundis"
