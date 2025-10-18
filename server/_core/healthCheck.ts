import type { Express, Request, Response } from "express";
import { ENV } from "./env";
import { getDb } from "../db";

export type HealthStatus = {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    version: string;
    environment: string;
    checks: {
        database: {
            status: "ok" | "error";
            message?: string;
        };
        oauth: {
            status: "ok" | "error";
            message?: string;
        };
    };
};

export async function getHealthStatus(): Promise<HealthStatus> {
    const checks: HealthStatus["checks"] = {
        database: { status: "ok" },
        oauth: { status: "ok" },
    };

    // Check database connection
    try {
        const db = await getDb();
        if (!db) {
            checks.database = {
                status: "error",
                message: "Database not configured",
            };
        }
    } catch (error) {
        checks.database = {
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }

    // Check OAuth configuration
    if (!ENV.appId || !ENV.cookieSecret || !ENV.oAuthServerUrl) {
        checks.oauth = {
            status: "error",
            message: "OAuth not fully configured",
        };
    }

    // Determine overall status
    const hasErrors = Object.values(checks).some((check) => check.status === "error");
    const status = hasErrors ? "degraded" : "healthy";

    return {
        status,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        environment: ENV.isProduction ? "production" : "development",
        checks,
    };
}

export function registerHealthCheckRoutes(app: Express) {
    // Public health check endpoint for monitoring
    app.get("/health", async (req: Request, res: Response) => {
        try {
            const health = await getHealthStatus();
            const statusCode = health.status === "healthy" ? 200 : 503;
            res.status(statusCode).json(health);
        } catch (error) {
            res.status(503).json({
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    // Simple ping endpoint for uptime monitoring
    app.get("/ping", (req: Request, res: Response) => {
        res.status(200).send("pong");
    });
}
