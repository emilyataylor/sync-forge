import express from "express";
import cors from "cors";
import type { Integration } from "@syncforge/types";
import integrationsRouter from "./routes/integrations";
import jobRoutes from "./routes/jobs";

const integrations: Integration[] = [
	{
		id: "1",
		name: "GitHub Repo Sync",
		type: "github",
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Salesforce CRM Sync",
		type: "salesforce",
		createdAt: new Date().toISOString(),
	},
];

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
	}),
);

app.use("/jobs", jobRoutes);
app.use("/integrations", integrationsRouter);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.get("/integrations", (req, res) => {
	res.json(integrations);
});

app.post("/integrations", (req, res) => {
	const newIntegration = { ...req.body, id: Date.now().toString() };
	integrations.push(newIntegration);
	res.json(newIntegration);
});

export default app;
