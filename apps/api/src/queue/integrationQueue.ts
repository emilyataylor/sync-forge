import { Queue } from "bullmq";

export const integrationQueue = new Queue("integration-jobs", {
	connection: {
		host: process.env.REDIS_HOST || "localhost",
		port: Number(process.env.REDIS_PORT || 6379),
	},
});
