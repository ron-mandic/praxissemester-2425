export const SERVER_PORT = 8080;
export const SERVER_OPTIONS = {
	port: SERVER_PORT,
	host: "0.0.0.0",
};

export const SOCKET_SERVER_OPTIONS = {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
	allowEIO3: true,
	pingInterval: 10000,
	pingTimeout: 5000,
};

export const CHALLENGES = [
	// Example
	"Sketch a rough, scribbled outline of a quirky chair design",
	// Challenges
	"Place yourself in a Hollywood movie",
	"Create a hybrid of your favorite animal and favorite food",
	"Create a detailed portrait of your opponent",

	"Create the wildest 'Motto Party'",
	"Create your spirit animal",
	"Design a chair",

	"Illustrate your last or craziest dream",
	"How do you imagine AI?",
	"You are a biologist and discover a new species. Describe it!",

	"Place yourself in an underwater motto party",
	"Create a family picture of the AI+D lab team",
	"Create as many copyright infringements as possible!",

	"HfG in a nutshell",
	"Create a logo for your next startup, following the signature HfG style",
	"Design a new product for the smallest target group (including you!)",

	"Design an eco-friendly vacation alternative",
	"I bet DALL-E has no idea what this is!",
	"What does 'Feuerzangenbowle' actually mean?",

	"Recreate the letter 'A' shape without using 'A'!",
	"Invent a new dish",
	"Create a movie poster for a blockbuster",
];
