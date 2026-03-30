import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db";

const redis = new Redis({
	host: process.env.REDIS_HOST || "localhost",
	port: Number(process.env.REDIS_PORT || 6379),
});

export async function triggerIntegrationSync(
	integrationId: string,
): Promise<{ jobId: string; message: string }> {
	console.log(`[API] Queuing integration sync for ID: ${integrationId}`);

	try {
		const integrationResult = await pool.query(
			`SELECT id FROM integrations WHERE id = $1`,
			[integrationId],
		);

		if (integrationResult.rowCount === 0) {
			throw new Error("Integration not found");
		}

		const jobId = uuidv4();

		const job = {
			id: jobId,
			integrationId,
			status: "PENDING",
			attempt: 1,
			maxAttempts: 3,
			createdAt: new Date().toISOString(),
		};

		await pool.query(
			`INSERT INTO jobs (id, integration_id, status, attempts, max_attempts)
			 VALUES ($1, $2, $3, $4, $5)`,
			[
				job.id,
				job.integrationId,
				job.status,
				job.attempt,
				job.maxAttempts,
			],
		);

		// Push to Redis list (for Go worker)
		await redis.lpush("integration-jobs", JSON.stringify(job));

		console.log(`[API] Job queued: ${integrationId}`);

		return { jobId, message: "Job queued" };
	} catch (error) {
		console.error(`[API] Failed to queue job: ${integrationId}`, error);
		throw error;
	}
}
