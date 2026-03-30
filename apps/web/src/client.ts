const BASE_URL = import.meta.env.VITE_API_URL;

export async function getIntegrations() {
	const res = await fetch(`${BASE_URL}/integrations`);
	return res.json();
}

export async function createIntegration(data: {
	name: string;
	type: string;
	api_key: string;
}) {
	const res = await fetch(`${BASE_URL}/integrations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return res.json();
}

export async function syncIntegration(id: string) {
	const res = await fetch(`${BASE_URL}/integrations/${id}/sync`, {
		method: "POST",
	});

	return res.json();
}

export async function getIntegrationApiKey(id: string) {
	const res = await fetch(`${BASE_URL}/integrations/${id}/api-key`);
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body?.error ?? "Failed to fetch integration API key");
	}
	return res.json() as Promise<{ api_key: string }>;
}

export async function getJob(id: string) {
	const res = await fetch(`${BASE_URL}/jobs/${id}`);
	if (!res.ok) return null;
	return res.json();
}
