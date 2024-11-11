import { createServer } from "node:http";
import { Server, ServerOptions } from "npm:socket.io";
import { CHALLENGES, SOCKET_SERVER_OPTIONS } from "./index.ts";
import app from "./app.ts";
import Lobby from "./Lobby.ts";
import Battle, { updateBattle } from "./Battle.ts";

// Source: https://socket.io/get-started/chat#integrating-socketio
const server = createServer(app);
const io = new Server(server, SOCKET_SERVER_OPTIONS as Partial<ServerOptions>);

// Web socket
io.on("connection", (socket) => {
	console.log(`%cUser connected: ${socket.id}`, "color: blue;");

	socket.on("c:joinLobby", (id: string) => {
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

	socket.on("c:updateLobby", ({ id, name }) => {
		if (Lobby[id]) {
			Lobby[id].name = name;
			Lobby[id].ready = true;
			Lobby[id].lastSeen = Date.now();
		}

		// const lobby = io.sockets.adapter.rooms.get("Lobby");
		// console.log(lobby);
		console.log(Lobby);

		// Transmit the readiness of the player
		if (Lobby[id].ready) io.emit("s:setPlayerReadiness", id);

		// Prepare the battle names
		if (Lobby["0"].name) Battle["0"].name = Lobby["0"].name!;
		if (Lobby["1"].name) Battle["1"].name = Lobby["1"].name!;

		// Start the game if both players are ready
		if (Lobby["0"].ready && Lobby["1"].ready) {
			io.emit("s:start");
		}
	});

	socket.on("c:setPlayerName", ({ id, name }) => {
		if (Lobby[id]) {
			Lobby[id].name = name;
		}
		io.emit("s:setPlayerNames", {
			player0: Lobby[0].name,
			player1: Lobby[1].name,
		});
	});

	socket.on("a:setMode", (mode: string) => {
		io.emit("s:setMode", mode);
	});

	socket.on("c:sendPrompt", (obj: { id: string; value: string }) => {
		io.emit("s:sendPrompt", obj);
	});

	socket.on("acp:getBattleData", () => {
		// First initialize the challenge if it's not already set
		if (Battle.challenge === null || !Battle.index) {
			Battle.challenge = CHALLENGES[Battle.index];
		}

		io.emit("s:getBattleData", Battle);
	});

	socket.on("c:sendRoute/prompt", (mode: string) => {
		io.emit("s:sendRoute/prompt", mode);
	});

	socket.on("c:sendRoute/scribble", () => {
		io.emit("s:sendRoute/scribble");
	});

	socket.on(
		"c:sendCanvasData",
		(obj: {
			id: string;
			data: { x1: number; y1: number; x2: number; y2: number }[];
		}) => {
			io.emit("s:sendCanvasData", obj);
		}
	);

	// Image data for admin
	socket.on("c:sendImage/pchoose", (obj: { id: string; index: number }) => {
		io.emit("s:sendImage/pchoose", obj);
	});

	// Image data for projector
	socket.on("c:sendImage/results", (obj: { id: string; dataURI: string }) => {
		// Save the dataURI to the respective player
		if (obj.id == "0" || obj.id == "1") {
			Battle[obj.id].dataURI = obj.dataURI;
		}

		io.emit("s:sendImage/results", obj);
	});

	// Image data for projector
	socket.on("a:updateBattle", (id: string) => {
		updateBattle(
			id,
			(id: string, hasWon: boolean, battle: typeof Battle) => {
				// Direct message to the results pages of the other clients and to itself (admin)
				io.emit("s:updateBattle", {
					id,
					hasWon,
					player0: {
						name: battle["0"].name,
						score: battle["0"].score,
					},
					player1: {
						name: battle["1"].name,
						score: battle["1"].score,
					},
				});
			}
		);
	});

	socket.on("disconnect", (reason: string) => {
		console.log(
			`%cUser ${socket.id} disconnected: ${reason}\n`,
			"color: red;"
		);

		for (const id in Lobby) {
			if (Lobby[id].uuid === socket.id) {
				Lobby[id].uuid = null;
				Lobby[id].lastSeen = Date.now();
				if (id !== "ADMIN" && id !== "PROJECTOR") {
					Lobby[id].name = "";
					Lobby[id].ready = false;
				}
			}
		}

		console.log(Lobby);
	});
});

export default server;
