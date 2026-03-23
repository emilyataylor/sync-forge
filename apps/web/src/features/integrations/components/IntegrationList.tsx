import { useEffect, useState } from "react";
import IntegrationCard from "./IntegrationCard";
import type { Integration } from "../types";
import CreateIntegrationForm from "./CreateIntegrationForm";
import { getIntegrations } from "../../../client";

export default function IntegrationList() {
	const [integrations, setIntegrations] = useState<Integration[]>([]);
	const [showForm, setShowForm] = useState(false);

	const loadIntegrations = async () => {
		const data = await getIntegrations();
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
			<button
				onClick={() => setShowForm(!showForm)}
				className="bg-sky-500 text-white px-4 py-2 rounded"
			>
				+ New Integration
			</button>
			{showForm && <CreateIntegrationForm onSuccess={loadIntegrations} />}
			{integrations.map((integration) => (
				<IntegrationCard
					key={integration.id}
					integration={integration}
				/>
			))}
		</div>
	);
}
