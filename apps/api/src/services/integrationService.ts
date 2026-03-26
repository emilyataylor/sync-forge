import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

const redis = new Redis({
	host: process.env.REDIS_HOST || "localhost",
	port: Number(process.env.REDIS_PORT || 6379),
});

export async function triggerIntegrationSync(
	integrationId: string,
): Promise<{ jobId: string; message: string }> {
	console.log(`[API] Queuing integration sync for ID: ${integrationId}`);

	try {
		const jobId = uuidv4();

		const job = {
			id: jobId,
			integrationId,
			status: "pending",
			attempt: 1,
			maxAttempts: 3,
			createdAt: new Date().toISOString(),
		};

		await redis.set(`job:${jobId}`, JSON.stringify(job));
		// Push to Redis list (for Go worker)
		await redis.lpush("integration-jobs", JSON.stringify(job));

		console.log(`[API] Job queued: ${integrationId}`);

		return { jobId, message: "Job queued" };
	} catch (error) {
		console.error(`[API] Failed to queue job: ${integrationId}`, error);
		throw error;
	}
}

export async function getJob(
	req: { params: { id: any } },
	res: {
		status: (arg0: number) => {
			(): any;
			new (): any;
			json: { (arg0: { error: string }): any; new (): any };
		};
		json: (arg0: any) => void;
	},
) {
	const { id } = req.params;

	const data = await redis.get(`job:${id}`);

	if (!data) {
		return res.status(404).json({ error: "Job not found" });
	}

	res.json(JSON.parse(data));
}
