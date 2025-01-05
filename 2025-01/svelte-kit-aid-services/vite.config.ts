import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true
	},
	// Source: https://vite.dev/config/shared-options.html#css-preprocessoroptions
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				importers: []
			}
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
