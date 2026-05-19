import * as z from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex } from "../indexer.js";

export type Severity = "error" | "warning" | "info";

export interface Violation {
  rule: string;
  severity: Severity;
  line?: number;
  column?: number;
  snippet: string;
  message: string;
  suggestion: string;
}

function asTextJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

const EMOJI_PATTERN = String.raw`[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}]|\u{FE0F}`;

const BRAND_REDS_MAP: Record<string, string> = {
  "#fff1f1": "var(--color-brand-50)",
  "#ffe1e1": "var(--color-brand-100)",
  "#ffc7c7": "var(--color-brand-200)",
  "#ffa0a0": "var(--color-brand-300)",
  "#ff6c6c": "var(--color-brand-400)",
  "#ff4444": "var(--color-brand-500)",
  "#ed1f1f": "var(--color-brand-600)",
  "#c81616": "var(--color-brand-700)",
  "#a51515": "var(--color-brand-800)",
  "#881818": "var(--color-brand-900)",
};

const INK_HEXES_MAP: Record<string, string> = {
  "#0b0119": "var(--color-ink)",
  "#14081f": "var(--color-ink-95)",
  "#1c1028": "var(--color-ink-90)",
  "#2b1f3a": "var(--color-ink-80)",
  "#4a3f59": "var(--color-ink-60)",
  "#7a7184": "var(--color-ink-40)",
  "#c5c1cb": "var(--color-ink-20)",
};

const VALID_RADII_PX = new Set([4, 6, 10, 14, 18, 24]);
const VALID_SPACING_PX = new Set([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]);

const ERROR_KEYWORDS = [
  "error",
  "errors",
  "invalid",
  "validation",
  "fail",
  "failed",
  "failure",
  "incorrect",
  "wrong",
  "erro",
  "erros",
  "inválido",
  "invalido",
  "falha",
  "falhou",
  "incorreto",
];

const DESTRUCTIVE_KEYWORDS = [
  "delete",
  "remove",
  "destroy",
  "cancel cancellation",
  "cancelar pedido",
  "excluir",
  "apagar",
  "remover",
  "deletar",
  "destrutivo",
  "destrutiva",
];

const PRICE_RE = /R\$\s*\d/;

type Language = "css" | "jsx" | "tsx" | "html" | "auto";

function detectLanguage(snippet: string): Exclude<Language, "auto"> {
  if (/<[A-Za-z][\s\S]*?>[\s\S]*<\//.test(snippet) || /className=/.test(snippet)) {
    return /\bfunction\b|\bconst\b\s+[A-Z]\w*\s*=/.test(snippet) ? "jsx" : "html";
  }
  if (/--[a-z][\w-]*:/.test(snippet) || /\{[^{}]*:[^{}]*;\s*\}/.test(snippet)) return "css";
  return "css";
}

function locate(snippet: string, idx: number): { line: number; column: number } {
  const slice = snippet.slice(0, idx);
  const line = slice.split("\n").length;
  const lastNewline = slice.lastIndexOf("\n");
  const column = lastNewline === -1 ? idx + 1 : idx - lastNewline;
  return { line, column };
}

function pushAll(out: Violation[], items: Violation[]) {
  for (const i of items) out.push(i);
}

function extractContext(snippet: string, idx: number, matchLen: number, radius = 30): string {
  const start = Math.max(0, idx - radius);
  const end = Math.min(snippet.length, idx + matchLen + radius);
  let s = snippet.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) s = "…" + s;
  if (end < snippet.length) s = s + "…";
  return s;
}

function checkEmoji(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = new RegExp(EMOJI_PATTERN, "gu");
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    // Skip standalone VS16 (️) — only flag when paired with a base char,
    // already covered by the first range. Also skip if the match is a digit/letter selector.
    if (m[0] === "️" && m.index === 0) continue;
    const loc = locate(snippet, m.index);
    out.push({
      rule: "no-emoji",
      severity: "error",
      ...loc,
      snippet: m[0],
      message: `Emoji ${m[0]} encontrado. O DS Grocers não usa emoji em UI.`,
      suggestion: "Substitua por um ícone Lucide adequado, com stroke 2px e tamanho 20px/24px.",
    });
  }
  return out;
}

function checkBrandHexHardcode(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = /#[0-9a-fA-F]{3,8}\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    const hex = m[0].toLowerCase();
    const brandToken = BRAND_REDS_MAP[hex];
    const inkToken = INK_HEXES_MAP[hex];
    if (brandToken) {
      const loc = locate(snippet, m.index);
      out.push({
        rule: "no-hardcoded-brand-color",
        severity: "warning",
        ...loc,
        snippet: m[0],
        message: `Hex ${hex} é um token brand do DS Grocers — não embuta valor literal.`,
        suggestion: `Use ${brandToken}.`,
      });
    } else if (inkToken) {
      const loc = locate(snippet, m.index);
      out.push({
        rule: "no-hardcoded-ink-color",
        severity: "warning",
        ...loc,
        snippet: m[0],
        message: `Hex ${hex} é um token ink do DS Grocers — não embuta valor literal.`,
        suggestion: `Use ${inkToken}.`,
      });
    }
  }
  return out;
}

