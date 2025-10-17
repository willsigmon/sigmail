import type { VercelRequest, VercelResponse } from "@vercel/node";
import type * as Runtime from "../../server/_core/runtime";

const runtimeModulePromise: Promise<typeof Runtime> =
  process.env.VERCEL === "1"
    ? import("../../dist/server/runtime.js")
    : import("../../server/_core/runtime");

const createHTTPHandler = await import("@trpc/server/adapters/node-http").then(
  mod => mod.createHTTPHandler ?? mod.default
);

if (typeof createHTTPHandler !== "function") {
  throw new Error("Failed to load tRPC createHTTPHandler");
}

const { appRouter, createContext } = await runtimeModulePromise;

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
  endpoint: "/api/trpc",
});

export default async function trpcHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    await Promise.resolve(handler(req, res));
  } catch (error) {
    console.error("[tRPC] Handler failed", error);
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
