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

const mapLogRow = (row: {
	id: string;
	job_id: string;
	message: string | null;
	level: "INFO" | "ERROR";
	timestamp: Date | string;
}) => ({
	id: row.id,
	jobId: row.job_id,
	message: row.message ?? "",
	level: row.level,
	timestamp: new Date(row.timestamp).toISOString(),
});

const mapJobRow = (row: {
	id: string;
	integration_id: string;
	status: string;
	attempts: number;
	max_attempts: number;
	created_at: Date | string;
}) => ({
	id: row.id,
	integrationId: row.integration_id,
	status: row.status,
	attempt: row.attempts,
	maxAttempts: row.max_attempts,
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
		const encryptionKey = process.env.API_ENCRYPTION_KEY;
		if (!encryptionKey) {
			throw new Error("API_ENCRYPTION_KEY is required");
		}

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
			 VALUES ($1, $2, pgp_sym_encrypt($3, $4))
			 RETURNING id, name, type, created_at`,
			[name.trim(), type.trim(), apiKey.trim(), encryptionKey],
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

export const getIntegrationLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			`SELECT l.id, l.job_id, l.message, l.level, l.timestamp
			 FROM logs l
			 INNER JOIN jobs j ON j.id = l.job_id
			 WHERE j.integration_id::text = $1
			 ORDER BY l.timestamp DESC`,
			[id],
		);

		return res.json(result.rows.map(mapLogRow));
	} catch (error) {
		return next(error);
	}
};

export const getIntegrationJobs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			`SELECT id, integration_id, status, attempts, max_attempts, created_at
			 FROM jobs
			 WHERE integration_id::text = $1
			 ORDER BY created_at DESC`,
			[id],
		);

		return res.json(result.rows.map(mapJobRow));
	} catch (error) {
		return next(error);
	}
};
