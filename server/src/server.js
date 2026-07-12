import "./loadEnv.js";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config/index.js";
import { logger, requestLogger, metrics } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger(logger));

const limiter = rateLimit({
  windowMs: 60_000,
  max: config.rateLimitPerMin,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "vocentra-api" }));
app.get("/metrics", (_req, res) => res.json(metrics.getMetrics()));

app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);

app.use((_req, res) => res.status(404).json({ status: "error", message: "Not found" }));
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Vocentra API ready on http://localhost:${config.port}`);
});
