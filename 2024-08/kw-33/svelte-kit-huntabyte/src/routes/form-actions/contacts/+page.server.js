import { fail, redirect } from '@sveltejs/kit';

let contacts = [
	{
		id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
		name: 'Saul Goodman',
		email: 'saul@example.com',
		company: 'Saul Goodman & Associates',
		job: 'Attorney'
	}
];

export const load = async () => {
	return { contacts };
};

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const company = formData.get('company');
		const job = formData.get('job');
		const id = crypto.randomUUID();

		if (name.length < 2) {
			return fail(400, {
				error: true,
				message: 'Name must be at least 2 characters long',
				name,
				email,
				company,
				job
			});
		}

		const contact = { id, name, email, company, job };

		contacts.push(contact);

		throw redirect(303, '/form-actions');
		// return {
		// 	success: true
		// };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		contacts = contacts.filter((contact) => contact.id !== id);

		return {
			success: true
		};
	}
};
