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
