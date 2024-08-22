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

type TData = {
	transactionId: string;
	customer_id: string;
	payment_amount: number;
	payment_date: string;
	payment_status: string;
};

export function getPaymentDate({ transactionId }: TData) {
	const transaction = data.find((row) => row.transactionId === transactionId);
	if (transaction) {
		return JSON.stringify({ date: transaction.payment_date });
	}
	return JSON.stringify({ error: 'transaction id not found.' });
}

export function getPaymentStatus({ transactionId }: TData) {
	const transaction = data.find((row) => row.transactionId === transactionId);
	if (transaction) {
		return JSON.stringify({ status: transaction.payment_status });
	}
	return JSON.stringify({ error: 'transaction id not found.' });
}

export const functions = {
	getPaymentDate,
	getPaymentStatus
};

export const tools = [
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
