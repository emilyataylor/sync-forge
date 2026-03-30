import express from "express";
import {
	createIntegration,
	listIntegrations,
	syncIntegration,
} from "../controllers/integrationController";

const router = express.Router();

router.get("/", listIntegrations);
router.post("/", createIntegration);
router.post("/:id/sync", syncIntegration);

export default router;
