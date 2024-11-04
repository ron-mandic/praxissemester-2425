// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.1";
import { createServer } from "node:http";
import { Server } from "npm:socket.io";

// Source: https://github.com/denoland/examples/tree/main/with-express
const app = express();

// Source: https://socket.io/get-started/chat#integrating-socketio
const server = createServer(app);
const io = new Server(server);

// Web server
app.get("/", (_req, res) => {
	res.send("Hello World!");
});

// Web socket
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on("disconnect", (reason) => {
		console.log("User disconnected:", reason);
	});
});

export default server;
