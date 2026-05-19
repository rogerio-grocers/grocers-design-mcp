/* global React, ReactDOM, CATS, PRODUCTS, IOSDevice, MAppBar, MTabBar, MHome, MCategoriesScreen, MProductDetail, MCartScreen, MProfile */

function MobileApp() {
  const [tab, setTab] = React.useState('home');
  const [catFilter, setCatFilter] = React.useState('all');
  const [pdpId, setPdpId] = React.useState(null);
  const [cart, setCart] = React.useState({ 4: 1, 8: 2 });

  const inc = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart(c => {
    const n = (c[id] || 0) - 1;
    const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n;
    return next;
  });
  const qtyOf = (id) => cart[id] || 0;
  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);

  const pdpProduct = pdpId ? PRODUCTS.find(p => p.id === pdpId) : null;

  let screen;
  let title = null;
  let onBack = null;

  if (pdpProduct) {
    screen = <MProductDetail
      p={pdpProduct}
      qty={cart[pdpProduct.id] || 1}
      inc={() => inc(pdpProduct.id)}
      dec={() => dec(pdpProduct.id)}
      onBack={() => setPdpId(null)}
      onCart={() => { setPdpId(null); setTab('cart'); }}
    />;
  } else if (tab === 'home') {
    screen = <MHome setTab={setTab} setCatFilter={setCatFilter} openProduct={setPdpId} inc={inc} qtyOf={qtyOf} />;
  } else if (tab === 'cats') {
    title = 'Categorias';
    screen = <MCategoriesScreen catFilter={catFilter} setCatFilter={setCatFilter} openProduct={setPdpId} inc={inc} qtyOf={qtyOf} />;
  } else if (tab === 'cart') {
    title = 'Sua sacola';
    screen = <MCartScreen items={cart} inc={inc} dec={dec} setTab={setTab} onCheckout={() => alert('Checkout (demo)')} />;
  } else if (tab === 'me') {
    title = 'Perfil';
    screen = <MProfile />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 47 /* room for status bar */ }} />
      {title && <MAppBar title={title} onBack={onBack} />}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>{screen}</div>
      {!pdpProduct && <MTabBar tab={tab} setTab={setTab} cartCount={cartCount} />}
      <div style={{ height: 22 /* room for home indicator */ }} />
    </div>
  );
}

function Stage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 48, padding: 40, background: 'var(--bg-canvas)',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(11,1,25,0.05), transparent 60%)'
    }}>
      <IOSDevice width={402} height={874}>
        <MobileApp />
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Stage />);