function checkArbitraryTailwind(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = /\b(bg|text|border|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|w|h|min-w|min-h|max-w|max-h|gap|rounded|shadow|font|leading|tracking)-\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    out.push({
      rule: "no-arbitrary-tailwind",
      severity: "warning",
      ...locate(snippet, m.index),
      snippet: m[0],
      message: `Valor Tailwind arbitrário '${m[0]}'. Escape do design system.`,
      suggestion:
        "Use uma classe Tailwind mapeada para os tokens Grocers, ou aplique o token CSS via style={{}}.",
    });
  }
  return out;
}

function checkRedAsError(snippet: string): Violation[] {
  const out: Violation[] = [];
  const lower = snippet.toLowerCase();
  const usesBrand =
    /var\(--color-brand-/.test(lower) ||
    /#ff4444|#ed1f1f|#c81616/.test(lower) ||
    /\bbg-red-(?:4|5|6|7)00\b/.test(lower) ||
    /\btext-red-(?:4|5|6|7)00\b/.test(lower);
  if (!usesBrand) return out;

  for (const kw of ERROR_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx === -1) continue;
    const window = lower.slice(Math.max(0, idx - 120), idx + kw.length + 120);
    if (/var\(--color-brand|#ff4444|#ed1f1f|#c81616|bg-red|text-red/.test(window)) {
      out.push({
        rule: "red-is-not-error",
        severity: "warning",
        ...locate(snippet, idx),
        snippet: extractContext(snippet, idx, kw.length),
        message:
          "Uso de vermelho da marca em contexto de erro/validação. " +
          "Neste DS, vermelho é cor de marca/CTA, não cor de erro.",
        suggestion:
          "Use a família semantic danger: var(--color-danger-bg) + var(--color-danger-fg) (âmbar/laranja).",
      });
      break;
    }
  }
  return out;
}

function checkDestructiveButton(snippet: string): Violation[] {
  const out: Violation[] = [];
  const lower = snippet.toLowerCase();

  const destructiveCue = DESTRUCTIVE_KEYWORDS.find((kw) => lower.includes(kw));
  if (!destructiveCue) return out;

  const usesBrandRed =
    /var\(--color-brand-(5|6|7)00/.test(lower) ||
    /#ff4444|#ed1f1f|#c81616/.test(lower) ||
    /variant=["']destructive["']/.test(lower) && /red|brand/.test(lower);

  if (!usesBrandRed) return out;

  const idx = lower.indexOf(destructiveCue);
  out.push({
    rule: "destructive-uses-ink-not-red",
    severity: "warning",
    ...locate(snippet, idx),
    snippet: extractContext(snippet, idx, destructiveCue.length),
    message:
      "Ação destrutiva pintada com vermelho da marca. O padrão Grocers é ink filled + type-to-confirm.",
    suggestion:
      "Use var(--color-ink) como fill do botão e adicione um campo type-to-confirm (ex. 'Digite CANCELAR'). " +
      "Reserve vermelho para destaque/marca, não para perigo.",
  });
  return out;
}

function checkOffScaleRadii(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = /\bborder-radius\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    const value = m[1].trim();
    if (value.includes("var(") || value.endsWith("%") || value === "9999px") continue;
    const numMatch = value.match(/^(\d+)px$/);
    if (!numMatch) continue;
    const px = parseInt(numMatch[1], 10);
    if (VALID_RADII_PX.has(px)) continue;
    out.push({
      rule: "off-scale-radius",
      severity: "warning",
      ...locate(snippet, m.index),
      snippet: m[0].trim(),
      message: `border-radius ${value} fora da escala do DS (4/6/10/14/18/24/pill).`,
      suggestion: "Use var(--radius-xs|sm|md|lg|xl|2xl|pill).",
    });
  }
  return out;
}

function checkOffScaleSpacing(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = /\b(padding|margin|gap)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    const value = m[2].trim();
    if (value.includes("var(") || /\bauto\b/.test(value) || value.includes("%")) continue;
    const parts = value.split(/\s+/);
    for (const part of parts) {
      const numMatch = part.match(/^(\d+)px$/);
      if (!numMatch) continue;
      const px = parseInt(numMatch[1], 10);
      if (VALID_SPACING_PX.has(px)) continue;
      out.push({
        rule: "off-scale-spacing",
        severity: "warning",
        ...locate(snippet, m.index),
        snippet: m[0].trim(),
        message: `Valor ${part} em ${m[1]} fora da escala 4px do DS.`,
        suggestion: "Use var(--space-1..24) — escala em múltiplos de 4px.",
      });
      break;
    }
  }
  return out;
}

function checkHeavyButtonWeight(snippet: string): Violation[] {
  const out: Violation[] = [];
  const lower = snippet.toLowerCase();
  if (!/button|btn|cta/.test(lower)) return out;
  const re = /font-weight\s*:\s*(600|700|bold)\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    out.push({
      rule: "heavy-cta-weight",
      severity: "info",
      ...locate(snippet, m.index),
      snippet: m[0],
      message: "Botões em peso 600+ ficam pesados em Neue Montreal (decisão registrada no chat).",
      suggestion: "Use Medium (500) — var(--fw-medium) — como peso default em CTAs.",
    });
  }
  return out;
}

