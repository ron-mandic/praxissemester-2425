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
```
