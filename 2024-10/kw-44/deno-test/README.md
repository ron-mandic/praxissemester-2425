# Deno

## Kommandozeile

```bash
  # Generate an example library project.
  deno init --lib [dir]

  # Generate an example project for deno serve.
  deno init --serve [dir]

  # Run the program
  deno run main.ts
  deno run --check main.ts
  deno run --cached-only mod.ts

  # Reload everything (You can force deno to refetch and recompile modules into the cache using this flag)
  deno run --reload my_module.ts

  # Reload a specific module
  deno run --reload=jsr:@std/fs my_module.ts

  # Run a cript by piping it through standard input (https://docs.deno.com/runtime/getting_started/command_line_interface/#an-example-subcommand---deno-run)
  cat main.ts | deno run -

  # Passing arguments (https://docs.deno.com/runtime/getting_started/command_line_interface/#passing-script-arguments)
  deno run main.ts arg1 arg2 arg3

  # Watch mode (https://docs.deno.com/runtime/getting_started/command_line_interface/#watch-mode)
  deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
  deno run --watch --watch-exclude='*.js' main.ts
  deno run --watch-hmr main.ts

  # Run the program and watch for file changes
  deno task dev

  # Run the tests
  deno test

  # Stop execution after the first test failure
  deno test --fail-fast

  # Run all tests in the util directory
  deno test util/

  # Run just my_test.ts
  deno test my_test.ts

  # Run test modules in parallel
  deno test --parallel

  # Pass additional arguments to the test file that are visible in `Deno.args`
  deno test my_test.ts -- -e --foo --bar

  # Filter by groups
  deno test --filter "my" tests/
  deno test --filter "/test-*\d/" tests/

  # Provide permission for deno to read from the filesystem, which is necessary
  # for the final test above to pass
  deno test --allow-read my_test.ts

  # Reporter
  deno test
  deno test --reporter=dot
  deno test --reporter=junit
  deno test --junit-path=./report.xml

  # Loading test snippets from the JSDoc descriptions
  deno test --doc example.ts

  # Type check (JSDoc)
  deno check --doc main.ts

  # Type check (Markdown)
  deno check --doc-only main.ts

  # Debugger
  deno run --inspect your_script.ts
  deno run --inspect-wait your_script.ts
  deno run --inspect-brk your_script.ts # most commonly used inspect flag
  deno run --inspect-brk -RN jsr:@std/http@1.0.0/file-server
  deno run --inspect-brk --log-level=debug main.ts
  deno run --strace-ops your_script.ts # https://docs.deno.com/runtime/fundamentals/debugging/#--strace-ops
```

## [Beispiel für ein deno.json](https://docs.deno.com/runtime/fundamentals/configuration/#full-example)

### [JSON Schema](https://deno.land/x/deno@v2.0.4/cli/schemas/config-file.v1.json?source=)

## Testing

```txt
{*_,*.,}test.{ts, tsx, mts, js, mjs, jsx}.
```

### [Test Steps](https://docs.deno.com/runtime/fundamentals/testing/#test-steps)

### [Inclusion and exlucsion](https://docs.deno.com/runtime/fundamentals/testing/#including-and-excluding-test-files-in-the-configuration-file)

### [Spying, mocking (test doubles), stubbing and faking time](<https://docs.deno.com/runtime/fundamentals/testing/#spying%2C-mocking-(test-doubles)%2C-stubbing-and-faking-time>)

## [Resource sanitizers](https://docs.deno.com/runtime/fundamentals/testing/#resource-sanitizer)

```ts
const file = await Deno.open("hello.txt");
// Do something with the file
file.close(); // <- Always close the file when you are done with it

const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// Do something with the connection
conn.close(); // <- Always close the connection when you are done with it

const response = await fetch("https://example.com");
// Do something with the response
await response.body?.cancel(); // <- Always cancel the body when you are done with it, if you didn't consume it otherwise
```

## [Debugger](https://docs.deno.com/runtime/fundamentals/debugging/)

### [Using the debugger](https://docs.deno.com/runtime/reference/vscode/#using-the-debugger)

## [Workspaces](https://docs.deno.com/runtime/fundamentals/workspaces/)

### [Example](https://docs.deno.com/runtime/fundamentals/workspaces/#example)

## [HTTP-Server](https://docs.deno.com/runtime/fundamentals/http_server/)

### [Serving WebSockets](https://docs.deno.com/runtime/fundamentals/http_server/#serving-websockets)

### [Oak](https://docs.deno.com/runtime/fundamentals/http_server/#building-on-these-examples)