function checkMissingTabularNums(snippet: string): Violation[] {
  const out: Violation[] = [];
  if (!PRICE_RE.test(snippet)) return out;
  if (/font-variant-numeric\s*:\s*tabular-nums/.test(snippet)) return out;
  if (/\bt-price\b|\bt-price-sm\b/.test(snippet)) return out;
  const match = snippet.match(PRICE_RE)!;
  out.push({
    rule: "missing-tabular-nums",
    severity: "info",
    ...locate(snippet, snippet.indexOf(match[0])),
    snippet: match[0],
    message:
      "Preço/valor monetário sem tabular-nums. Pode causar pulinho visual quando o número muda.",
    suggestion:
      "Aplique a classe semântica .t-price (ou .t-price-sm) ou inclua font-variant-numeric: tabular-nums.",
  });
  return out;
}

function checkNonBrandFont(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = /font-family\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    const value = m[1].toLowerCase();
    if (value.includes("var(--font-")) continue;
    if (value.includes("neue montreal") || value.includes("geist mono") || value.includes("caveat"))
      continue;
    if (value.includes("inherit") || value.includes("initial")) continue;
    out.push({
      rule: "non-brand-font",
      severity: "warning",
      ...locate(snippet, m.index),
      snippet: m[0].trim(),
      message: "font-family fora do sistema Grocers.",
      suggestion:
        "Use var(--font-sans) [Neue Montreal], var(--font-mono) [Geist Mono] ou var(--font-script) [Caveat, só pra wordmark].",
    });
  }
  return out;
}

function checkArbitraryShadow(snippet: string): Violation[] {
  const out: Violation[] = [];
  const re = /box-shadow\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet)) !== null) {
    const value = m[1].trim().toLowerCase();
    if (value.includes("var(--shadow-")) continue;
    if (value === "none") continue;
    out.push({
      rule: "off-scale-shadow",
      severity: "info",
      ...locate(snippet, m.index),
      snippet: m[0].trim(),
      message: "Sombra arbitrária. O DS tem uma escala de sombras tintada com ink.",
      suggestion: "Use var(--shadow-xs|sm|md|lg|xl) ou var(--shadow-focus).",
    });
  }
  return out;
}

export function registerValidateTool(server: McpServer, _index: DesignSystemIndex) {
  server.registerTool(
    "validate_snippet",
    {
      title: "Validate CSS/JSX against the Grocers design system",
      description:
        "Lints a CSS, JSX, TSX, or HTML snippet against Grocers brand invariants and tokens. " +
        "Catches: hardcoded brand hex values, vermelho usado em contexto de erro, botões destrutivos " +
        "em vermelho (devem ser ink + type-to-confirm), escalas fora do padrão (radius/spacing), " +
        "fonts fora de Neue Montreal/Geist Mono, peso pesado (600+) em CTAs, preços sem tabular-nums, " +
        "emoji em UI. " +
        "Run this after composing a UI fragment to catch brand drift before shipping.",
      inputSchema: {
        snippet: z.string().min(1).describe("Source code (CSS, JSX, TSX, or HTML)."),
        language: z
          .enum(["css", "jsx", "tsx", "html", "auto"])
          .optional()
          .describe("Hint the language. 'auto' (default) detects from the source."),
      },
    },
    async ({ snippet, language }) => {
      const _lang =
        language && language !== "auto" ? language : detectLanguage(snippet);
      const violations: Violation[] = [];

      pushAll(violations, checkEmoji(snippet));
      pushAll(violations, checkBrandHexHardcode(snippet));
      pushAll(violations, checkArbitraryTailwind(snippet));
      pushAll(violations, checkRedAsError(snippet));
      pushAll(violations, checkDestructiveButton(snippet));
      pushAll(violations, checkOffScaleRadii(snippet));
      pushAll(violations, checkOffScaleSpacing(snippet));
      pushAll(violations, checkHeavyButtonWeight(snippet));
      pushAll(violations, checkMissingTabularNums(snippet));
      pushAll(violations, checkNonBrandFont(snippet));
      pushAll(violations, checkArbitraryShadow(snippet));

      const errors = violations.filter((v) => v.severity === "error").length;
      const warnings = violations.filter((v) => v.severity === "warning").length;
      const infos = violations.filter((v) => v.severity === "info").length;
      const passed = errors === 0 && warnings === 0;

      return asTextJson({
        passed,
        summary: `${errors} error(s), ${warnings} warning(s), ${infos} info(s)`,
        language: _lang,
        violations,
      });
    },
  );
}
