export function info(port: number): void {
	console.log(
		`\n%cDeno: Server started on http://localhost:${port}\n`,
		"color: green;"
	);
}
