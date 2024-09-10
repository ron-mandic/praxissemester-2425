import { HfInference } from "@huggingface/inference";
import { listModels } from "@huggingface/hub";
import {
	classifyText,
	generateText,
	translateText,
	isModelInferenceEnabled,
} from "./functions.mjs";

const hf = new HfInference(process.env.HF_TOKEN);

/**
 * Text generation (https://huggingface.co/models?pipeline_tag=text-generation&sort=trending)
 * or https://huggingface.co/tasks
 */
// https://huggingface.co/HuggingFaceH4/zephyr-7b-beta
const modelGen = "HuggingFaceH4/zephyr-7b-beta";
const inputsGen = "What is the definition of machine learning inference?";

/**
 * Text classification (https://huggingface.co/models?pipeline_tag=text-classification&sort=trending)
 * or https://huggingface.co/tasks
 */
// https://huggingface.co/SamLowe/roberta-base-go_emotions
const modelClass = "SamLowe/roberta-base-go_emotions";
const inputsClass = "The new movie was great!";

/**
 * Text translation (https://huggingface.co/models?pipeline_tag=translation&sort=trending)
 * or https://huggingface.co/tasks
 */
// https://huggingface.co/facebook/mbart-large-50-many-to-many-mmt
const modelTrans = "facebook/mbart-large-50-many-to-many-mmt";
const inputsTrans = "The quick brown fox jumps over the lazy dog.";
const srcLang = "en_XX";
const tgtLang = "hr_HR";
const parameters = {
	src_lang: srcLang,
	tgt_lang: tgtLang,
};

async function main() {
	// Text generation
	// const result = await generateText(hf, modelTextGen, inputsTextGen);
	// Text classification
	// const result = await classifyText(hf, modelClass, inputsClass);
	// Text translation
	const result = await translateText(hf, modelTrans, inputsTrans, parameters);
	console.log(result);

	const models = [];
	for await (const model of listModels({
		credentials: {
			accessToken: process.env.HF_TOKEN,
		},
		search: {
			task: "text-to-image",
		},
	})) {
		if (model.likes < 2000) {
			continue;
		}

		if (await isModelInferenceEnabled(model.name)) {
			models.push(model);
		}
	}
	models.sort((a, b) => b.likes - a.likes);
	for (const model of models) {
		console.log(
			`${model.likes} Likes: https://huggingface.co/${model.name}`
		);
	}
}

main();
