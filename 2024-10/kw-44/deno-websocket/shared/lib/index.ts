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
	// Batch #1
	"Place yourself in a Hollywood movie",
	"Create a hybrid of your favorite animal and food",
	"Draw a detailed portrait of your opponent",
	// Batch #2
	"Design the wildest 'Motto Party'",
	"Illustrate your spirit animal",
	"Make my logo bigger!",
	// Batch #3
	"Illustrate your last craziest dream",
	"How do you imagine AI?",
	"You are a biologist and discover a new species. Now describe it!",
	// Batch #4
	"You're a gangster rapper. Design your new album cover!",
	"Create a family photo of the AI+D lab team",
	"It's time to go wild. Make as many copyright infringements as possible!",
	// Batch #5
	"Make America great again!",
	"Create a logo for your brand new startup in HfG style",
	"Design a product for the smallest target group - including you!",
	// Batch #6
	"You are a barista in Berlin. Create new latte art designs",
	"I bet you anything StableDiffusion has no idea what that is!",
	"Meowww! Imagine cats have conquered our world!",
	// Batch #7
	"Redesign HfG as a school for witchcraft and wicked sorcery!",
	"Plain and simple: Invent a new dish",
	"What does Elon Musk's Mars residence look like?",
	// Batch #8
	"HfG in a nutshell. Go!",
	"Design a ridiculously complicated currency for 2050",
	"Create a superhero whose power is bizarre but weirdly useful",
];

export const MAX_ROUNDS = 3;
