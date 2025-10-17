import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), "..");

const commonOptions = {
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  sourcemap: false,
  alias: {
    "@shared": path.join(rootDir, "shared"),
    "@": path.join(rootDir, "client", "src"),
    "@assets": path.join(rootDir, "attached_assets"),
  },
};

await fs.mkdir(path.join(rootDir, "dist"), { recursive: true });
await fs.mkdir(path.join(rootDir, "dist", "server"), { recursive: true });

await build({
  ...commonOptions,
  entryPoints: [path.join(rootDir, "server", "_core", "index.ts")],
  outfile: path.join(rootDir, "dist", "index.js"),
});

await build({
  ...commonOptions,
  entryPoints: [path.join(rootDir, "server", "_core", "runtime.ts")],
  outfile: path.join(rootDir, "dist", "server", "runtime.js"),
});
