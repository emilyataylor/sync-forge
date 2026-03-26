import Redis from "ioredis";
import { Request, Response } from "express";

const redis = new Redis({
	host: process.env.REDIS_HOST || "localhost",
	port: Number(process.env.REDIS_PORT || 6379),
});

export const getJob = async (req: Request, res: Response) => {
	const { id } = req.params;

	const data = await redis.get(`job:${id}`);

	if (!data) {
		return res.status(404).json({ error: "Job not found" });
	}

	return res.json(JSON.parse(data));
};
