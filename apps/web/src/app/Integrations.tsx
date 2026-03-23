import IntegrationList from "../features/integrations/components/IntegrationList";

export default function Integrations() {
	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Integrations</h1>

			<IntegrationList />
		</div>
	);
}
