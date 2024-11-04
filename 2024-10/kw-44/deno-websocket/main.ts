// see https://github.com/socketio/socket.io-deno?tab=readme-ov-file#with-oak
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { Application, Router } from "jsr:@oak/oak/";

const app = new Application();
const router = new Router();
router.get("/", (context) => {
	context.response.body = "Hello world!";
});
app.use(router.routes());

const io = new Server();
io.on("connection", (socket) => {
	console.log(`socket ${socket.id} connected`);

	socket.emit("hello", "world");

	socket.on("disconnect", (reason) => {
		console.log(`socket ${socket.id} disconnected due to ${reason}`);
	});
});

const handler = io.handler(async (req) => {
	return (await app.handle(req)) || new Response(null, { status: 404 });
});

Deno.serve({ port: 3000 }, (req: Request) => {
	const origin = req.headers.get("origin")! || req.headers.get("referer")!;

	if (origin) {
		const originUrl = new URL(origin);
		const hostname = originUrl.hostname;
		const port = +originUrl.port || 80;
		return handler(req, {
			localAddr: {
				transport: "tcp",
				hostname: "localhost",
				port: 3000,
			},
			remoteAddr: {
				transport: "tcp",
				hostname,
				port,
			},
		});
	}

	// see https://deno.land/std@0.220.1/http/server.ts?s=ConnInfo
	return handler(req, {
		localAddr: {
			transport: "tcp",
			hostname: "localhost",
			port: 3000,
		},
		remoteAddr: {
			transport: "tcp",
			hostname: "localhost",
			port: 3000,
		},
	});
});
