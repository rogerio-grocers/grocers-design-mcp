import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex } from "../indexer.js";
import { registerTokenTools } from "./tokens.js";
import { registerComponentTools } from "./components.js";
import { registerFoundationTools } from "./foundations.js";
import { registerSearchTool } from "./search.js";
import { registerValidateTool } from "./validate.js";

export function registerTools(server: McpServer, index: DesignSystemIndex) {
  registerTokenTools(server, index);
  registerComponentTools(server, index);
  registerFoundationTools(server, index);
  registerSearchTool(server, index);
  registerValidateTool(server, index);
}
