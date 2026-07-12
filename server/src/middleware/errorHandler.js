import { logger } from "./logger.js";

export function errorHandler(err, _req, res, _next) {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });

  const status = err.status || 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal server error",
  });
}
