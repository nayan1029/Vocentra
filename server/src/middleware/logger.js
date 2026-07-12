// Handles logging to console and file, plus metrics tracking

import { appendFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

/**
 * Standard log levels - pretty self-explanatory
 */
export const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

/**
 * Logger class that outputs JSON logs
 * Makes it easy to search through logs later
 */
export class Logger {
  constructor(context = "app") {
    this.context = context;
    this.logFile = process.env.LOG_FILE || null;
  }

  async log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...meta,
    };

    // Console output
    const formatted = `[${timestamp}] ${level} [${this.context}] ${message}`;
    if (level === LOG_LEVELS.ERROR) {
      console.error(formatted, meta);
    } else if (level === LOG_LEVELS.WARN) {
      console.warn(formatted, meta);
    } else {
      console.log(formatted, meta);
    }

    // File logging (optional)
    if (this.logFile) {
      try {
        await mkdir(dirname(this.logFile), { recursive: true });
        await appendFile(this.logFile, JSON.stringify(logEntry) + "\n");
      } catch (err) {
        console.error("Failed to write log file:", err);
      }
    }

    return logEntry;
  }

  error(message, meta) {
    return this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message, meta) {
    return this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta) {
    return this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta) {
    if (process.env.NODE_ENV === "development") {
      return this.log(LOG_LEVELS.DEBUG, message, meta);
    }
  }
}

/**
 * Redact sensitive data from logs
 */
export function redactSensitive(obj) {
  const sensitive = ["password", "token", "api_key", "secret", "authorization"];
  const redacted = { ...obj };

  for (const key of Object.keys(redacted)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      redacted[key] = "***REDACTED***";
    }
  }

  return redacted;
}

/**
 * Request logging middleware
 */
export function requestLogger(logger) {
  return (req, res, next) => {
    const start = Date.now();
    
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info("Request completed", {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      });
    });

    next();
  };
}

/**
 * Error tracking (integrate with Sentry, etc.)
 */
export function trackError(error, context = {}) {
  // TODO: Send to error tracking service (Sentry, Rollbar, etc.)
  console.error("Error tracked:", {
    message: error.message,
    stack: error.stack,
    context: redactSensitive(context),
  });
}

/**
 * Performance metrics (basic)
 */
export class Metrics {
  constructor() {
    this.counters = new Map();
    this.timers = new Map();
  }

  increment(metric, value = 1) {
    const current = this.counters.get(metric) || 0;
    this.counters.set(metric, current + value);
  }

  startTimer(metric) {
    this.timers.set(metric, Date.now());
  }

  endTimer(metric) {
    const start = this.timers.get(metric);
    if (!start) return null;
    
    const duration = Date.now() - start;
    this.timers.delete(metric);
    return duration;
  }

  getMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  reset() {
    this.counters.clear();
    this.timers.clear();
  }
}

// Export singleton instances
export const logger = new Logger("server");
export const metrics = new Metrics();
