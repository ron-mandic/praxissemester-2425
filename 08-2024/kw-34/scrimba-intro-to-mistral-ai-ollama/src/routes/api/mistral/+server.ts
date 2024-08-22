import type { RequestHandler } from '@sveltejs/kit';

const getURL = (content: string, query = 'question') =>
	`http://localhost:3000/?${query}=${encodeURIComponent(content)}`;

type TData = {
	transactionId: string;
	customer_id: string;
	payment_amount: number;
	payment_date: string;
	payment_status: string;
};
const data = [
	{
		transactionId: 'T1001',
		customer_id: 'C001',
		payment_amount: 125.5,
		payment_date: '2021-10-05',
		payment_status: 'Paid'
	},
	{
		transactionId: 'T1002',
		customer_id: 'C002',
		payment_amount: 89.99,
		payment_date: '2021-10-06',
		payment_status: 'Unpaid'
	},
	{
		transactionId: 'T1003',
		customer_id: 'C003',
		payment_amount: 120.0,
		payment_date: '2021-10-07',
		payment_status: 'Paid'
	},
	{
		transactionId: 'T1004',
		customer_id: 'C002',
		payment_amount: 54.3,
		payment_date: '2021-10-05',
		payment_status: 'Paid'
	},
	{
		transactionId: 'T1005',
		customer_id: 'C001',
		payment_amount: 210.2,
		payment_date: '2021-10-08',
		payment_status: 'Pending'
	}
];

function getPaymentDate({ transactionId }: TData) {
	const transaction = data.find((row) => row.transactionId === transactionId);
	if (transaction) {
		return JSON.stringify({ date: transaction.payment_date });
	}
	return JSON.stringify({ error: 'transaction id not found.' });
}

function getPaymentStatus({ transactionId }: TData) {
	const transaction = data.find((row) => row.transactionId === transactionId);
	if (transaction) {
		return JSON.stringify({ status: transaction.payment_status });
	}
	return JSON.stringify({ error: 'transaction id not found.' });
}

const functions: { [key: string]: (args: TData) => string } = {
	getPaymentDate,
	getPaymentStatus
};

export const POST: RequestHandler = async ({ request }) => {
	const { question } = await request.json();
	const url = getURL(question);
	console.log(url);

	const res = await fetch(url);
	const { response } = await res.json();
	const { message } = response;

	if (message.content) {
		return new Response(JSON.stringify({ message }), { status: 200 });
	}

	if (!message.content && message.tool_calls.length > 0) {
		const { name, arguments: args } = message.tool_calls[0].function;
		console.log(message.tool_calls[0]);

		// TODO: Fix this
		const func = functions[name];
		const funcArgs = JSON.parse(args);
		console.log(funcArgs);

		return new Response(JSON.stringify({ data: 'Hello World' }), { status: 200 });

		// const res = await fetch('http://localhost:3000/output', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ output, name })
		// });
		// const data = await res.json();
		// return new Response(JSON.stringify({ data }), { status: 200 });
	}
};
