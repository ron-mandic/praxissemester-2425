import { CHALLENGES, MAX_ROUNDS } from "./index.ts";
import { resetLobby } from "./Lobby.ts";

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

	// Check if the game has ended (prematurely)
	const hasWon =
		Battle.maxRounds % 2 == 0
			? winner.score > Battle.maxRounds / 2
			: winner.score >= Math.round(Battle.maxRounds / 2);

	cb(id, hasWon, Battle);

	// The battle is still going on
	if (!hasWon) {
		// Reset dataURI regardless of the winner
		resetBattle();
	}

	// The battle is decided
	if (hasWon) {
		Battle.hasEnded = true;

		// Flush the Battle data (name, score)
		resetBattle(true);

		// Reset the Lobby data (name, ready)
		resetLobby();
	}
}

export default Battle;
