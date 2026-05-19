# Grocers — Design System

A design system for **Grocers**, a Brazilian B2B SaaS platform that gives
supermarket chains a unified online + offline commerce stack (app, web
e-commerce, virtual assistant, in-store experiences, B2B, automated messages).
The product positions itself as an AI-first innovation layer for grocery retail
— partnerships with **Microsoft**, **OpenAI** and **GPT** are featured
prominently, and the case study on the marketing site is Brazilian chain
**Zona Sul**.

Tone is **crisp & utilitarian** in spirit (Instacart / Amazon Fresh) but the
brand identity is more **distinctive**: a handwritten "grocers" wordmark in
white with a signature **red dot** anchors the system, set against deep plum
near-black. Copy is in **Brazilian Portuguese**.

---

## Sources used

- Marketing site: <https://grocers.io/> — landing page copy, asset URLs, product
  taxonomy. Fetched May 2026.
- Logo file provided by brand owner → `assets/logo.png` (white wordmark + red dot).
- Brand colors provided directly:
  - Primary red `#FF4444`
  - White `#FFFFFF`
  - Deep plum `#0B0119`
- Typography provided directly: **Neue Montreal** (primary), generic
  **sans-serif** (secondary).

## 🚩 FLAGS / open items

1. **Remote product imagery not downloaded.** Logos and screenshots from
   `https://grocers.io/assets/*` are referenced via URL throughout previews
   and the UI kits (image sandboxing in this environment blocked download).
   When you sync, run `wget -r -np -nH --cut-dirs=1 -P assets/
   https://grocers.io/assets/` or import the source codebase via the Import
   menu so they get committed locally.
2. **No source codebase or Figma** was provided — UI kit screens are
   recreations informed by the marketing site's product taxonomy and your
   "Instacart/Amazon Fresh" reference. Real component code from the live
   product would tighten this up considerably.

---

## Index

| Path | What's there |
|---|---|
| `README.md` | This file — context, content rules, visual foundations, iconography |
| `SKILL.md` | Agent Skill metadata so this folder can be loaded as a Claude Skill |
| `colors_and_type.css` | All design tokens: colors, typography, spacing, radii, shadows, motion |
| `assets/logo.png` | Wordmark — white "grocers" + red dot, designed for dark backgrounds |
| `assets/` | (TODO) product imagery from grocers.io |
| `fonts/` | Neue Montreal `.otf` files (8 weights/styles) wired via `@font-face` |
| `preview/` | Small HTML cards that populate the Design System tab |
| `ui_kits/web/` | Consumer web app (e-commerce) — `index.html` + JSX components |
| `ui_kits/mobile/` | Consumer mobile app — iOS frame demo + JSX components |

---

## Content fundamentals

Grocers writes for **decision-makers at supermarket chains** (CMOs, heads of
digital, CEOs) on the marketing side, and for **end-shopper consumers** in the
product. Tone is **confident, data-led, faintly aspirational** on marketing;
**short, direct, friendly** in the product.

**Language:** Brazilian Portuguese, second-person formal (você, seu). English
only for product names ("E-Commerce", "App", "HUB de integrações") and
partner names.

