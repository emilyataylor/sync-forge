import { triggerIntegrationSync } from "../services/integrationService";

export async function syncIntegration(
	req: { params: { id: any } },
	res: { json: (arg0: { message: string }) => void },
) {
	const { id } = req.params;

	const result = await triggerIntegrationSync(id);

	res.json(result);
}
