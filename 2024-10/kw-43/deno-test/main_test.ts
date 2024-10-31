import { assertEquals } from "@std/assert";
import { expect } from "jsr:@std/expect"; // "jest-like" alternative to assertEquals
import { delay } from "jsr:@std/async";
import { describe, it } from "jsr:@std/testing/bdd";
import { add } from "./main.ts";

// https://jsr.io/@std/testing/doc/bdd
describe("add function", () => {
	it("adds two numbers correctly", () => {
		const result = add(2, 3);
		expect(result).toBe(5);
	});

	it("handles negative numbers", () => {
		const result = add(-2, -3);
		expect(result).toBe(-5);
	});
});

Deno.test(function addTest() {
	assertEquals(add(2, 3), 5);
});

Deno.test("async test", async () => {
	const x = 1 + 2;
	await delay(100);
	assertEquals(x, 3);
});

Deno.test({
	name: "read file test",
	permissions: { read: true },
	fn: () => {
		const data = Deno.readTextFileSync("./static/file.txt");
		assertEquals(data, "Hello World");
	},
});

Deno.test({
	name: "do macOS feature",
	ignore: Deno.build.os !== "darwin", // This test will be ignored if not running on macOS
	fn() {
		// do MacOS feature here
	},
});

// Deno.test.ignore("my test", () => {
// 	// your test code
// });

Deno.test({
	name: "Focus on this test only",
	only: true, // Only this test will run
	fn() {
		// test complicated stuff here
	},
});

// Deno.test.only("my test", () => {
// 	// some test code
// });

// https://docs.deno.com/runtime/fundamentals/testing/#resource-sanitizer
Deno.test({
	name: "leaky resource test",
	async fn() {
		await Deno.open("./static/file.txt");
	},
	sanitizeResources: false,
});

Deno.test({
	name: "async operation test",
	async fn() {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	},
});

Deno.test({
	name: "leaky operation test",
	fn() {
		crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode("a".repeat(100000000))
		);
	},
	sanitizeOps: false,
});

// https://docs.deno.com/runtime/fundamentals/testing/#exit-sanitizer
Deno.test({
	name: "false success",
	fn() {
		Deno.exit(0);
	},
	sanitizeExit: false,
});

// This test never runs, because the process exits during "false success" test
Deno.test({
	name: "failing test",
	fn() {
		throw new Error("this test fails");
	},
});
