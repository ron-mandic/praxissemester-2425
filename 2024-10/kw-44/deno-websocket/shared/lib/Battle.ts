import { CHALLENGES, MAX_ROUNDS } from "./index.ts";

const BATTLE_CHALLENG_OFFSET_EXAMPLE = 1;

const Battle = {
	index: 0,
	challenge: null as null | string,
	maxRounds: MAX_ROUNDS <= 9 ? MAX_ROUNDS : 9,
	hasEnded: false,
	"0": {
		name: null as null | string,
		dataURI: null as null | string,
		score: 0,
	},
	"1": {
		name: null as null | string,
		dataURI: null as null | string,
		score: 0,
	},
};

export function resetBattle(all = false) {
	if (all) {
		Battle.hasEnded = false;

		Battle["0"].name = null;
		Battle["0"].score = 0;

		Battle["1"].name = null;
		Battle["1"].score = 0;
	}

	// If all is false, only reset the dataURI
	Battle["0"].dataURI = null;
	Battle["1"].dataURI = null;
}

export function updateBattle(
	id: string,
	cb: (id: string, hasWon: boolean, battle: typeof Battle) => void
) {
	const winner = Battle[id as "0" | "1"];

	// First, update the score of the player for the current round
	winner.score++;

	// Update the stats regardless of the winner
	Battle.index++;
	Battle.challenge = CHALLENGES[Battle.index];

	console.log(`%cEvent: New challenge\n${Battle.challenge}`, "color: gray;");

	// Now track which Batch the game is in
	// TODO: Make it prettier and more readable
	if (
		(Battle.index - BATTLE_CHALLENG_OFFSET_EXAMPLE) % Battle.maxRounds ===
		0
	) {
		console.log(
			`%cEvent: Batch #${
				!(Battle.index - BATTLE_CHALLENG_OFFSET_EXAMPLE)
					? "1"
					: (Battle.index - BATTLE_CHALLENG_OFFSET_EXAMPLE) / 3 + 1
			}`,
			"color: blue;"
		);
	}

	// Check if the game has ended (prematurely)
	const hasWon =
		Battle.maxRounds % 2 == 0
			? winner.score > Battle.maxRounds / 2
			: winner.score >= Math.round(Battle.maxRounds / 2);

	cb(id, hasWon, Battle);
}

export default Battle;
