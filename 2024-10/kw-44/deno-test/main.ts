/// <reference lib="deno.ns" />

// Importing a Node.js native module
import * as os from "node:os";
console.log(os.cpus());

// Using a npm module (no npm install needed)
import * as emoji from "npm:node-emoji";
console.log(emoji.emojify(`:sauropod: :heart: npm`));

// Using a npm module (using deno.json)
import chalk from "chalk";
console.log(chalk.yellow("Hello world"));

export function add(a: number, b: number): number {
	return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	console.log(Deno);
	console.log("Add 2 + 3 =", add(2, 3));
}
