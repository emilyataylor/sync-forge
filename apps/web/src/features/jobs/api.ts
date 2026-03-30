import type { Job } from "@syncforge/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getJobs(): Promise<Job[]> {
	const res = await fetch(`${BASE_URL}/jobs`);

	if (!res.ok) {
		throw new Error(`Failed to fetch jobs (${res.status})`);
	}

	return res.json();
}

export async function getJobsByIntegration(
	integrationId: string,
): Promise<Job[]> {
	const res = await fetch(`${BASE_URL}/integrations/${integrationId}/jobs`);

	if (res.status === 404) {
		return [];
	}

	if (!res.ok) {
		throw new Error(`Failed to fetch jobs (${res.status})`);
	}

	return res.json();
}
