export async function fetchIntegrations() {
	const res = await fetch("http://localhost:3000/integrations");
	return res.json();
}

export async function triggerSync(integrationId: string) {
	await fetch(`http://localhost:3000/jobs/trigger/${integrationId}`, {
		method: "POST",
	});
}
