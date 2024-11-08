// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.1";
import { createServer } from "node:http";
import { Server, ServerOptions } from "npm:socket.io";
import { SOCKET_SERVER_OPTIONS } from "./index.ts";

// Source: https://github.com/denoland/examples/tree/main/with-express
const app = express();

// Source: https://socket.io/get-started/chat#integrating-socketio
const server = createServer(app);
const io = new Server(server, SOCKET_SERVER_OPTIONS as Partial<ServerOptions>);

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

// Web server
app.get("/", (_req, res) => {
	res.send("Hello World!");
});

// Web socket
io.on("connection", (socket) => {
	console.log(`%cUser connected: ${socket.id}`, "color: blue;");

	socket.on("c:join", (id) => {
		socket.join("Lobby");

		if (Number.isNaN(id)) {
			switch (id) {
				case "ADMIN":
					Lobby.ADMIN.uuid = socket.id;
					Lobby.ADMIN.lastSeen = Date.now();
					break;
				case "PROJECTOR":
					Lobby.PROJECTOR.uuid = socket.id;
					Lobby.PROJECTOR.lastSeen = Date.now();
					break;
			}
		} else {
			// Initialize user by assigning both UUID and ID
			Lobby[id].uuid = socket.id;
			Lobby[id].lastSeen = Date.now();
		}

		// Show entire room
		const lobby = io.sockets.adapter.rooms.get("Lobby");
		console.log(Array.from(lobby!));
		console.log(Lobby);
	});

	socket.on("c:updateLobby", ({ id, name, ready }) => {
		Lobby[+id].name = name;
		Lobby[+id].ready = ready;
		Lobby[+id].lastSeen = Date.now();

		const lobby = io.sockets.adapter.rooms.get("Lobby");
		console.log(lobby);
		console.log(Lobby);
	});

	socket.on("disconnect", (reason) => {
		console.log(
			`%cUser ${socket.id} disconnected: ${reason}\n`,
			"color: red;"
		);
	});
});

export default server;
