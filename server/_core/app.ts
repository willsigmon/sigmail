import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { addSecurityHeaders, configureCORS } from "./security";
import { registerHealthCheckRoutes } from "./healthCheck";

const BODY_LIMIT = "50mb";

export function createApp() {
  const app = express();

  // Security headers
  addSecurityHeaders(app);

  // CORS configuration
  configureCORS(app);

  // Health check endpoints (before body parsers)
  registerHealthCheckRoutes(app);

  // Body parsers
  app.use(express.json({ limit: BODY_LIMIT }));
  app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }));

  // OAuth routes
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
