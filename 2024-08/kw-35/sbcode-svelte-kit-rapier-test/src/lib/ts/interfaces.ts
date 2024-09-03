import { OrthographicCamera, WebGLRenderer, Scene } from 'three';

// App.ts
interface AppRenderer {
	get: () => WebGLRenderer;
}
interface AppCamera {
	get: () => OrthographicCamera;
}
interface AppScene {
	get: () => Scene;
}

export type { AppRenderer, AppCamera, AppScene };
