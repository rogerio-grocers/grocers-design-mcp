---
name: grocers-design
description: Use this skill to generate well-branded interfaces and assets for Grocers, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available
files: `colors_and_type.css` for design tokens, `preview/` for component
specimens, `ui_kits/web/` and `ui_kits/mobile/` for component recreations,
`assets/` for the wordmark and any imagery.

The brand identity in one line: **Brazilian Portuguese, crisp & utilitarian
like Instacart/Amazon Fresh, anchored by a handwritten "grocers" wordmark
with a signature red dot — set against deep plum `#0B0119` and white.**

Key constants:

- Brand red `#FF4444`, ink `#0B0119`, white `#FFFFFF`.
- Production font: **Neue Montreal** (Pangram Pangram), loaded from
  `fonts/*.otf` via `@font-face` in `colors_and_type.css`.
- Iconography: **Lucide** (CDN), 24px / 2px stroke, currentColor.
- Voice: confident, data-led, sentence-case; no emoji; first-person plural
  in customer quotes; second-person formal ("você", "seu") to the customer.
- Layout: white surfaces on light canvas in product UI; dark plum hero
  panels on marketing.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.),
copy assets out and create static HTML files for the user to view. Link
`colors_and_type.css` directly when possible so any future token change
propagates to your artifact.

If working on production code, copy assets and read the rules here to
become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what
they want to build or design, ask some questions, and act as an expert
designer who outputs HTML artifacts _or_ production code, depending on the
need.

## Quick references

- `README.md` — content fundamentals, visual foundations, iconography rules
- `colors_and_type.css` — every design token as CSS custom properties
- `preview/*.html` — small visual specimens for type/color/spacing/components/brand
- `ui_kits/web/index.html` — interactive e-commerce recreation
- `ui_kits/mobile/index.html` — interactive mobile app recreation (in iOS frame)
- `assets/logo.png` — wordmark (white on dark / red surfaces only)
