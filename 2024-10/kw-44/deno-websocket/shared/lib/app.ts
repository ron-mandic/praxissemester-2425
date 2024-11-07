// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.1";
import { createServer } from "node:http";
import { Server } from "npm:socket.io";
import { SOCKET_SERVER_OPTIONS } from "./index.ts";

// Source: https://github.com/denoland/examples/tree/main/with-express
const app = express();

// Source: https://socket.io/get-started/chat#integrating-socketio
const server = createServer(app);
const io = new Server(server, SOCKET_SERVER_OPTIONS);

const Lobby = [
	{
		socketId: null as string | null,
		time: null as number | null,
	},
	{
		socketId: null as string | null,
		time: null as number | null,
	},
];

// Web server
app.get("/", (_req, res) => {
	res.send("Hello World!");
});

// Web socket
io.on("connection", (socket) => {
	console.log(`%cUser connected: ${socket.id}`, "color: blue;");

	socket.on("c:join", (id) => {
		socket.join("Lobby");

		// TODO: Complete the Lobby mechanism
		Lobby[+id] = {
			socketId: socket.id,
			time: Date.now(),
		};

		// Show entire room
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
