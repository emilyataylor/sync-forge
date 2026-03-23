export const fetchIntegrations = async () => {
	const res = await fetch("/api/integrations");
	return res.json();
};
