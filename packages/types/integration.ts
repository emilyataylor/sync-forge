export type Integration = {
	id: string;
	name: string;
	type: string;
	createdAt: string;
};

export type Job = {
	id: string;
	integrationId: string;
	status: "pending" | "processing" | "completed" | "failed";
	attempt: number;
	maxAttempts: number;
	createdAt: string;
};
