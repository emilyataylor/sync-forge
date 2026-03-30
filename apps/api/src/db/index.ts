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
	await pool.query(readSchemaSql());
}
