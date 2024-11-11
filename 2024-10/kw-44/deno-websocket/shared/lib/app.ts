// @deno-types="npm:@types/express@5.0.0"
import express, { Request, Response } from "npm:express@4.21.1";
import { Buffer } from "node:buffer";
import Battle from "./Battle.ts";

// Source: https://github.com/denoland/examples/tree/main/with-express
const app = express();

// Web server
app.get("/", (_req: Request, res: Response) => {
	res.send("Hello, World!");
});

app.get("/image/:id", (req: Request, res: Response) => {
	const id = req.params.id as string;

	// Überprüfen, ob die ID "0" oder "1" ist
	if (id !== "0" && id !== "1") {
		return res.status(400).send("Deno: Invalid ID");
	}

	// Überprüfen, ob das dataURI für die angegebene ID vorhanden ist
	const dataURI = Battle[id]?.dataURI;
	if (!dataURI) {
		return res.status(404).send("Deno: Image not found");
	}

	// Extrahiere den Base64-Teil aus dem DataURI
	const base64Image = dataURI.split(";base64,").pop();
	const imgBuffer = Buffer.from(base64Image || "", "base64");

	// Sende das Bild als Antwort mit dem richtigen Content-Type
	res.writeHead(200, {
		"Content-Type": "image/png",
		"Content-Length": imgBuffer.length,
	});
	res.end(imgBuffer);
});

export default app;
