import * as z from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex, TokenCategory } from "../indexer.js";

const TOKEN_CATEGORIES: TokenCategory[] = [
  "color",
  "spacing",
  "radius",
  "shadow",
  "type-size",
  "type-weight",
  "type-tracking",
  "type-family",
  "motion",
  "other",
];

function asTextJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

export function registerTokenTools(server: McpServer, index: DesignSystemIndex) {
  server.registerTool(
    "list_tokens",
    {
      title: "List design tokens",
      description:
        "Lists all design tokens (colors, spacing, radii, shadows, type, motion) from the Grocers design system. " +
        "Optionally filter by category or group. Returns name, value, category and group for each token. " +
        "Use this first to discover what's available before calling get_token for details.",
      inputSchema: {
        category: z
          .enum(TOKEN_CATEGORIES)
          .optional()
          .describe("Filter by token category (e.g. 'color', 'spacing'). Omit to list all."),
        group: z
          .string()
          .optional()
          .describe("Filter by sub-group (e.g. 'brand', 'ink', 'neutrals', 'semantic', 'roles')."),
      },
    },
    async ({ category, group }) => {
      let result = index.tokens;
      if (category) result = result.filter((t) => t.category === category);
      if (group) result = result.filter((t) => t.group === group);
      return asTextJson({
        count: result.length,
        tokens: result.map((t) => ({
          name: t.name,
          value: t.value,
          category: t.category,
          group: t.group,
        })),
      });
    },
  );

  server.registerTool(
    "get_token",
    {
      title: "Get a specific design token",
      description:
        "Returns full details for a single design token by name, including raw value, category, group, and any documented notes. " +
        "Token names include the leading double-dash (e.g. '--color-brand-500', '--space-4', '--radius-md').",
      inputSchema: {
        name: z
          .string()
          .describe("Token name including the leading '--' (e.g. '--color-brand-500')."),
      },
    },
    async ({ name }) => {
      const lookupName = name.startsWith("--") ? name : `--${name}`;
      const token = index.tokensByName.get(lookupName);
      if (!token) {
        const similar = index.tokens
          .filter((t) => t.name.includes(lookupName.replace(/^--/, "")))
          .slice(0, 5)
          .map((t) => t.name);
        return asTextJson({
          found: false,
          query: lookupName,
          suggestions: similar,
        });
      }
      return asTextJson({ found: true, token });
    },
  );

  server.registerTool(
    "list_semantic_classes",
    {
      title: "List semantic type classes",
      description:
        "Lists pre-built semantic typography classes (t-display, t-h1, t-body, t-price, etc.) ready to apply via className. " +
        "Each class encodes weight, size, line-height, tracking and color in one shot per Grocers's type system.",
      inputSchema: {},
    },
    async () => {
      return asTextJson({
        count: index.semanticClasses.length,
        classes: index.semanticClasses.map((c) => ({
          name: c.name,
          declarations: c.declarations,
        })),
      });
    },
  );
}
