import { triggerIntegrationSync } from "../services/integrationService";

import { NextFunction, Request, Response } from "express";
export const syncIntegration = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		if (typeof id !== "string") {
			return res.status(400).json({ error: "Invalid integration id" });
		}

		const result = await triggerIntegrationSync(id);

		return res.json({ jobId: result.jobId });
	} catch (error) {
		return next(error);
	}
};
