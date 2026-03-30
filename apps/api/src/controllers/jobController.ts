import { NextFunction, Request, Response } from "express";
import { pool } from "../db";

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

export const getJob = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`SELECT id, integration_id, status, attempts, max_attempts, created_at
			 FROM jobs
			 WHERE id = $1`,
			[id],
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Job not found" });
		}

		return res.json(mapJobRow(result.rows[0]));
	} catch (error) {
		return next(error);
	}
};

export const listJobs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await pool.query(
			`SELECT id, integration_id, status, attempts, max_attempts, created_at
			 FROM jobs
			 ORDER BY created_at DESC
			 LIMIT 200`,
		);

		return res.json(result.rows.map(mapJobRow));
	} catch (error) {
		return next(error);
	}
};

export const getJobLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		const jobExists = await pool.query(`SELECT 1 FROM jobs WHERE id = $1`, [
			id,
		]);

		if (jobExists.rowCount === 0) {
			return res.status(404).json({ error: "Job not found" });
		}

		const result = await pool.query(
			`SELECT id, job_id, message, level, timestamp
			 FROM logs
			 WHERE job_id = $1
			 ORDER BY timestamp DESC`,
			[id],
		);

		return res.json(result.rows.map(mapLogRow));
	} catch (error) {
		return next(error);
	}
};
