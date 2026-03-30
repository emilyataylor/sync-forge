import express from "express";
import { getJob, getJobLogs, listJobs } from "../controllers/jobController";

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", getJob);
router.get("/:id/logs", getJobLogs);

export default router;
