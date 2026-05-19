# Grocers Mobile — UI Kit

Click-through recreation of the Grocers consumer **mobile app** running inside
an iOS 26 device frame. Tab structure:

`Início` · `Categorias` · `Sacola` · `Perfil`

Tap a product anywhere to open the PDP; "Adicionar" sends you to the cart.

## Files

| File | What |
|---|---|
| `index.html` | Boots React + the app inside `<IOSDevice>`. Open this. |
| `app.jsx` | Tab + screen state, cart fixtures. |
| `components.jsx` | `MHome`, `MCategoriesScreen`, `MProductDetail`, `MCartScreen`, `MProfile`, `MProductTile`, `MAppBar`, `MTabBar`, `MIc` icon set. |
| `ios-frame.jsx` | Device chrome (status bar, dynamic island, home indicator). |
| `data.js` | Shared catalog fixture (mirror of `ui_kits/web/data.js`). |

## Surfaces covered

- Home: location pill, search, IA suggestion card, category chip rail,
  featured grid.
- Categories: horizontal pill rail + 2-column product grid.
- PDP: full-bleed image area, sticky bottom "Adicionar" CTA with stepper.
- Cart: line items with steppers, subtotal/frete/total breakdown, sticky CTA.
- Profile: account info + settings list rows.

## What's intentionally fake

- No real product images — same placeholder strategy as the web kit.
- Search is wired but only filters the fixture catalog.
- Checkout shows a JS alert; no payment surface.

## TODO before production

- Replace placeholder product thumbs with real photography.
- Wire location detection and per-bairro inventory.
- Add the QR / in-store mode mentioned on the marketing site (separate flow).
