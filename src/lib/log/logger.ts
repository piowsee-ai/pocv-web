import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Prisma } from "@/generated/prisma";

const { combine, timestamp, json, colorize, align, errors } = winston.format;

const __filename = fileURLToPath(import.meta.url);
const logDir = path.dirname(__filename);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const combinedTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  format: combine(errors({ stack: true }), timestamp(), json()),
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxFiles: "14d",
  format: combine(errors({ stack: true }), timestamp(), json()),
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "user-service" },
  transports: [combinedTransport, errorTransport],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        errors({ stack: true }),
        colorize({ all: true }),
        timestamp(),
        align()
      ),
    })
  );
}

export function logError(err: unknown, context: Record<string, any> = {}) {
  if (err instanceof Error) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError ||
      err instanceof Prisma.PrismaClientInitializationError
    ) {
        const maxLength = Number(process.env.MAX_LOG_ERROR_MESSAGE_LENGTH) || 200;
        const truncatedMessage = err.message.slice(0, maxLength);

      logger.error(`Prisma Error Occurred: ${truncatedMessage}...`, {
        error: {
          name: err.name,
          clientVersion: (err as any).clientVersion,
        },
        ...context,
      });
    } else {
      logger.error("Error Occurred", { error: err, ...context });
    }
  } else {
    logger.error("Unknown error", { error: err, ...context });
  }
}
