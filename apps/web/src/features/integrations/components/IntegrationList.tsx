import { useEffect, useState } from "react";
import { fetchIntegrations } from "../api";
import IntegrationCard from "./IntegrationCard";
import type { Integration } from "../types";

export default function IntegrationList() {
	const [integrations, setIntegrations] = useState<Integration[]>([]);

	const loadIntegrations = async () => {
		const data = await fetchIntegrations();
		setIntegrations(data);
	};

	useEffect(() => {
		const fetchData = async () => {
			await loadIntegrations();
		};
		fetchData();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{integrations.map((integration) => (
				<IntegrationCard
					key={integration.id}
					integration={integration}
				/>
			))}
		</div>
	);
}
