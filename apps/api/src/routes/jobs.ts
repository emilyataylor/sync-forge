import express from "express";
import { getJob } from "../controllers/jobController";

const router = express.Router();

router.get("/:id", getJob);

export default router;
