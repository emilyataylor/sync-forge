import Redis from "ioredis";

const redis = new Redis();

export async function triggerIntegrationSync(integrationId: string) {
	console.log(`[API] Queuing integration sync for ID: ${integrationId}`);

	try {
		// Push to Redis list (for Go worker)
		await redis.lpush(
			"integration-jobs",
			JSON.stringify({
				integrationId,
				attempt: 1,
				maxAttempts: 3,
			}),
		);

		console.log(`[API] Job queued: ${integrationId}`);

		return { message: "Job queued" };
	} catch (error) {
		console.error(`[API] Failed to queue job: ${integrationId}`, error);
		throw error;
	}
}
