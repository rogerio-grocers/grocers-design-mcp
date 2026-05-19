# grocers-design-mcp

MCP server exposing the **Grocers Design System** as queryable tools for coding agents.

Hosted on Fly.io. Auth is a single long-lived token embedded in the URL path —
no OAuth, no client config beyond pasting the URL.

## What it serves

- **Design tokens** — every CSS custom property from the Grocers DS (colors,
  spacing, radii, shadows, type scale, motion).
- **Semantic type classes** — `t-h1`, `t-display`, `t-body`, `t-price`, etc.
- **UI components** — React/JSX source from the `web`, `mobile`, and `admin`
  UI kits (Dashboard, Pedidos, ProductTile, CartSheet, KpiCard, …).
- **Brand foundations** — content rules (tone, casing, no-emoji),
  visual rules (red ≠ error, destructive uses ink + type-to-confirm),
  iconography (Lucide, 2px stroke).
- **Skill manifest** — one-paragraph brand brief for quick agent bootstrap.

## Tools exposed

| Tool | What it does |
|---|---|
| `list_tokens` | All design tokens, optional category/group filter |
| `get_token` | Full detail for one token |
| `list_semantic_classes` | Pre-built `t-*` typography classes |
| `list_components` | All components, optional kit filter |
| `get_component` | JSX source + metadata for a component |
| `get_foundations` | Brand README, optional section filter |
| `get_skill` | The SKILL.md manifest |
| `search` | Full-text search across all of the above |

Roadmap: `validate_snippet` (v0.2 — lint a CSS/JSX trecho against the brand)
and `suggest_component` (v0.3 — map intent to the idiomatic Grocers pattern).

## Using with Claude Code

Add to your `~/.claude.json` or project `.mcp.json`:

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

The token lives in `fly secrets` and is rotated by re-running
`fly secrets set GROCERS_MCP_TOKEN=...`.

## Local dev

```bash
npm install
GROCERS_MCP_TOKEN="$(openssl rand -hex 32)" PORT=8080 npm run dev
# Health:  http://localhost:8080/health
# MCP:     http://localhost:8080/<TOKEN>/mcp
```

## Architecture

- **Hono** + `@hono/node-server` for the HTTP layer.
- **@modelcontextprotocol/sdk** for the JSON-RPC / streamable-HTTP transport,
  in stateless mode (fresh `McpServer` per request).
- **Token-in-URL** middleware: `safeCompare` against `GROCERS_MCP_TOKEN`,
  wrong token returns 404 (not 401 — hides existence).
- The DS bundle ships inside the container at `bundle/` and is indexed once at
  boot into in-memory maps for O(1) lookups.

## Deploy

```bash
fly secrets set GROCERS_MCP_TOKEN="$(openssl rand -hex 32)" -a grocers-design-mcp
fly deploy -a grocers-design-mcp
```

## Layout

```
bundle/                      # Grocers DS handoff bundle (source of truth)
  project/
    colors_and_type.css      # all design tokens
    README.md                # foundations
    SKILL.md                 # one-paragraph brand brief
    ui_kits/{web,mobile,admin}/   # React/JSX components
    preview/*.html           # visual specimens (not served by MCP)
src/
  index.ts                   # entrypoint
  server.ts                  # Hono app + token middleware
  indexer.ts                 # CSS + JSX + README parser
  tools/                     # MCP tool implementations
Dockerfile
fly.toml
```
