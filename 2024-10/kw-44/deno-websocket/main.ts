import { info } from "./shared/utils/console.ts";
import { PORT } from "./shared/lib/constants.ts";
import server from "./shared/lib/app.ts";

if (import.meta.main) {
	server.listen(PORT, () => info(PORT));
}
