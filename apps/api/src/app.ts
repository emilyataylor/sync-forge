import express from "express";
import cors from "cors";
import integrationsRouter from "./routes/integrations";
import jobRoutes from "./routes/jobs";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
	}),
);

app.use("/jobs", jobRoutes);
app.use("/integrations", integrationsRouter);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.use((req, res) => {
	res.status(404).json({
		error: "Route not found",
		path: req.originalUrl,
	});
});

app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		if (res.headersSent) {
			return next(err);
		}

		console.error("[API] Unhandled error:", err);

		return res.status(500).json({
			error: "Internal Server Error",
			message:
				process.env.NODE_ENV === "production"
					? "An unexpected error occurred"
					: err.message,
		});
	},
);

export default app;
