import { OrthographicCamera, Scene, WebGLRenderer, type WebGLRendererParameters } from 'three';
import { EAppRenderer } from './enums';
import type { AppRenderer } from './interfaces';
import { APP_FOVE } from './constants';

// App.ts
export function createRenderer(
	rendererParameters: WebGLRendererParameters | undefined
): AppRenderer {
	const renderer = $state(
		new WebGLRenderer({
			powerPreference: EAppRenderer.POWER_PREFERENCE,
			antialias: true,
			alpha: true,
			...rendererParameters
		})
	);

	return {
		get: () => renderer
	};
}

export function createCamera(window: Window) {
	const aspectRatio = window.innerWidth / window.innerHeight;
	const camera = $state(
		new OrthographicCamera(
			-APP_FOVE * aspectRatio,
			APP_FOVE * aspectRatio,
			APP_FOVE,
			-APP_FOVE,
			0.001,
			1000
		)
	);

	return {
		get: () => camera
	};
}

export function createScene() {
	const scene = $state(new Scene());

	return {
		get: () => scene
	};
}
