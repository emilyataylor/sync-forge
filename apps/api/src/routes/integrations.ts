import express from "express";
import {
	createIntegration,
	getIntegrationApiKey,
	getIntegrationJobs,
	getIntegrationLogs,
	listIntegrations,
	syncIntegration,
} from "../controllers/integrationController";

const router = express.Router();

router.get("/", listIntegrations);
router.post("/", createIntegration);
router.get("/:id/jobs", getIntegrationJobs);
router.get("/:id/logs", getIntegrationLogs);
router.get("/:id/api-key", getIntegrationApiKey);
router.post("/:id/sync", syncIntegration);

export default router;
