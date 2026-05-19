import * as z from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex } from "../indexer.js";

function asTextJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

export function registerComponentTools(server: McpServer, index: DesignSystemIndex) {
  server.registerTool(
    "list_components",
    {
      title: "List Grocers UI components",
      description:
        "Lists all React components defined in the Grocers design system UI kits (web, mobile, admin). " +
        "Returns kit, name, and exported flag. The 'admin' kit covers internal management panels (Dashboard, Pedidos, etc), " +
        "'web' covers consumer e-commerce, 'mobile' covers the iOS app. " +
        "Use this to discover available components before calling get_component for source.",
      inputSchema: {
        kit: z
          .enum(["web", "mobile", "admin"])
          .optional()
          .describe("Filter to a single UI kit (web/mobile/admin). Omit to list all."),
      },
    },
    async ({ kit }) => {
      let result = index.components;
      if (kit) result = result.filter((c) => c.kit === kit);
      return asTextJson({
        count: result.length,
        components: result.map((c) => ({
          kit: c.kit,
          name: c.name,
          exported: c.exports.length > 0,
          lines: c.source.split("\n").length,
        })),
      });
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a component's source code",
      description:
        "Returns the JSX source code of a specific component. " +
        "If multiple kits define the same component name, pass kit to disambiguate. " +
        "The source is a high-fidelity prototype — treat it as a visual spec, not as production code. " +
        "Recreate it in the target framework while matching tokens, structure, and invariants exactly.",
      inputSchema: {
        name: z.string().describe("Component name (e.g. 'KpiCard', 'MProductTile', 'CartSheet')."),
        kit: z
          .enum(["web", "mobile", "admin"])
          .optional()
          .describe("UI kit hint when multiple components share a name."),
      },
    },
    async ({ name, kit }) => {
      let matches = index.components.filter((c) => c.name === name);
      if (kit) matches = matches.filter((c) => c.kit === kit);

      if (matches.length === 0) {
        // Suggest close names
        const lower = name.toLowerCase();
        const suggestions = index.components
          .filter((c) => c.name.toLowerCase().includes(lower))
          .slice(0, 5)
          .map((c) => ({ kit: c.kit, name: c.name }));
        return asTextJson({ found: false, query: name, suggestions });
      }

      if (matches.length > 1) {
        return asTextJson({
          found: true,
          ambiguous: true,
          matches: matches.map((c) => ({ kit: c.kit, name: c.name })),
          hint: "Pass `kit` to disambiguate.",
        });
      }

      const m = matches[0];
      return asTextJson({
        found: true,
        kit: m.kit,
        name: m.name,
        exported: m.exports.length > 0,
        source: m.source,
      });
    },
  );
}
