/**
 * uuid - Socket ID provided by the server
 * id - PUBLIC_ID provided by the client itself
 */
type LobbyClient = {
	id?: number | number;
	uuid: string | null;
	name?: string;
	ready?: boolean;
	lastSeen: number | null;
};

const Lobby: Record<string, LobbyClient> = {
	"0": {
		id: 0,
		uuid: null,
		name: "",
		ready: false,
		lastSeen: null,
	},
	"1": {
		id: 1,
		uuid: null,
		name: "",
		ready: false,
		lastSeen: null,
	},
	ADMIN: {
		uuid: null,
		lastSeen: null,
	},
	PROJECTOR: {
		uuid: null,
		lastSeen: null,
	},
};

export function resetLobby() {
	Lobby["0"].name = "";
	Lobby["0"].ready = false;
	Lobby["1"].name = "";
	Lobby["1"].ready = false;
}

export function logLobby(message: string, id?: string) {
	if (id) console.log(`%cEvent: ${message} = ${id}`, "color: blue;");
	else console.log(`%cEvent: ${message}`, "color: blue;");

	console.log("%cClient\t\tUUID", "color: gray;");
	for (const key in Lobby) {
		if (key === "PROJECTOR") {
			console.log(`${key}\t${Lobby[key].uuid}`);
		} else {
			console.log(`${key}\t\t${Lobby[key].uuid}`);
		}
	}
	console.log("\n");
}

export default Lobby;
