const BASE_URL = import.meta.env.VITE_API_URL;

export type LogEntry = {
	id: string;
	jobId: string;
	message: string;
	level: "INFO" | "ERROR";
	timestamp: string;
};

export async function getLogsByJob(jobId: string): Promise<LogEntry[]> {
	const res = await fetch(`${BASE_URL}/jobs/${jobId}/logs`);

	if (res.status === 404) {
		return [];
	}

	if (!res.ok) {
		throw new Error(`Failed to fetch logs (${res.status})`);
	}

	return res.json();
}

export async function getLogsByIntegration(
	integrationId: string,
): Promise<LogEntry[]> {
	const res = await fetch(`${BASE_URL}/integrations/${integrationId}/logs`);

	if (res.status === 404) {
		return [];
	}

	if (!res.ok) {
		throw new Error(`Failed to fetch logs (${res.status})`);
	}

	return res.json();
}
