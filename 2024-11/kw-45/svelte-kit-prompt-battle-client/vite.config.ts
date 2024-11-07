import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	server: {
		port: 1405,
		strictPort: true
	},
	plugins: [sveltekit()],
	// Source: https://stackoverflow.com/a/79003101
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
