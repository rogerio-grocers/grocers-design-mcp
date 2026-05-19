# Grocers Web — UI Kit

Click-through recreation of the Grocers consumer **web e-commerce** surface.
The flow goes:

`Home` → category browse → product detail → cart → checkout (read-only).

## Files

| File | What |
|---|---|
| `index.html` | Boots React + the app. Open this. |
| `app.jsx` | Top-level shell, screen routing, fake state. |
| `components.jsx` | Header, Sidebar, ProductCard, ProductDetail, CartSheet, Footer, primitives. |
| `data.js` | Fixture catalog (categories, products) — purely cosmetic. |

## Components covered

- `<Header>` — logo, location pill, search, account, cart.
- `<CategoryRail>` — sticky 280px category sidebar.
- `<Hero>` — full-bleed dark hero with deal positioning.
- `<ProductCard>` — catalog grid tile with `+` stepper.
- `<ProductDetail>` — PDP layout (gallery, title, price block, controls).
- `<CartSheet>` — right-side drawer with line items + totals.
- `<EmptyState>` — generic empty pattern.
- `<DealStrip>` — accent strip with rotating "Oferta da semana" messages.
- `<Footer>` — dark-mode marketing footer.

## What's intentionally fake

- No real product images — we use a CSS placeholder + grocery icon. When the
  real codebase or product CDN is hooked up, swap the `<ProductImage>` for a
  real `<img>`.
- Search returns the same fixture catalog regardless of query.
- Checkout is a static read-only screen; no payment flow.

## TODO before this is production-ready

- Drop in **Neue Montreal** webfont files and remove the Geist `@import`.
- Replace placeholder thumbs with real product photography.
- Wire real category taxonomy from the live catalog.
