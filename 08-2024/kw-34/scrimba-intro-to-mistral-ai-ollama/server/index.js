import ollama from 'ollama';
import express from 'express';

const app = express();
const port = 3000;

const tools = [
	{
		type: 'function',
		function: {
			name: 'getPaymentStatus',
			description: 'Get payment status of a transaction',
			parameters: {
				type: 'object',
				properties: {
					transactionId: {
						type: 'string',
						description: 'The transaction id.'
					}
				},
				required: ['transactionId']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'getPaymentDate',
			description: 'Get the payment date of a transaction',
			parameters: {
				type: 'object',
				properties: {
					transactionId: {
						type: 'string',
						description: 'The transaction id.'
					}
				},
				required: ['transactionId']
			}
		}
	}
];
const messages = [
	{
		role: 'system',
		content:
			'You are a chatbot that been highly optimized for function calling. If the user has specific questions, please provide necessary tool calls to help the user get the answer.'
	}
];

app.get('/', async (req, res) => {
	const question = req.query.question;
	// User enters prompt like "When was the transaction T1001 paid?"
	if (question) {
		messages.push({ content: question, role: 'user' });

		const response = await ollama.chat({
			model: 'mistral',
			messages,
			tools
		});
		res.json({ response });
		return;
	}
});

app.get('/output', async (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
