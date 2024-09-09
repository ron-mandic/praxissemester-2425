import { RAPIER_WORLD_BODY } from "./types";

// Vaccum cleaner robot
export const PLAYER_WIDTH = 0.32; // m
export const PLAYER_HEIGHT = 0.093; // m
export const PLAYER_HEIGHT_OFFSET = 0.25; // m (0.015)
export const PLAYER_DEPTH = 0.32; // m
export const PLAYER_WEIGHT = 3; // kg
export const PLAYER_RESTITUTION = 1.1;
export const PLAYER_FRICTION = 0.75;
export const PLAYER_SPEED = 0.375; // m/s
export const PLAYER_SPEED_MAX = 1.25;

// const VELOCITY_MIN = 0.2; // m/s
// const VELOCITY_MAX = 0.5; // m/s

// const ANGULAR_VELOCITY_MIN = 0.5; // rad/s
// const ANGULAR_VELOCITY_MAX = 1.5; // rad/s

export const SPRITES = [
	"/images/png/sprite-table-football.png",
	"/images/png/sprite-trash.png",
	"/images/png/sprite-plant.png",
	"/images/png/sprite-armchair.png",
	"/images/png/sprite-couch.png",
	"/images/png/sprite-table-bottle-mug.png",
	"/images/png/sprite-shelf-full.png",
	"/images/png/sprite-shelf-empty.png",
	"/images/png/sprite-stairs-left-person-mug.png",
];
export const RAPIER_WORLD_GRAVITY = 9.80665; // m/s^2
export const RAPIER_WORLD_FRAME_RATE = 1 / 60; // s/frame
export const RAPIER_WORLD_Y_OFFSET = 0.0155; // m

/**
 * @see https://sbcode.net/threejs/physics-rapier-impulsejoint-motors/#rapier-collision-group-calculator
 *
 * player
 * 		membership: 0, filter: [1, 2]
 * floor
 * 		membership: 1, filter: [0]
 * obstacles
 * 		membership: 2, filter: [0]
 */
export const RAPIER_WORLD_BODIES: RAPIER_WORLD_BODY[] = [
	{
		type: "fixed",
		collisionGroups: 131073,
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
		collisionGroups: 65542,
		translation: {
			x: 0.5,
			y: PLAYER_HEIGHT / 2 + PLAYER_HEIGHT_OFFSET,
			z: -0.75,
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
	// TODO: Add more obstacles e.g. sprite-trash, sprite-plant, ...
	// {
	// 	type: "fixed",
	// 	collisionGroups: 131073,
	// 	translation: {
	// 		x: 1.2541666666666667,
	// 		y: 0.15625 + RAPIER_WORLD_Y_OFFSET,
	// 		z: -1.225,
	// 	},
	// 	shape: "cylinder",
	// 	sizes: {
	// 		halfHeight: 0.3125 / 2,
	// 		radius: (0.24444444444444446 / 2) * 1.125,
	// 	},
	// },
];
export const RAPIER_WORLD_SPRITES: any[] = [
	{
		mesh: {
			o: {
				x: 4.7 / 72,
				z: -13.3 / 72,
			},
			x: -39.1 / 72,
			y: 36.1 / 72,
			z: -67.2 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-table-football.png",
			width: 92.1 / 72,
			height: 89.1 / 72,
			offsetX: 7 / 72,
			offsetZ: -7 / 72,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: 98 / 72, // 99.1
				z: -30 / 72, // -79.4
			},
			x: -17.6 / 72,
			y: 22.5 / 72,
			z: -17.6 / 72,
			type: "cylinder",
		},
		plane: {
			path: "/images/png/sprite-trash.png",
			width: 25.1 / 72,
			height: 36.1 / 72,
			offsetX: -2.5 / 72,
			offsetZ: -2.5 / 72,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: 88 / 72,
				z: 105.9 / 72,
			},
			x: -11.4 / 72,
			y: 12.1 / 72,
			z: -11.41 / 72,
			type: "cylinder",
		},
		plane: {
			path: "/images/png/sprite-plant.png",
			width: 54.3 / 72,
			height: 65.7 / 72,
			offsetX: 2.25 / 72,
			offsetZ: -5.5 / 72,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: 43.4 / 72,
				z: 105.9 / 72,
			},
			x: -41.7 / 72,
			y: 29.5 / 72,
			z: -35.3 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-armchair.png",
			width: 67.2 / 72,
			height: 57.4 / 72,
			offsetX: -3.5 / 72,
			offsetZ: 1 / 72,
			scaleX: 0.7875,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: -49.7 / 72,
				z: 105 / 72,
			},
			x: -53.2 / 72,
			y: 33.1 / 72,
			z: -78.1 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-couch.png",
			width: 96 / 72,
			height: 95.7 / 72,
			offsetX: 1 / 72,
			offsetZ: -2 / 72,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: -21 / 72,
				z: 62.9 / 72,
			},
			x: -29.3 / 72,
			y: 19.6 / 72,
			z: -29.3 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-table-bottle-mug.png",
			width: 50.5 / 72,
			height: 48.4 / 72,
			offsetX: -5.25 / 72,
			offsetZ: -6.25 / 72,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: -82.9 / 72,
				z: -7.9 / 72,
			},
			x: -19.6 / 72,
			y: 99 / 72,
			z: -44.6 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-shelf-full.png",
			width: 54.6 / 72,
			height: 129.7 / 72,
			offsetX: 5 / 72,
			offsetZ: -5 / 72,
			scaleX: 0.875,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: -84 / 72,
				z: -53.7 / 72,
			},
			x: -19.6 / 72,
			y: 99 / 72,
			z: -44.6 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-shelf-empty.png",
			width: 53.1 / 72,
			height: 128.7 / 72,
			offsetX: 6 / 72,
			offsetZ: -7 / 72,
			scaleX: 0.875,
		},
		bodies: [],
	},
	{
		mesh: {
			o: {
				x: 70 / 72, // 75
				z: -92.8 / 72, // -92.8
			},
			x: -70 / 72,
			y: 141.1 / 72,
			z: -131.6 / 72,
			type: "box",
		},
		plane: {
			path: "/images/png/sprite-stairs-left-person-mug.png",
			width: 174.7 / 72,
			height: 206.6 / 72,
			offsetX: 17 / 72, // 18
			offsetZ: -17 / 72, // -20
		},
		bodies: [],
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
