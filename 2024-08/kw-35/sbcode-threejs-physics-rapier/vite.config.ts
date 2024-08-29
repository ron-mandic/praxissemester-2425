import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	plugins: [wasm(), topLevelAwait()],
	build: {
		rollupOptions: {
			// Credits: https://github.com/dimforge/rapier.js/issues/278#issuecomment-2142536870
			treeshake: false,
		},
	},
});
