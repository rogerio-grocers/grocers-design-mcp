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

const SYNONYMS: Record<string, string[]> = {
  vermelho: ["red", "brand", "ff4444"],
  azul: ["blue", "ink", "info"],
  preto: ["black", "ink", "0b0119"],
  branco: ["white", "ffffff", "canvas", "surface"],
  cinza: ["gray", "neutral"],
  destrutivo: ["destructive", "danger", "delete", "remove", "cancel"],
  destrutiva: ["destructive", "danger", "delete", "remove", "cancel"],
  erro: ["error", "danger"],
  alerta: ["warning", "warn"],
  preco: ["price", "currency"],
  preço: ["price", "currency"],
  pedido: ["order"],
  cliente: ["customer", "user"],
  marca: ["brand"],
  fonte: ["font"],
  espacamento: ["space", "spacing"],
  espaçamento: ["space", "spacing"],
  borda: ["border", "radius"],
  sombra: ["shadow"],
  botao: ["button", "cta"],
  botão: ["button", "cta"],
};

function wordContains(text: string, term: string): boolean {
  if (term.length <= 3) {
    // Use word boundary for short tokens to avoid matching inside "reduce", "freteFree" etc.
    const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(term)}(?:[^a-z0-9]|$)`, "i");
    return re.test(text);
  }
  return text.toLowerCase().includes(term.toLowerCase());
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expandQuery(query: string): string[] {
  const lower = query.toLowerCase().trim();
  const expanded = new Set<string>([lower]);
  const words = lower.split(/\s+/).filter(Boolean);
  for (const w of words) {
    if (SYNONYMS[w]) for (const syn of SYNONYMS[w]) expanded.add(syn);
  }
  return Array.from(expanded);
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
      const terms = expandQuery(query);

      const bestScore = (haystacks: string[]) => {
        let best = 0;
        for (const term of terms) {
          for (const h of haystacks) {
            const s = scoreText(h, term);
            if (s > best) best = s;
          }
        }
        return best;
      };

      const wordHit = (text: string) => terms.some((t) => wordContains(text, t));

      for (const t of index.tokens) {
        const nameScore = bestScore([t.name]);
        const valueScore = bestScore([t.value]);
        const noteScore = t.notes ? bestScore([t.notes]) : 0;
        const score = nameScore || noteScore || valueScore;
        if (score > 0) {
          hits.push({
            kind: "token",
            ref: t.name,
            preview: `${t.name} = ${t.value}${t.notes ? ` // ${t.notes}` : ""}`,
            score: score + (nameScore > 0 ? 5 : 0),
          });
        }
      }

      for (const c of index.components) {
        const nameScore = bestScore([c.name]);
        const sourceHit = wordHit(c.source);
        const score = nameScore + (sourceHit && nameScore === 0 ? 8 : 0) + (nameScore > 0 && sourceHit ? 4 : 0);
        if (score > 0) {
          hits.push({
            kind: "component",
            ref: `${c.kit}/${c.name}`,
            preview: nameScore > 0 ? `${c.kit} • ${c.name}` : snippet(c.source, terms[0]),
            score,
          });
        }
      }

      for (const cls of index.semanticClasses) {
        const nameScore = bestScore([cls.name]);
        const declHit = wordHit(cls.declarations);
        const score = nameScore + (declHit && nameScore === 0 ? 5 : 0);
        if (score > 0) {
          hits.push({
            kind: "semantic-class",
            ref: cls.name,
            preview: `.${cls.name} { ${cls.declarations.slice(0, 100)}${cls.declarations.length > 100 ? "…" : ""} }`,
            score,
          });
        }
      }

      for (const [sec, text] of Object.entries(index.foundations.sections)) {
        if (wordHit(text)) {
          hits.push({
            kind: "foundation",
            ref: sec,
            preview: snippet(text, terms[0]),
            score: 15,
          });
        }
      }

      hits.sort((a, b) => b.score - a.score);
      const limited = hits.slice(0, max);
      return asTextJson({
        query,
        expanded_terms: terms.length > 1 ? terms : undefined,
        total: hits.length,
        returned: limited.length,
        hits: limited,
      });
    },
  );
}
