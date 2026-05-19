import { Hono } from "hono";
import { cors } from "hono/cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { DesignSystemIndex } from "./indexer.js";
import { registerTools } from "./tools/index.js";
import { timingSafeEqual } from "node:crypto";

const VERSION = "0.1.0";

function makeMcpServer(index: DesignSystemIndex): McpServer {
  const server = new McpServer({
    name: "grocers-design",
    version: VERSION,
  });
  registerTools(server, index);
  return server;
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export function buildApp(index: DesignSystemIndex, expectedToken: string) {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "mcp-session-id",
        "Last-Event-ID",
        "mcp-protocol-version",
        "Authorization",
      ],
      exposeHeaders: ["mcp-session-id", "mcp-protocol-version"],
    }),
  );

  app.get("/health", (c) =>
    c.json({
      status: "ok",
      service: "grocers-design-mcp",
      version: VERSION,
      tokens: index.tokens.length,
      components: index.components.length,
    }),
  );

  app.get("/", (c) =>
    c.json({
      service: "grocers-design-mcp",
      version: VERSION,
      docs: "https://github.com/rogerio-grocers/grocers-design-mcp",
      note: "MCP endpoint is mounted at /<token>/mcp — token is required",
    }),
  );

  app.all("/:token/mcp", async (c) => {
    const tokenParam = c.req.param("token");
    if (!tokenParam || !safeCompare(tokenParam, expectedToken)) {
      return c.notFound();
    }
    const transport = new WebStandardStreamableHTTPServerTransport();
    const server = makeMcpServer(index);
    await server.connect(transport);
    return transport.handleRequest(c.req.raw);
  });

  return app;
}
