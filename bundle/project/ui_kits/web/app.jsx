/* global React, ReactDOM, CATS, PRODUCTS, Header, CategoryRail, Hero, DealStrip, ProductCard, ProductDetail, CartSheet, Footer, Ic, fmt */

function App() {
  const [active, setActive] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [cart, setCart] = React.useState({ 4: 1, 8: 2, 6: 1 });
  const [cartOpen, setCartOpen] = React.useState(false);
  const [pdpId, setPdpId] = React.useState(null);

  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);

  const inc = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart(c => {
    const n = (c[id] || 0) - 1;
    const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n;
    return next;
  });

  const filtered = React.useMemo(() => {
    return PRODUCTS.filter(p =>
      (active === 'all' || p.cat === active) &&
      (q.trim() === '' || p.n.toLowerCase().includes(q.trim().toLowerCase()))
    );
  }, [active, q]);

  const pdpProduct = pdpId ? PRODUCTS.find(p => p.id === pdpId) : null;
  const activeCatName = CATS.find(c => c.id === active)?.name || 'Tudo';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header q={q} setQ={setQ} cartCount={cartCount} onCartClick={() => setCartOpen(true)} onLogoClick={() => { setPdpId(null); setActive('all'); }} />

      <div style={{ display: 'flex', flex: 1 }}>
        {!pdpId && <CategoryRail cats={CATS} active={active} setActive={setActive} />}

        <main style={{ flex: 1, padding: '20px 32px 32px', maxWidth: 1240, margin: '0 auto', width: '100%' }}>
          {pdpProduct ? (
            <ProductDetail
              p={pdpProduct}
              qty={cart[pdpProduct.id] || 1}
              inc={() => inc(pdpProduct.id)}
              dec={() => dec(pdpProduct.id)}
              onBack={() => setPdpId(null)}
            />
          ) : (
            <>
              {active === 'all' && q === '' && <Hero />}
              <DealStrip />

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ font: '500 11px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6 }}>
                    {q ? `Resultados para "${q}"` : 'Catálogo'}
                  </div>
                  <h1 style={{ font: '600 28px/1.1 var(--font-sans)', letterSpacing: '-0.01em', margin: 0, color: 'var(--fg-1)' }}>
                    {activeCatName} <span style={{ color: 'var(--fg-3)', font: '500 18px/1 var(--font-sans)', marginLeft: 6 }}>· {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}</span>
                  </h1>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--fg-3)' }}>Ordenar por</span>
                  <select style={{
                    height: 36, padding: '0 12px', background: '#fff',
                    border: '1px solid var(--border-2)', borderRadius: 9999,
                    font: '500 13px/1 var(--font-sans)', color: 'var(--fg-1)'
                  }}>
                    <option>Relevância</option>
                    <option>Menor preço</option>
                    <option>Maior desconto</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding: 64, textAlign: 'center', background: '#fff', border: '1px solid var(--border-1)', borderRadius: 18 }}>
                  <div style={{ font: '600 18px/1 var(--font-sans)', color: 'var(--fg-1)', marginBottom: 8 }}>Nada por aqui ainda</div>
                  <div style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--fg-3)' }}>Tente outra categoria ou busca.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  {filtered.map(p => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      qty={cart[p.id] || 0}
                      inc={() => inc(p.id)}
                      dec={() => dec(p.id)}
                      onOpen={() => setPdpId(p.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        products={PRODUCTS}
        inc={inc}
        dec={dec}
      />

      {/* Sticky cart pill (visible if cart has items and sheet closed) */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 20,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          height: 52, padding: '0 20px', background: 'var(--color-brand-500)',
          color: '#fff', border: 0, borderRadius: 9999, cursor: 'pointer',
          font: '500 15px/1 var(--font-sans)', boxShadow: 'var(--shadow-lg)'
        }}>
          {Ic.cart}
          <span>Ver sacola</span>
          <span style={{ font: '400 13px/1 var(--font-sans)', opacity: 0.85, fontVariantNumeric: 'tabular-nums' }}>
            · {cartCount} {cartCount === 1 ? 'item' : 'itens'}
          </span>
        </button>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
