import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type TokenCategory =
  | "color"
  | "spacing"
  | "radius"
  | "shadow"
  | "type-size"
  | "type-weight"
  | "type-tracking"
  | "type-family"
  | "motion"
  | "other";

export interface Token {
  name: string;
  value: string;
  category: TokenCategory;
  group?: string;
  notes?: string;
}

export interface SemanticClass {
  name: string;
  declarations: string;
  raw: string;
}

export interface ComponentEntry {
  kit: "web" | "mobile" | "admin";
  name: string;
  source: string;
  exports: string[];
  file: string;
}

export interface Foundations {
  full: string;
  sections: Record<string, string>;
}

export interface DesignSystemIndex {
  tokens: Token[];
  tokensByName: Map<string, Token>;
  semanticClasses: SemanticClass[];
  components: ComponentEntry[];
  componentsByName: Map<string, ComponentEntry>;
  foundations: Foundations;
  skill: string;
  bundleRoot: string;
}

function detectCategory(name: string): { category: TokenCategory; group?: string } {
  if (name.startsWith("--color-brand")) return { category: "color", group: "brand" };
  if (name.startsWith("--color-ink")) return { category: "color", group: "ink" };
  if (name.startsWith("--color-gray")) return { category: "color", group: "neutrals" };
  if (name.startsWith("--color-success") || name.startsWith("--color-warning") || name.startsWith("--color-danger") || name.startsWith("--color-info"))
    return { category: "color", group: "semantic" };
  if (name.startsWith("--bg-") || name.startsWith("--fg-") || name.startsWith("--border-"))
    return { category: "color", group: "roles" };
  if (name.startsWith("--space-")) return { category: "spacing" };
  if (name.startsWith("--radius-")) return { category: "radius" };
  if (name.startsWith("--shadow-")) return { category: "shadow" };
  if (name.startsWith("--fs-") || name.startsWith("--lh-")) return { category: "type-size" };
  if (name.startsWith("--fw-")) return { category: "type-weight" };
  if (name.startsWith("--tracking-")) return { category: "type-tracking" };
  if (name.startsWith("--font-")) return { category: "type-family" };
  if (name.startsWith("--ease-") || name.startsWith("--duration-")) return { category: "motion" };
  return { category: "other" };
}

function parseCss(css: string): { tokens: Token[]; semanticClasses: SemanticClass[] } {
  const tokens: Token[] = [];
  const semanticClasses: SemanticClass[] = [];

  // Match :root { ... } block
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (rootMatch) {
    const rootBody = rootMatch[1];
    // Strip block comments, but track most-recent comment per line for notes
    const lines = rootBody.split("\n");
    let pendingNote: string | undefined;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      // Section dividers like /* ── Color • Brand ───── */
      const sectionMatch = line.match(/\/\*\s*[─-]+\s*(.+?)\s*[─-]+\s*\*\//);
      if (sectionMatch) {
        pendingNote = sectionMatch[1].replace(/[─•─]+/g, "").trim();
        continue;
      }
      // Inline comment-only line
      const inlineCommentMatch = line.match(/^\/\*\s*(.+?)\s*\*\/$/);
      if (inlineCommentMatch) {
        pendingNote = inlineCommentMatch[1];
        continue;
      }
      const declMatch = line.match(/^(--[a-zA-Z0-9-]+)\s*:\s*([^;]+?)\s*;(?:\s*\/\*\s*(.+?)\s*\*\/)?\s*$/);
      if (declMatch) {
        const [, name, value, trailingComment] = declMatch;
        const { category, group } = detectCategory(name);
        tokens.push({
          name,
          value: value.trim(),
          category,
          group,
          notes: trailingComment ?? pendingNote,
        });
      }
    }
  }

  // Match class declarations after :root closes
  // .t-h1 { ... }
  const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;
  while ((m = classRegex.exec(css)) !== null) {
    const [raw, name, body] = m;
    // Filter out the :root block (already handled)
    if (name === undefined) continue;
    semanticClasses.push({
      name,
      declarations: body.trim().replace(/\s+/g, " "),
      raw: raw.trim(),
    });
  }

  return { tokens, semanticClasses };
}

