import type { Config } from 'tailwindcss';
import tailwindcssTypography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
		tailwindcssTypography,
		// Source: https://tailwindcss.com/docs/adding-custom-styles#writing-plugins
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.debug': {
					outline: '1px solid red'
				}
			});
		})
	]
} as Config;
