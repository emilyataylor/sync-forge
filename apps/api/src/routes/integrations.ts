import express from "express";
import { syncIntegration } from "../controllers/integrationController";

const router = express.Router();

router.post("/:id/sync", syncIntegration);

export default router;
