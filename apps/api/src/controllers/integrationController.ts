import { pool } from "../db";
import { triggerIntegrationSync } from "../services/integrationService";

import { NextFunction, Request, Response } from "express";

const mapIntegrationRow = (row: {
	id: string;
	name: string;
	type: string;
	created_at: Date | string;
}) => ({
	id: row.id,
	name: row.name,
	type: row.type,
	createdAt: new Date(row.created_at).toISOString(),
});

export const listIntegrations = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await pool.query(
			`SELECT id, name, type, created_at FROM integrations ORDER BY created_at DESC`,
		);

		return res.json(result.rows.map(mapIntegrationRow));
	} catch (error) {
		return next(error);
	}
};

export const createIntegration = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, type, api_key: apiKey } = req.body;

		if (
			typeof name !== "string" ||
			typeof type !== "string" ||
			typeof apiKey !== "string" ||
			!name.trim() ||
			!type.trim() ||
			!apiKey.trim()
		) {
			return res.status(400).json({
				error: "name, type, and api_key are required",
			});
		}

		const result = await pool.query(
			`INSERT INTO integrations (name, type, api_key)
			 VALUES ($1, $2, $3)
			 RETURNING id, name, type, created_at`,
			[name.trim(), type.trim(), apiKey.trim()],
		);

		return res.status(201).json(mapIntegrationRow(result.rows[0]));
	} catch (error) {
		return next(error);
	}
};

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
