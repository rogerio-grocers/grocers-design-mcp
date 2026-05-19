import { serve } from "@hono/node-server";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { buildIndex } from "./indexer.js";
import { buildApp } from "./server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolveBundleRoot(): string {
  const envPath = process.env.BUNDLE_ROOT;
  if (envPath && existsSync(envPath)) return envPath;
  const candidates = [
    resolve(__dirname, "..", "bundle"),
    resolve(__dirname, "..", "..", "bundle"),
    resolve(process.cwd(), "bundle"),
  ];
  for (const c of candidates) {
    if (existsSync(join(c, "project", "colors_and_type.css"))) return c;
  }
  throw new Error(
    `Bundle not found. Tried: ${candidates.join(", ")}. Set BUNDLE_ROOT env to override.`,
  );
}

function requireToken(): string {
  const t = process.env.GROCERS_MCP_TOKEN;
  if (!t || t.length < 16) {
    throw new Error(
      "GROCERS_MCP_TOKEN env required (min 16 chars). For dev set a long random string.",
    );
  }
  return t;
}

const bundleRoot = resolveBundleRoot();
console.log(`[boot] bundle root: ${bundleRoot}`);

const index = buildIndex(bundleRoot);
console.log(
  `[boot] indexed ${index.tokens.length} tokens, ${index.semanticClasses.length} semantic classes, ${index.components.length} components`,
);

const token = requireToken();
console.log(`[boot] auth token loaded (${token.length} chars)`);

const app = buildApp(index, token);
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

serve({
  fetch: app.fetch,
  port,
});

console.log(`[boot] grocers-design-mcp listening on :${port}`);
console.log(`[boot] health:  http://localhost:${port}/health`);
console.log(`[boot] mcp:     http://localhost:${port}/<token>/mcp`);
