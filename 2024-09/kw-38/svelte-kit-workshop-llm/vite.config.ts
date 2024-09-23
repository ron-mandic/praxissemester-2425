import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	css: {
		preprocessorOptions: {
			scss: {
				// https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
				// https://vitejs.dev/config/shared-options.html#css-preprocessoroptions
				api: 'modern-compiler',
				importers: [
					// ...
				]
			}
		}
	}
});
