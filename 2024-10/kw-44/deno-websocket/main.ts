import { info } from "./shared/utils/console.ts";
import { SERVER_OPTIONS, SERVER_PORT } from "./shared/lib/index.ts";
import server from "./shared/lib/io.ts";

if (import.meta.main) {
	server.listen(SERVER_OPTIONS, () => info(SERVER_PORT));
}
