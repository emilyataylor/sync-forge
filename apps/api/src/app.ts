import express from "express";
import cors from "cors";
import type { Integration } from "@syncforge/types";
import integrationsRouter from "./routes/integrations";

const integrations: Integration[] = [];

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
	}),
);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/integrations", integrationsRouter);

app.get("/api/integrations", (req, res) => {
	res.json(integrations);
});

app.post("/api/integrations", (req, res) => {
	const newIntegration = { ...req.body, id: Date.now().toString() };
	integrations.push(newIntegration);
	res.json(newIntegration);
});

export default app;
