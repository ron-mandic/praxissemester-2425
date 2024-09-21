import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
];

// https://www.shadcn-svelte.com/docs/installation (flat config format)
// /** @type {import('eslint').Linter.FlatConfig[]} */
// export default [
//   /* ... */
//   {
//     files: ["**/*.svelte"],
//     languageOptions: {
//       parserOptions: {
//         parser: ts.parser,
//       },
//     },
//   },
//   {
//     /* location of your components where you would like to apply these rules  */
//     files: ["**/components/ui/**/*.svelte"],
//     rules: {
//       "@typescript-eslint/no-unused-vars": [
//         "warn",
//         {
//           argsIgnorePattern: "^_",
//           varsIgnorePattern: "^\$\$(Props|Events|Slots|Generic)$",
//         },
//       ],
//     },
//   },
// ];
