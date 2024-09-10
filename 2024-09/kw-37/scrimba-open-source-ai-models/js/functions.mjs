async function generateText(hf, model, inputs) {
	return hf.textGeneration({ inputs, model });
}

async function classifyText(hf, model, inputs) {
	return hf.textClassification({ inputs, model });
}

async function translateText(hf, model, inputs, parameters) {
	return hf.translation({ inputs, model, parameters });
}

async function isModelInferenceEnabled(modelName) {
	const response = await fetch(
		`https://api-inference.huggingface.co/status/${modelName}`
	);
	const data = await response.json();
	return data.state == "Loadable";
}

export { generateText, classifyText, translateText, isModelInferenceEnabled };