function extractExports(source: string): string[] {
  const exports: string[] = [];
  const patterns = [
    /export\s+function\s+([A-Za-z_][A-Za-z0-9_]*)/g,
    /export\s+const\s+([A-Za-z_][A-Za-z0-9_]*)/g,
    /export\s+default\s+function\s+([A-Za-z_][A-Za-z0-9_]*)/g,
    /export\s+\{\s*([^}]+?)\s*\}/g,
  ];
  for (const pattern of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(source)) !== null) {
      const cap = m[1];
      if (cap.includes(",")) {
        for (const part of cap.split(",")) {
          const clean = part.trim().split(/\s+as\s+/)[0].trim();
          if (clean && !exports.includes(clean)) exports.push(clean);
        }
      } else if (!exports.includes(cap)) {
        exports.push(cap);
      }
    }
  }
  return exports;
}

function parseComponentsFile(file: string, kit: ComponentEntry["kit"]): ComponentEntry[] {
  const source = readFileSync(file, "utf-8");
  const exports = extractExports(source);

  // Split source by component definitions for individual extraction
  const components: ComponentEntry[] = [];
  const componentDefRegex = /(?:export\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9_]*)\s*[=(]/g;
  const positions: { name: string; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = componentDefRegex.exec(source)) !== null) {
    positions.push({ name: m[1], start: m.index });
  }

  for (let i = 0; i < positions.length; i++) {
    const { name, start } = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1].start : source.length;
    const chunk = source.slice(start, end).trim();
    components.push({
      kit,
      name,
      source: chunk,
      exports: exports.includes(name) ? [name] : [],
      file,
    });
  }

  // Dedupe by name keeping first occurrence
  const seen = new Set<string>();
  return components.filter((c) => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });
}

function parseFoundations(readme: string): Foundations {
  const sections: Record<string, string> = {};
  // Split by ## headings
  const lines = readme.split("\n");
  let currentHeading: string | null = null;
  let currentBuffer: string[] = [];
  const flush = () => {
    if (currentHeading !== null) {
      sections[currentHeading.toLowerCase()] = currentBuffer.join("\n").trim();
    }
  };
  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      flush();
      currentHeading = headingMatch[1].trim();
      currentBuffer = [];
    } else {
      currentBuffer.push(line);
    }
  }
  flush();
  return { full: readme, sections };
}

export function buildIndex(bundleRoot: string): DesignSystemIndex {
  const projectDir = join(bundleRoot, "project");
  const cssPath = join(projectDir, "colors_and_type.css");
  const readmePath = join(projectDir, "README.md");
  const skillPath = join(projectDir, "SKILL.md");

  const css = readFileSync(cssPath, "utf-8");
  const { tokens, semanticClasses } = parseCss(css);

  const readme = readFileSync(readmePath, "utf-8");
  const foundations = parseFoundations(readme);

  const skill = readFileSync(skillPath, "utf-8");

  // Index components from each UI kit
  const kitsDir = join(projectDir, "ui_kits");
  const allComponents: ComponentEntry[] = [];
  for (const kit of ["web", "mobile", "admin"] as const) {
    const kitDir = join(kitsDir, kit);
    try {
      const files = readdirSync(kitDir);
      for (const f of files) {
        if (f.endsWith(".jsx") && f !== "ios-frame.jsx") {
          allComponents.push(...parseComponentsFile(join(kitDir, f), kit));
        }
      }
    } catch {
      // kit dir might not exist (older bundle)
    }
  }

  const tokensByName = new Map(tokens.map((t) => [t.name, t]));
  const componentsByName = new Map(allComponents.map((c) => [`${c.kit}/${c.name}`, c]));

  return {
    tokens,
    tokensByName,
    semanticClasses,
    components: allComponents,
    componentsByName,
    foundations,
    skill,
    bundleRoot,
  };
}
