import * as z from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex } from "../indexer.js";

function asText(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function asTextJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

const SECTION_ALIASES: Record<string, string[]> = {
  content: ["content fundamentals", "content"],
  visual: ["visual foundations", "visual"],
  iconography: ["iconography"],
  index: ["index"],
  sources: ["sources used"],
  flags: ["🚩 flags / open items", "flags"],
};

export function registerFoundationTools(server: McpServer, index: DesignSystemIndex) {
  server.registerTool(
    "get_foundations",
    {
      title: "Get brand and design foundations",
      description:
        "Returns the Grocers brand foundations — how copy is written (tone, casing, language), visual rules " +
        "(colors, type, spacing, motion), and iconography conventions. " +
        "Read this before composing any non-trivial screen so brand invariants (e.g. red ≠ error, " +
        "no emoji, sentence-case headings) are respected. " +
        "Pass a section to narrow the response.",
      inputSchema: {
        section: z
          .enum(["all", "content", "visual", "iconography", "sources", "flags", "index"])
          .optional()
          .describe(
            "Which section to return. 'all' returns the full README. Default is 'all'.",
          ),
      },
    },
    async ({ section }) => {
      const s = section ?? "all";
      if (s === "all") return asText(index.foundations.full);
      const aliases = SECTION_ALIASES[s] ?? [s];
      for (const alias of aliases) {
        const text = index.foundations.sections[alias.toLowerCase()];
        if (text) return asText(text);
      }
      // Fallback: list available sections
      return asTextJson({
        found: false,
        requested: s,
        available_sections: Object.keys(index.foundations.sections),
      });
    },
  );

  server.registerTool(
    "get_skill",
    {
      title: "Get the SKILL.md manifest",
      description:
        "Returns the SKILL.md manifest of the Grocers design system. " +
        "Useful when bootstrapping a fresh agent that needs the one-paragraph brand summary and " +
        "the pointers to other artifacts (tokens, components, foundations).",
      inputSchema: {},
    },
    async () => asText(index.skill),
  );
}
