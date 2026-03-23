// features/integrations/components/IntegrationCard.tsx
import type { Integration } from "../types";
import { triggerSync } from "../api";

type Props = {
	integration: Integration;
};

export default function IntegrationCard({ integration }: Props) {
	const handleSync = async () => {
		await triggerSync(integration.id);
		alert("Sync triggered!");
	};

	return (
		<div className="border rounded-xl p-4 flex justify-between items-center">
			<div>
				<h3 className="font-semibold">{integration.name}</h3>
				<p className="text-sm text-gray-500">{integration.type}</p>
			</div>

			<button
				onClick={handleSync}
				className="bg-blue-500 text-white px-3 py-1 rounded"
			>
				Trigger Sync
			</button>
		</div>
	);
}
