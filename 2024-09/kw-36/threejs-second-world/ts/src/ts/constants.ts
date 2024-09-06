import { RAPIER_WORLD_BODY } from "./types";

// Vaccum cleaner robot
export const PLAYER_WIDTH = 0.32; // m
export const PLAYER_HEIGHT = 0.093; // m
export const PLAYER_HEIGHT_OFFSET = 0.5; // m (0.015)
export const PLAYER_DEPTH = 0.32; // m
export const PLAYER_WEIGHT = 3; // kg
export const PLAYER_RESTITUTION = 1.1;
export const PLAYER_FRICTION = 0.5;

// const VELOCITY_MIN = 0.2; // m/s
// const VELOCITY_MAX = 0.5; // m/s

// const ANGULAR_VELOCITY_MIN = 0.5; // rad/s
// const ANGULAR_VELOCITY_MAX = 1.5; // rad/s

export const RAPIER_WORLD_GRAVITY = 9.80665; // m/s^2
export const RAPIER_WORLD_Y_OFFSET = 0.0155; // m
export const RAPIER_WORLD_BODIES: RAPIER_WORLD_BODY[] = [
	{
		type: "fixed",
		translation: {
			x: 0,
			y: -0.05694 / 2 + RAPIER_WORLD_Y_OFFSET,
			z: 0,
		},
		shape: "cuboid",
		sizes: {
			hx: 1.5,
			hy: 0.05694 / 2,
			hz: 1.5,
		},
	},
	{
		type: "dynamic",
		translation: {
			x: 0,
			y: PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET,
			z: 0,
		},
		shape: "cylinder",
		sizes: {
			halfHeight: PLAYER_HEIGHT / 2,
			radius: PLAYER_WIDTH / 2,
		},
		mass: PLAYER_WEIGHT,
		friction: PLAYER_FRICTION,
		restitution: PLAYER_RESTITUTION,
		getObject: (child) => child.children[0]?.name === "Robot",
	},
];

export const MATH_LERP_EPSILON = 0.001;

export const WORLD_COORDINATE_CONVERSION = 1 / 72;
export const WORLD_CAMERA_FOVE = 1.75;
export const WORLD_CUBE_TEXTURE_IMAGES = [
	"px.png",
	"nx.png",
	"py.png",
	"ny.png",
	"pz.png",
	"nz.png",
];

export const KEYS = [
	// WASD
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
];
