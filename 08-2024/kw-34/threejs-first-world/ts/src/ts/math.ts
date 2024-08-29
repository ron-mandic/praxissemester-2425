import { Vector3 } from "three";

export function random(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function getAngle(vecA: Vector3, vecB: Vector3) {
	const dot = vecA.dot(vecB);
	const det = vecA.x * vecB.z - vecA.z * vecB.x;
	return Math.atan2(det, dot);
}
