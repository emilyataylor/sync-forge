import { triggerIntegrationSync } from "../services/integrationService";

import { Request, Response } from "express";
export const syncIntegration = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (typeof id !== "string") {
		return res.status(400).json({ error: "Invalid integration id" });
	}

	const result = await triggerIntegrationSync(id);

	res.json({ jobId: result.jobId });
};
