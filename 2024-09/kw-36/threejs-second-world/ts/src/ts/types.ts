import { Group, Object3D, Object3DEventMap } from "three";

export type RAPIER = typeof import("@dimforge/rapier3d-compat").default;
export type RAPIER_WORLD_BODY = {
	type: "dynamic" | "fixed";
	name?: string;
	translation: {
		x: number;
		y: number;
		z: number;
	};
	shape: "cuboid" | "cylinder";
	sizes:
		| {
				hx: number;
				hy: number;
				hz: number;
		  }
		| {
				halfHeight: number;
				radius: number;
		  };
	mass?: number;
	restitution?: number;
	getObject?: (
		scene: Object3D
	) => Object3D | Group<Object3DEventMap> | unknown;
};
