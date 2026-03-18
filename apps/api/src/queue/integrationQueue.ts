import { Queue } from "bullmq";

export const integrationQueue = new Queue("integration-jobs", {
	connection: {
		host: "localhost",
		port: 6379,
	},
});