**Casing:** **Sentence case** for headings and buttons ("Agende uma reunião",
"Aumente de 5 a 20% seu faturamento"). UPPERCASE only for eyebrows / tiny
section labels. Product surface names use Title Case ("App", "E-Commerce",
"Assistente Virtual", "Experiências em Lojas", "E-Commerce B2B", "Mensagens
automatizadas").

**Person:** Brand speaks as "Grocers" or "a plataforma" in third person on
marketing surfaces; uses "você / seu supermercado" when addressing the customer.
First-person plural ("nós", "nossa") shows up in customer-quote contexts.

**Emoji:** Not used. Avoid in product UI too — it cheapens the utilitarian tech
vibe. Use icons instead.

**Punctuation & numbers:** Percentages stick to the number (`30%`, not `30 %`).
Currency uses `R$ 89,90` (BR convention, comma decimal, period thousands).
Ranges use `de X a Y` ("de 5 a 20%"). Statistics get pulled into display type
for emphasis.

**Vibe in one sentence:** *McKinsey-grade promises with a friendly handwritten
signature.*

### Example copy (from the live site)

- Headline: **"Tecnologia para liderar o varejo alimentício"**
- Subhead: *"Do online ao físico: uma plataforma unificada para revolucionar a experiência do cliente e impulsionar seus resultados."*
- CTA: **Agende uma reunião**
- Stat: **"66% dos clientes já compram supermercado online todos os dias."**
- Value-prop: *"Aumente de 5 a 20% seu faturamento total"*
- Pull-quote: *"Supermercados que utilizam Inteligência artificial veem um aumento de até 30% na receita por cliente e 40% a mais em fidelização." — McKinsey & Company*

### Microcopy patterns (for product UI)

- Empty cart: *"Sua sacola está vazia"*
- Search placeholder: *"Buscar em mais de 12.000 produtos"*
- Loading: *"Carregando..."* — never spinner-only
- Errors: short, owned ("Não conseguimos finalizar seu pedido. Tente novamente.")
- Success: short, neutral ("Pedido confirmado")
- Address picker: *"Onde você quer receber?"*

---

## Visual foundations

### Colors

- **Brand red `#FF4444`** is the only saturated color that ever owns a CTA, a
  primary stat, or the dot in the logo. Pair with white or ink — never with
  another saturated hue.
- **Deep plum / ink `#0B0119`** is the inverse surface and the darkest text
  token. It's almost-black with a cool purple undertone, which is what makes
  the red pop instead of feeling neon.
- **White `#FFFFFF`** is canvas and surface in the product. The brand
  itself is dark-mode-leaning on marketing — hero sections live on
  `#0B0119`, body content on white.
- **Neutrals** are a cool gray scale with a faint plum cast so they harmonize
  with the ink rather than fighting it. Don't substitute warm grays.
- **Semantic** colors stick to muted pastel-bg + saturated-fg. Danger reuses
  the brand red family (deeper, `#C81616`), which keeps the palette tight.
- **No gradients** on UI chrome. The marketing site uses full-bleed product
  photography over dark plum with a slight bottom vignette for legibility —
  that's the only gradient pattern.

### Type

- **Neue Montreal** (Pangram Pangram) — modern grotesque, used for everything
  UI. Loaded from `/fonts/` via `@font-face` in 8 weight/style combinations
  (Light 300, Regular 400, Medium 500, Bold 600/700, plus italics).
- Mono (**Geist Mono**) for SKUs, prices in dense tables, and code.
- **Caveat** (Google Fonts) is a *narrow* secondary script reserved for
  echoing the logo wordmark — e.g. a "feito à mão" / handwritten signature in
  marketing surfaces. Never use it for UI or running copy.
- **Display weights** are 600 with `-0.02em` tracking — never lighter than
  500 at big sizes.
- **Body** is 400. Secondary text moves to `--fg-2` (color), not lower weight.
- Tabular numerals (`font-variant-numeric: tabular-nums`) are mandatory on
  prices, quantities, order totals.

### Spacing

4px scale (`--space-1` through `--space-24`). Component padding pulls from
the scale; never use arbitrary px values inside components.

### Backgrounds

- **Product UI**: light. White surfaces on `--bg-canvas` (faint plum-tinted
  off-white).
- **Marketing**: dark. Hero panels live on `--bg-inverse` (`#0B0119`) with
  white type and the brand red accent.
- **No repeating patterns, textures, or hand-drawn illustrations** — except
  the script logo itself, which is the only place "human warmth" enters.

### Borders

- `1px solid var(--border-1)` is the default. Stronger borders
  (`var(--border-2)`) only show up on hover/focus states or active filter
  chips.
- **Border radius scale:** 4 / 6 / 10 / 14 / 18 / 24 / pill. Buttons use
  `--radius-md` (10px). Cards use `--radius-lg` (14px). Modals use
  `--radius-xl` (18px). Product tiles use `--radius-lg`.

### Shadows

Cool, low, layered, tinted with ink (rgba(11,1,25,…)) rather than pure black —
this keeps shadows from going greenish on the plum-tinted neutrals.
`--shadow-xs` resting, `--shadow-sm` hover, `--shadow-md` popovers,
`--shadow-lg` sheets. Focus ring is a 4px brand-red tint
(`--shadow-focus`).

### Hover / press / focus

- **Hover:** primary CTA → `--color-brand-600` (one step darker). Neutral
  surfaces → `--bg-subtle`. Never opacity-only hovers on interactive controls.
- **Press:** scale 0.98 for icon buttons; color one step darker (700) for
  primary CTAs. ~120ms.
- **Focus:** always-visible 2px ring on keyboard focus
  (`--shadow-focus`). Use `:focus-visible` so mouse clicks don't show the
  ring.
- **Disabled:** `--fg-4` text on `--bg-subtle` surface; no pointer cursor.

### Motion

- **Standard easing**: `cubic-bezier(0.2, 0, 0, 1)`.
- **Durations**: 120ms (micro), 180ms (default), 240ms (sheet/drawer
  entries).
- **No bounces** on chrome. Brand is "innovation + speed", not "fun".
- Page transitions: cross-fade only. No slide-ins on web.
- Mobile sheet transitions: standard iOS spring.

### Layout rules

- **Web**: fixed `--header-h: 64px` top nav, optional 280px category rail on
  catalog screens. Content max-width `1280px` with `--space-6` gutters.
- **Mobile**: 56px top app bar, 60px bottom tab bar, full-width content with
  `--space-4` horizontal padding.
- **Sticky CTAs**: floating "Ver sacola" pill on mobile sits 80px above the
  tab bar with `--shadow-lg`.

### Cards

- Surface: `--bg-surface`. Border: `1px solid var(--border-1)`. Radius:
  `--radius-lg`. Shadow: `--shadow-xs` resting, `--shadow-sm` on hover.
- Product tiles: image on top (1:1, padded interior), title + unit beneath,
  price block, add-to-cart stepper or `+` pill at bottom-right.
- **No colored left-border accent cards.** Don't.

### Transparency & blur

- Used sparingly: only on bottom-sheet scrims (`rgba(11,1,25,0.6)` + 4px
  backdrop-blur) and the in-store-mode "scan card" overlay.
- Not used on chrome, headers, or cards.

---

## Iconography

The marketing site uses **photography and illustrated product mocks**, not a
visible UI icon set. For product UI we standardize on:

- **System:** **[Lucide](https://lucide.dev)** — stroke-based, 2px weight,
  24px grid. Open source, friendly Portuguese-localizable naming, sits well
  next to the Neue Montreal type. **CDN-served** — no local copies needed.
- **Weight & sizing:** 2px stroke at 20px/24px sizes; `stroke-width="1.5"`
  on dense layouts (table rows, dense lists).
- **Color:** `currentColor` always. Default `--fg-2`, active `--fg-1`,
  brand-tinted `--fg-brand` only when an icon is acting *as* a control's
  identity (e.g. the cart icon in the header).
- **Emoji:** Do not use in product or marketing UI.
- **Unicode glyphs:** Avoid. Use Lucide for arrows, chevrons, checks, etc.
- **Custom marks:** The Grocers wordmark (`assets/logo.png`) is the only
  bespoke brand mark. Partner logos (Microsoft, OpenAI, GPT, Zona Sul) drop
  in flat at small scale, desaturated to gray when used as a "trusted by"
  strip.

### When you need a glyph Lucide doesn't ship

1. Check Lucide for the closest semantic match.
2. If absent, draw a 24px-grid SVG matching Lucide's stroke metrics
   (`stroke-width: 2`, round caps + joins, 24×24 viewBox).
3. Drop it in `assets/icons/` and namespace it: `icon-frozen.svg`.
