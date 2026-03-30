import fs from "fs";
import path from "path";
import { Pool } from "pg";

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

function readSchemaSql() {
	const schemaCandidates = [
		path.resolve(__dirname, "schema.sql"),
		path.resolve(process.cwd(), "src/db/schema.sql"),
	];

	for (const schemaPath of schemaCandidates) {
		if (fs.existsSync(schemaPath)) {
			return fs.readFileSync(schemaPath, "utf8");
		}
	}

	throw new Error(
		"Could not find schema.sql for API database initialization",
	);
}

export async function ensureDatabaseSchema() {
	const encryptionKey = process.env.API_ENCRYPTION_KEY;
	if (!encryptionKey) {
		throw new Error(
			"API_ENCRYPTION_KEY is required for database encryption",
		);
	}

	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		await client.query(
			"SELECT set_config('app.encryption_key', $1, true)",
			[encryptionKey],
		);
		await client.query(readSchemaSql());
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
}
