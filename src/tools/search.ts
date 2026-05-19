import * as z from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex } from "../indexer.js";

interface SearchHit {
  kind: "token" | "component" | "foundation" | "semantic-class";
  ref: string;
  preview: string;
  score: number;
}

function asTextJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

function scoreText(haystack: string, needle: string): number {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h === n) return 100;
  if (h.startsWith(n)) return 50;
  if (h.includes(n)) return 20;
  return 0;
}

function snippet(text: string, query: string, radius = 60): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, 120);
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

export function registerSearchTool(server: McpServer, index: DesignSystemIndex) {
  server.registerTool(
    "search",
    {
      title: "Full-text search across the design system",
      description:
        "Searches tokens, components, semantic classes, and the foundations README for a query string. " +
        "Returns ranked hits with a short context preview and the ref needed to fetch full content " +
        "(e.g. token name, component name, foundation section). " +
        "Use this when you don't know the exact name of what you're looking for.",
      inputSchema: {
        query: z.string().min(1).describe("Free-form text to search for."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Maximum hits to return. Default 15."),
      },
    },
    async ({ query, limit }) => {
      const max = limit ?? 15;
      const hits: SearchHit[] = [];

      for (const t of index.tokens) {
        const s = scoreText(t.name, query) || scoreText(t.value, query) || (t.notes ? scoreText(t.notes, query) : 0);
        if (s > 0) {
          hits.push({
            kind: "token",
            ref: t.name,
            preview: `${t.name} = ${t.value}${t.notes ? ` // ${t.notes}` : ""}`,
            score: s + 1,
          });
        }
      }

      for (const c of index.components) {
        const nameScore = scoreText(c.name, query);
        const sourceScore = c.source.toLowerCase().includes(query.toLowerCase()) ? 10 : 0;
        const s = nameScore + sourceScore;
        if (s > 0) {
          hits.push({
            kind: "component",
            ref: `${c.kit}/${c.name}`,
            preview: nameScore > 0 ? `${c.kit} • ${c.name}` : snippet(c.source, query),
            score: s,
          });
        }
      }

      for (const cls of index.semanticClasses) {
        const s = scoreText(cls.name, query) || (cls.declarations.toLowerCase().includes(query.toLowerCase()) ? 5 : 0);
        if (s > 0) {
          hits.push({
            kind: "semantic-class",
            ref: cls.name,
            preview: `.${cls.name} { ${cls.declarations.slice(0, 100)}${cls.declarations.length > 100 ? "…" : ""} }`,
            score: s,
          });
        }
      }

      for (const [sec, text] of Object.entries(index.foundations.sections)) {
        if (text.toLowerCase().includes(query.toLowerCase())) {
          hits.push({
            kind: "foundation",
            ref: sec,
            preview: snippet(text, query),
            score: 15,
          });
        }
      }

      hits.sort((a, b) => b.score - a.score);
      const limited = hits.slice(0, max);
      return asTextJson({
        query,
        total: hits.length,
        returned: limited.length,
        hits: limited,
      });
    },
  );
}
