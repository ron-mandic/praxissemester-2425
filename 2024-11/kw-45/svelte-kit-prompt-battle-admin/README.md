# Client

## Known issues

### [Connection warnings](https://github.com/denoland/deno/issues/19507)

If you are not yet using Deno, please stay with Node until the GitHub issue is resolved. If Deno is used, the connection problems on the client side may cause the server on the other side to issue new socket identifiers. Please use sparingly or with caution.
