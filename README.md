# grocers-design-mcp

MCP server exposing the **Grocers Design System** as queryable tools for coding agents.

Hosted on Fly.io. Auth is a single long-lived token embedded in the URL path —
no OAuth, no client config beyond pasting the URL.

**Live:** `https://grocers-design-mcp.fly.dev/<TOKEN>/mcp`
**Health (no auth):** `https://grocers-design-mcp.fly.dev/health`

## What it serves

- **Design tokens** — every CSS custom property from the Grocers DS (colors,
  spacing, radii, shadows, type scale, motion). 101 tokens indexed at boot.
- **Semantic type classes** — `t-h1`, `t-display`, `t-body`, `t-price`, etc.
  (16 ready-to-apply utility classes).
- **UI components** — JSX source from the `web`, `mobile`, and `admin`
  UI kits. 44 components — Dashboard, KpiCard, OrdersScreen, OrderRow,
  CartSheet, MProductTile, etc.
- **Brand foundations** — content rules (tone, casing, no-emoji),
  visual rules (red ≠ error, destructive uses ink + type-to-confirm),
  iconography (Lucide, 2px stroke, 24px grid).
- **Skill manifest** — one-paragraph brand brief for fast agent bootstrap.

## Tools

| Tool | Purpose |
|---|---|
| `list_tokens({category?, group?})` | Discover tokens by category/group |
| `get_token({name})` | Full detail for one token (with `--` prefix) |
| `list_semantic_classes()` | `t-*` pre-built typography classes |
| `list_components({kit?})` | Components by kit (web/mobile/admin) |
| `get_component({name, kit?})` | JSX source + metadata |
| `get_foundations({section?})` | README sections: visual/content/iconography/… |
| `get_skill()` | The SKILL.md manifest |
| `search({query, limit?})` | Full-text search with pt-BR↔en synonyms |
| `validate_snippet({snippet, language?})` | Lint CSS/JSX against 11 brand rules |
| `suggest_component({intent, kit?, include_source?})` | Intent → idiomatic component or pattern |

### Lint rules in `validate_snippet`

| Rule | Severity | Catches |
|---|---|---|
| `no-emoji` | error | Any emoji in source (incl. composed sequences) |
| `no-hardcoded-brand-color` | warning | `#ff4444`, `#ed1f1f`, … → suggests exact token |
| `no-hardcoded-ink-color` | warning | `#0b0119`, `#14081f`, … → suggests exact token |
| `no-arbitrary-tailwind` | warning | `bg-[#ff4444]`, `p-[13px]`, `rounded-[7px]` |
| `red-is-not-error` | warning | Brand red near 'erro/error/invalid' → use danger |
| `destructive-uses-ink-not-red` | warning | Destructive cue + brand red → ink + type-to-confirm |
| `off-scale-radius` | warning | `border-radius` not in {4,6,10,14,18,24,pill} |
| `off-scale-spacing` | warning | `padding/margin/gap` not in 4px scale |
| `non-brand-font` | warning | `font-family` not Neue Montreal/Geist Mono |
| `heavy-cta-weight` | info | `font-weight: 600+` in button context |
| `missing-tabular-nums` | info | `R$ N` without tabular-nums or `.t-price` |
| `off-scale-shadow` | info | `box-shadow` not via `var(--shadow-*)` |

### Intent map in `suggest_component`

30 curated entries spanning all three kits plus 5 non-component patterns
(`destructive-action`, `error-state`, `price-display`, `icon-usage`,
`tone-of-voice`). Kit inference from natural language ("mobile", "painel",
"web") biases the ranking.

## Using with Claude Code

Add to `~/.claude.json` or project `.mcp.json`:

```json
{
  "mcpServers": {
    "grocers-design": {
      "type": "http",
      "url": "https://grocers-design-mcp.fly.dev/<TOKEN>/mcp"
    }
  }
}
```

The token lives in `fly secrets` and rotates via
`fly secrets set GROCERS_MCP_TOKEN=$(openssl rand -hex 32) -a grocers-design-mcp`.

## Quick example flow (agent building a Grocers admin screen)

```
1. get_foundations({section:"visual"})         → brand rules
2. suggest_component({intent:"tabela de pedidos no admin"})
                                                → admin/OrdersScreen
3. suggest_component({intent:"modal de cancelar pedido"})
                                                → pattern destructive-action
                                                  (ink + type-to-confirm)
4. get_component({name:"OrdersScreen", kit:"admin"})
                                                → JSX source
5. validate_snippet({snippet: <composed JSX>})  → catch drift before ship
```

## Local dev

```bash
npm install
GROCERS_MCP_TOKEN="$(openssl rand -hex 32)" PORT=8080 npm run dev
# Health:  http://localhost:8080/health
# MCP:     http://localhost:8080/<TOKEN>/mcp
```

## Architecture

- **Hono** + `@hono/node-server` for HTTP.
- **@modelcontextprotocol/sdk** for JSON-RPC / streamable HTTP transport,
  stateless mode (fresh `McpServer` per request — no session state).
- **Token-in-URL** middleware: `timingSafeEqual` against
  `GROCERS_MCP_TOKEN`; wrong token returns 404 (not 401 — hides existence).
- The DS bundle ships inside the container at `bundle/` and is indexed
  once at boot into in-memory maps (O(1) lookups).
- Fly app runs 2 machines (HA) in `gru`, 256MB each, auto-stops when idle.

## Deploy

```bash
fly deploy -a grocers-design-mcp --remote-only
```

## Layout

```
bundle/                              # Grocers DS handoff bundle (source of truth)
  project/
    colors_and_type.css              # all design tokens
    README.md                        # foundations
    SKILL.md                         # one-paragraph brand brief
    ui_kits/{web,mobile,admin}/      # React/JSX components
    preview/*.html                   # visual specimens (not served by MCP)
src/
  index.ts                           # entrypoint
  server.ts                          # Hono app + token middleware
  indexer.ts                         # CSS + JSX + README parser
  tools/
    tokens.ts                        # list_tokens, get_token, list_semantic_classes
    components.ts                    # list_components, get_component
    foundations.ts                   # get_foundations, get_skill
    search.ts                        # search (synonym-aware)
    validate.ts                      # validate_snippet (11 rules)
    suggest.ts                       # suggest_component (30 entries)
Dockerfile
fly.toml
```

## Roadmap

Out of scope for v0.3, candidates for next iteration:
- Multi-theme support (Zona Sul and other clients as override layers).
- `validate_snippet`: semantic copy lint (e.g. "Erro: ..." string detection).
- `suggest_component`: broader UI primitive coverage (TableHeader, Pagination
  states, EmptyState variants).
- `get_screen(name)`: return a parent component + all its children in one call.
- shadcn/ui compatibility layer (map Grocers semantic tokens →
  `--primary`/`--background` etc.).
