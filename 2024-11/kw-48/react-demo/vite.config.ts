import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		preprocessorOptions: {
			scss: {
				// Source: https://vite.dev/config/shared-options.html#css-preprocessoroptions
				api: "modern-compiler",
				importers: [],
			},
		},
	},
});
