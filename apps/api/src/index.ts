import "dotenv/config";
import app from "./app";
import { ensureDatabaseSchema } from "./db";

const PORT = Number(process.env.PORT || 3000);

async function start() {
	await ensureDatabaseSchema();

	app.listen(PORT, () => {
		console.log(`API running on port ${PORT}`);
	});
}

start().catch((error) => {
	console.error("[API] Failed to start:", error);
	process.exit(1);
});
