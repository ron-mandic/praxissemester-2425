import { info } from "./shared/utils/console.ts";
import { SERVER_PORT } from "./shared/lib/index.ts";
import server from "./shared/lib/app.ts";

if (import.meta.main) {
	server.listen(SERVER_PORT, () => info(SERVER_PORT));
}
