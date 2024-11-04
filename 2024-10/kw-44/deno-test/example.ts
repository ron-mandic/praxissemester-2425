/// <reference lib="deno.ns" />

// deno test --doc example.ts
/**
 * # Examples
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(ONE, getTwo());
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
	return a + b;
}

export const ONE = 1;
export default function getTwo() {
	return 2;
}

/**
 * This code block will not be run.
 *
 * ```ts ignore
 * await sendEmail("deno@example.com");
 * ```
 */
export async function sendEmail(to: string) {
	// send an email to the given address...
	await new Promise((resolve) => setTimeout(resolve, 1000));
	console.log("Sending email to", to);
}
