import { integrationQueue } from "../queue/integrationQueue";

export async function triggerIntegrationSync(integrationId: string) {
	console.log(`[API] Queuing integration sync for ID: ${integrationId}`);

	await integrationQueue.add("sync-integration", {
		integrationId,
	});

	return { message: "Job queued" };
}
