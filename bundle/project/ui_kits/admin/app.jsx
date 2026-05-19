/* global React, ReactDOM, Sidebar, TopBar, Dashboard, OrdersScreen, OrderDetail */

function App() {
  const [nav, setNav] = React.useState('dash');
  const [orderId, setOrderId] = React.useState(null);

  const openOrder = (id) => setOrderId(id);
  const closeOrder = () => setOrderId(null);

  let crumbs, screen;
  if (orderId) {
    crumbs = ['Pedidos', `#${orderId}`];
    screen = <OrderDetail orderId={orderId} onBack={closeOrder} />;
  } else if (nav === 'dash') {
    crumbs = ['Visão geral'];
    screen = <Dashboard openOrder={openOrder} setNav={setNav} />;
  } else if (nav === 'orders') {
    crumbs = ['Pedidos'];
    screen = <OrdersScreen openOrder={openOrder} />;
  } else {
    const label = ({
      catalog: 'Catálogo', customers: 'Clientes', promos: 'Promoções',
      stores: 'Lojas', msg: 'Mensagens'
    })[nav] || 'Em breve';
    crumbs = [label];
    screen = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', flexDirection: 'column', gap: 10, color: 'var(--fg-3)' }}>
        <div style={{ font: '500 18px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{label}</div>
        <div style={{ font: '400 13px/1.4 var(--font-sans)' }}>Tela ainda não construída neste UI kit.</div>
      </div>
    );
  }

  // Switching the nav clears the order detail
  const onNavChange = (id) => { setOrderId(null); setNav(id); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <Sidebar nav={nav} setNav={onNavChange} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar crumbs={crumbs} />
        <main style={{ flex: 1 }}>{screen}</main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
