import { Vector3 } from "three";
import { MATH_LERP_EPSILON, WORLD_COORDINATE_CONVERSION } from "./constants";

export function random(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function ptToM(
	metricCoords: number[],
	factor = WORLD_COORDINATE_CONVERSION
) {
	return metricCoords.map((coord) => coord * factor);
}

export function lerp(from: number, to: number, speed: number) {
	const amount = (1 - speed) * from + speed * to;
	return Math.abs(from - to) < MATH_LERP_EPSILON ? to : amount;
}

export function getAngle(vecA: Vector3, vecB: Vector3) {
	const dot = vecA.dot(vecB);
	const det = vecA.x * vecB.z - vecA.z * vecB.x;
	return Math.atan2(det, dot);
}
