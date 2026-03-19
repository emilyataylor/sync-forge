import Redis from "ioredis";
import { Request, Response } from "express";

const redis = new Redis();

export const getJob = async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await redis.get(`job:${id}`);

	if (!data) {
		return res.status(404).json({ error: "Job not found" });
	}

	return res.json(JSON.parse(data));
};
