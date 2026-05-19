/* global React, ORDERS, STATUS_META, PAYMENT_META, ORDER_ITEMS */

// ─── Icons ───────────────────────────────────────────────────────────────────
const AIc = {
  search:  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  bell:    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  chev:    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  chevD:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  more:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>,
  arrowUp: <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 17 10-10M7 7h10v10"/></svg>,
  arrowDn: <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10M17 7v10H7"/></svg>,
  back:    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  cal:     <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  filter:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/></svg>,
  download:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  print:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>,
  msg:     <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  pin:     <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  truck:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1"/></svg>,
  check:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { id: 'dash',     label: 'Visão geral', count: null,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg> },
  { id: 'orders',   label: 'Pedidos', count: 247,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> },
  { id: 'catalog',  label: 'Catálogo', count: null,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { id: 'customers',label: 'Clientes', count: null,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg> },
  { id: 'promos',   label: 'Promoções', count: 3,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg> },
  { id: 'stores',   label: 'Lojas', count: null,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 1.65-2.7A2 2 0 0 1 5.37 3.5h13.27a2 2 0 0 1 1.71.8L22 7"/><path d="M2 7v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7"/><path d="M2 7h20"/><path d="M9 13h6"/></svg> },
  { id: 'msg',      label: 'Mensagens', count: null,
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
];

const Sidebar = ({ nav, setNav }) => (
  <aside style={{
    width: 240, flex: '0 0 240px', background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-1)', padding: '20px 12px',
    display: 'flex', flexDirection: 'column', gap: 2,
    position: 'sticky', top: 0, height: '100vh'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px 18px' }}>
      <img src="../../assets/logo.png" alt="Grocers" style={{ height: 24 }} />
      <span style={{ marginLeft: 8, font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Admin</span>
    </div>
    {SIDEBAR_ITEMS.map(it => {
      const sel = it.id === nav;
      return (
        <button key={it.id} onClick={() => setNav(it.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10, height: 38,
          padding: '0 12px', borderRadius: 10,
          background: sel ? 'var(--bg-inverse)' : 'transparent',
          color: sel ? '#fff' : 'var(--fg-1)', border: 0,
          font: `${sel ? 500 : 400} 14px/1 var(--font-sans)`, textAlign: 'left', cursor: 'pointer'
        }}>
          <span style={{ color: sel ? 'var(--color-brand-500)' : 'var(--fg-3)', display: 'inline-flex' }}>{it.icon}</span>
          <span style={{ flex: 1 }}>{it.label}</span>
          {it.count != null && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', height: 18,
              padding: '0 6px', borderRadius: 9999,
              background: sel ? 'rgba(255,255,255,0.15)' : 'var(--bg-subtle)',
              color: sel ? '#fff' : 'var(--fg-2)',
              font: '500 10px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums'
            }}>{it.count}</span>
          )}
        </button>
      );
    })}
    <div style={{ flex: 1 }} />
    <button style={{
      display: 'flex', alignItems: 'center', gap: 10, height: 38,
      padding: '0 12px', borderRadius: 10, background: 'transparent',
      color: 'var(--fg-2)', border: 0,
      font: '400 13px/1 var(--font-sans)', textAlign: 'left', cursor: 'pointer'
    }}>
      <span style={{ color: 'var(--fg-3)', display: 'inline-flex' }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33"/></svg>
      </span>
      Configurações
    </button>
  </aside>
);

// ─── Top Bar ─────────────────────────────────────────────────────────────────
const TopBar = ({ crumbs }) => (
  <header style={{
    display: 'flex', alignItems: 'center', gap: 16, height: 60,
    padding: '0 24px', background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-1)', position: 'sticky', top: 0, zIndex: 5
  }}>
    <nav style={{ display: 'flex', alignItems: 'center', gap: 8, font: '400 13px/1 var(--font-sans)', color: 'var(--fg-3)' }}>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--fg-4)' }}>{AIc.chev}</span>}
          <span style={{ color: i === crumbs.length - 1 ? 'var(--fg-1)' : 'var(--fg-3)', fontWeight: i === crumbs.length - 1 ? 500 : 400 }}>{c}</span>
        </React.Fragment>
      ))}
    </nav>
    <div style={{ flex: 1 }} />
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, width: 260,
      padding: '0 12px', background: 'var(--bg-subtle)', borderRadius: 9999, color: 'var(--fg-3)'
    }}>
      {AIc.search}
      <span style={{ font: '400 13px/1 var(--font-sans)' }}>Buscar pedidos, clientes...</span>
      <span style={{ marginLeft: 'auto', font: '500 10px/1 var(--font-mono)', color: 'var(--fg-4)', border: '1px solid var(--border-2)', borderRadius: 4, padding: '2px 5px' }}>⌘K</span>
    </div>
    <button style={{
      width: 36, height: 36, borderRadius: 9999, background: 'transparent',
      border: 0, color: 'var(--fg-2)', position: 'relative', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {AIc.bell}
      <span style={{ position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--color-brand-500)', border: '2px solid var(--bg-surface)' }} />
    </button>
    <div style={{ height: 24, width: 1, background: 'var(--border-1)' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9999, background: 'var(--bg-inverse)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '500 12px/1 var(--font-sans)' }}>VP</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ font: '500 13px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>Vitor Pereira</span>
        <span style={{ font: '400 11px/1.2 var(--font-sans)', color: 'var(--fg-3)' }}>Zona Sul · Admin</span>
      </div>
      <span style={{ color: 'var(--fg-3)' }}>{AIc.chevD}</span>
    </div>
  </header>
);

// ─── Status pill ─────────────────────────────────────────────────────────────
const StatusPill = ({ meta, dot = true, small = false }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    height: small ? 22 : 24, padding: small ? '0 10px' : '0 11px',
    borderRadius: 9999, background: meta.bg, color: meta.fg,
    border: `1px solid ${meta.bd}`, font: `500 ${small ? 11 : 12}px/1 var(--font-sans)`,
    letterSpacing: '0.015em', whiteSpace: 'nowrap'
  }}>
    {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.fg }} />}
    {meta.label}
  </span>
);

// ─── KPI card ────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, delta, up, path }) => (
  <div style={{
    flex: 1, background: '#fff', border: '1px solid var(--border-1)',
    borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column',
    gap: 8, boxShadow: 'var(--shadow-xs)'
  }}>
    <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ font: '500 26px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color: 'var(--fg-1)' }}>{value}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, font: '500 12px/1 var(--font-sans)', color: up ? 'var(--color-success-fg)' : 'var(--color-warning-fg)' }}>
        {up ? AIc.arrowUp : AIc.arrowDn}{delta}
      </span>
    </div>
    <svg viewBox="0 0 140 40" style={{ width: '100%', height: 36, marginTop: 'auto' }}>
      <path d={path} fill="none" stroke={up ? 'var(--color-success-fg)' : 'var(--color-warning-fg)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// ─── GMV Chart card ──────────────────────────────────────────────────────────
const GmvChart = () => (
  <div style={{ flex: 2, background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-xs)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div>
        <div style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--fg-3)' }}>GMV últimos 7 dias</div>
        <div style={{ font: '500 24px/1 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--fg-1)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>R$ 1.284.302</div>
      </div>
      <div style={{ display: 'flex', gap: 14, font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-ink)' }} />Esta semana</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-brand-300)' }} />Semana passada</span>
      </div>
    </div>
    <svg viewBox="0 0 560 160" style={{ width: '100%', height: 160 }}>
      <defs>
        <linearGradient id="gmvg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0B0119" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#0B0119" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="var(--border-1)" strokeDasharray="3 4">
        <line x1="0" y1="40" x2="560" y2="40" />
        <line x1="0" y1="80" x2="560" y2="80" />
        <line x1="0" y1="120" x2="560" y2="120" />
      </g>
      <path d="M0,110 C60,85 100,92 160,68 C220,44 260,76 320,52 C380,30 420,50 480,34 L560,22" fill="none" stroke="#0B0119" strokeWidth="2" strokeLinecap="round" />
      <path d="M0,110 C60,85 100,92 160,68 C220,44 260,76 320,52 C380,30 420,50 480,34 L560,22 L560,160 L0,160 Z" fill="url(#gmvg)" />
      <path d="M0,120 C60,115 100,104 160,98 C220,90 260,102 320,90 C380,76 420,90 480,72 L560,66" fill="none" stroke="var(--color-brand-300)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 5" />
      <g fontSize="10" fontFamily="var(--font-sans)" fill="var(--fg-3)">
        {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((d,i) => <text key={d} x={10 + i*92} y="155">{d}</text>)}
      </g>
    </svg>
  </div>
);

// ─── Order Table Row (compact) ───────────────────────────────────────────────
const OrderRow = ({ o, onOpen, dense = false }) => (
  <div onClick={onOpen} style={{
    display: 'grid',
    gridTemplateColumns: '140px 1.4fr 1fr 90px 110px 40px',
    alignItems: 'center', height: dense ? 50 : 56, padding: '0 18px',
    borderTop: '1px solid var(--border-1)',
    font: '400 13px/1 var(--font-sans)', color: 'var(--fg-1)',
    cursor: 'pointer', background: '#fff', transition: 'background 120ms'
  }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-canvas)'}
    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
    <span style={{ font: '400 13px/1 var(--font-mono)', color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>#{o.id}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span>{o.cust}</span>
      <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{o.store}</span>
    </div>
    <span><StatusPill meta={STATUS_META[o.status]} small /></span>
    <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)' }}>{o.items}</span>
    <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-1)', fontWeight: 500 }}>{fmt(o.total)}</span>
    <span style={{ display: 'inline-flex', justifyContent: 'flex-end', color: 'var(--fg-3)' }} onClick={e => e.stopPropagation()}>{AIc.more}</span>
  </div>
);

const OrderTableHeader = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '140px 1.4fr 1fr 90px 110px 40px',
    alignItems: 'center', height: 40, padding: '0 18px',
    background: 'var(--bg-subtle)',
    font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)',
    textTransform: 'uppercase', letterSpacing: '.06em'
  }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>Pedido <span style={{ color: 'var(--fg-4)' }}>↓</span></span>
    <span>Cliente</span>
    <span>Status</span>
    <span style={{ textAlign: 'right' }}>Itens</span>
    <span style={{ textAlign: 'right' }}>Total</span>
    <span />
  </div>
);

// ─── Filter / tab bar for orders list ────────────────────────────────────────
const TABS = [
  { id: 'all',       label: 'Todos',         count: 247 },
  { id: 'new',       label: 'Novos',         count: 12 },
  { id: 'picking',   label: 'Em separação',  count: 38 },
  { id: 'transit',   label: 'Em rota',       count: 47 },
  { id: 'delivered', label: 'Entregues',     count: 142 },
  { id: 'canceled',  label: 'Cancelados',    count: 8 },
];

const FilterTabs = ({ tab, setTab }) => (
  <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-1)', padding: '0 24px', background: 'var(--bg-surface)' }}>
    {TABS.map(t => {
      const sel = t.id === tab;
      return (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, height: 44,
          padding: '0 14px', background: 'transparent', border: 0,
          borderBottom: `2px solid ${sel ? 'var(--color-ink)' : 'transparent'}`,
          marginBottom: -1, font: `${sel ? 500 : 400} 13px/1 var(--font-sans)`,
          color: sel ? 'var(--fg-1)' : 'var(--fg-2)', cursor: 'pointer'
        }}>
          {t.label}
          <span style={{
            display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 6px',
            borderRadius: 9999,
            background: sel ? 'var(--bg-inverse)' : 'var(--bg-subtle)',
            color: sel ? '#fff' : 'var(--fg-2)',
            font: '500 10px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums'
          }}>{t.count}</span>
        </button>
      );
    })}
  </div>
);

const FilterBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px', flexWrap: 'wrap' }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', background: '#fff', border: '1px solid var(--border-2)', borderRadius: 10, color: 'var(--fg-1)', font: '500 13px/1 var(--font-sans)' }}>{AIc.cal}<span>15 mai – 21 mai, 2026</span></div>
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', background: '#fff', border: '1px solid var(--border-2)', borderRadius: 10, color: 'var(--fg-1)', font: '500 13px/1 var(--font-sans)', cursor: 'pointer' }}>
      {AIc.filter}Filtros
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 6px', borderRadius: 9999, background: 'var(--color-brand-500)', color: '#fff', font: '500 10px/1 var(--font-sans)' }}>3</span>
    </button>
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', background: '#fff', border: '1px solid var(--border-2)', borderRadius: 10, color: 'var(--fg-1)', font: '500 13px/1 var(--font-sans)', cursor: 'pointer' }}>Loja: Todas {AIc.chevD}</button>
    <div style={{ flex: 1 }} />
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', background: 'var(--bg-inverse)', color: '#fff', border: 0, borderRadius: 10, font: '500 13px/1 var(--font-sans)', cursor: 'pointer' }}>{AIc.download}Exportar CSV</button>
  </div>
);

// ─── Pagination ──────────────────────────────────────────────────────────────
const Pagination = ({ total }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid var(--border-1)' }}>
    <span style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)' }}>
      Mostrando <b style={{ color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>1–{Math.min(10, total)}</b> de <b style={{ color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{total}</b> pedidos
    </span>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {[
        { t: '‹', d: true },{ t: '1', sel: true },{ t: '2' },{ t: '3' },{ t: '…', sep: true },{ t: '25' },{ t: '›' }
      ].map((it, i) => it.sep
        ? <span key={i} style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-4)' }}>{it.t}</span>
        : <button key={i} style={{
            width: 32, height: 32, borderRadius: 8,
            background: it.sel ? 'var(--bg-inverse)' : 'transparent',
            color: it.sel ? '#fff' : it.d ? 'var(--fg-4)' : 'var(--fg-1)',
            border: it.sel ? 0 : '1px solid var(--border-1)',
            font: '500 13px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', cursor: it.d ? 'default' : 'pointer'
          }}>{it.t}</button>)}
    </div>
  </div>
);

// ─── Dashboard Screen ────────────────────────────────────────────────────────
const Dashboard = ({ openOrder, setNav }) => (
  <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <h1 style={{ font: '500 28px/1.15 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0 }}>
          Bom dia, Vitor<span style={{ color: 'var(--color-brand-500)' }}>.</span>
        </h1>
        <p style={{ font: '400 14px/1.4 var(--font-sans)', color: 'var(--fg-3)', margin: '6px 0 0' }}>
          Você tem <b style={{ color: 'var(--fg-1)' }}>12 pedidos novos</b> e <b style={{ color: 'var(--fg-1)' }}>3 alertas de estoque</b> aguardando.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnSecondary}>{AIc.cal}<span style={{ marginLeft: 6 }}>15 mai – 21 mai</span></button>
        <button style={btnPrimary}>Nova promoção</button>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 14 }}>
      <KpiCard label="Pedidos hoje"  value="412"          delta="+12,4%" up path="M0,28 L20,24 L40,26 L60,18 L80,20 L100,12 L120,14 L140,8" />
      <KpiCard label="GMV (24h)"     value="R$ 184.302"   delta="+8,1%"  up path="M0,30 L20,28 L40,22 L60,24 L80,18 L100,20 L120,14 L140,10" />
      <KpiCard label="Ticket médio"  value="R$ 142,80"    delta="−2,3%"  up={false} path="M0,12 L20,16 L40,14 L60,20 L80,18 L100,22 L120,20 L140,26" />
      <KpiCard label="Tempo médio"   value="78 min"       delta="−4 min" up path="M0,16 L20,18 L40,14 L60,16 L80,12 L100,14 L120,10 L140,12" />
    </div>

    <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
      <GmvChart />
      <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Mix por categoria</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg viewBox="0 0 64 64" style={{ width: 92, height: 92, flex: '0 0 92px' }}>
            <circle cx="32" cy="32" r="24" stroke="var(--bg-subtle)" strokeWidth="10" fill="none" />
            <circle cx="32" cy="32" r="24" stroke="var(--color-brand-500)" strokeWidth="10" fill="none" strokeDasharray="76 200" transform="rotate(-90 32 32)" />
            <circle cx="32" cy="32" r="24" stroke="var(--color-ink)" strokeWidth="10" fill="none" strokeDasharray="36 200" strokeDashoffset="-76" transform="rotate(-90 32 32)" />
            <circle cx="32" cy="32" r="24" stroke="var(--color-warning-fg)" strokeWidth="10" fill="none" strokeDasharray="28 200" strokeDashoffset="-112" transform="rotate(-90 32 32)" />
            <circle cx="32" cy="32" r="24" stroke="var(--color-info-fg)" strokeWidth="10" fill="none" strokeDasharray="11 200" strokeDashoffset="-140" transform="rotate(-90 32 32)" />
          </svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Hortifruti','50%','var(--color-brand-500)'],['Padaria','24%','var(--color-ink)'],['Bebidas','18%','var(--color-warning-fg)'],['Outros','8%','var(--color-info-fg)']].map(([n,p,c]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, font: '400 13px/1 var(--font-sans)', color: 'var(--fg-1)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                <span style={{ flex: 1 }}>{n}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)', fontWeight: 500 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div style={{ background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 18px' }}>
        <div>
          <div style={{ font: '500 15px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>Pedidos recentes</div>
          <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)', marginTop: 3 }}>Últimas 24 horas</div>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setNav('orders')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 12px', background: 'transparent', border: 0, color: 'var(--fg-brand)', font: '500 13px/1 var(--font-sans)', cursor: 'pointer' }}>Ver tudo {AIc.chev}</button>
      </div>
      <OrderTableHeader />
      {ORDERS.slice(0, 5).map(o => <OrderRow key={o.id} o={o} onOpen={() => openOrder(o.id)} />)}
    </div>
  </div>
);

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px',
  background: 'var(--color-brand-500)', color: '#fff', border: 0, borderRadius: 10,
  font: '500 13px/1 var(--font-sans)', cursor: 'pointer'
};
const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 12px',
  background: '#fff', color: 'var(--fg-1)', border: '1px solid var(--border-2)',
  borderRadius: 10, font: '500 13px/1 var(--font-sans)', cursor: 'pointer'
};

// ─── Orders Screen ───────────────────────────────────────────────────────────
const OrdersScreen = ({ openOrder }) => {
  const [tab, setTab] = React.useState('all');
  const filtered = tab === 'all' ? ORDERS : ORDERS.filter(o => o.status === tab);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ font: '500 24px/1.15 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0 }}>Pedidos</h1>
          <p style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--fg-3)', margin: '4px 0 0' }}>247 pedidos no período selecionado</p>
        </div>
        <button style={btnPrimary}>Novo pedido manual</button>
      </div>
      <div style={{ marginTop: 14 }}><FilterTabs tab={tab} setTab={setTab} /></div>
      <FilterBar />
      <div style={{ margin: '0 24px 24px', background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        <OrderTableHeader />
        {filtered.map(o => <OrderRow key={o.id} o={o} onOpen={() => openOrder(o.id)} />)}
        {filtered.length === 0 && (
          <div style={{ padding: 64, textAlign: 'center', font: '400 14px/1.4 var(--font-sans)', color: 'var(--fg-3)' }}>Nenhum pedido nesse filtro.</div>
        )}
        <Pagination total={filtered.length} />
      </div>
    </div>
  );
};

// ─── Order Detail ────────────────────────────────────────────────────────────
const OrderDetail = ({ orderId, onBack }) => {
  const o = ORDERS.find(x => x.id === orderId) || ORDERS[0];
  const sm = STATUS_META[o.status];
  const pm = PAYMENT_META[o.payment];
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.q * i.p, 0);
  const frete = subtotal >= 199 ? 0 : 12.90;

  return (
    <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid var(--border-2)', color: 'var(--fg-1)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{AIc.back}</button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ font: '500 24px/1.1 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0 }}>Pedido #{o.id}</h1>
            <StatusPill meta={sm} />
            <StatusPill meta={pm} small dot={false} />
          </div>
          <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)', marginTop: 4 }}>{o.eta} · Criado em 18 mai, 09:12 · Loja {o.store}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button style={btnSecondary}>{AIc.print}<span style={{ marginLeft: 6 }}>Imprimir</span></button>
        <button style={btnSecondary}>{AIc.msg}<span style={{ marginLeft: 6 }}>Mensagem</span></button>
        <button style={{ ...btnPrimary, background: 'var(--bg-inverse)' }}>Atualizar status</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'flex-start' }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Timeline */}
          <div style={{ background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--fg-1)', marginBottom: 14 }}>Linha do tempo</div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {[
                { label: 'Confirmado', time: '09:12', done: true },
                { label: 'Em separação', time: '09:18', done: true },
                { label: 'Em rota', time: '10:48', done: true, current: o.status === 'transit' },
                { label: 'Entregue', time: o.status === 'delivered' ? '11:42' : '—', done: o.status === 'delivered', current: o.status === 'delivered' },
              ].map((step, i, arr) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 9999,
                      background: step.done ? 'var(--color-brand-500)' : 'var(--bg-subtle)',
                      color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      border: step.current && !step.done ? '2px solid var(--color-brand-500)' : 0
                    }}>{step.done ? AIc.check : null}</div>
                    {i < arr.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: arr[i+1].done ? 'var(--color-brand-500)' : 'var(--bg-muted)', marginLeft: 6, marginRight: 6 }} />
                    )}
                  </div>
                  <div style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--fg-1)', marginTop: 10 }}>{step.label}</div>
                  <div style={{ font: '400 11px/1 var(--font-mono)', color: 'var(--fg-3)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{step.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={{ background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border-1)' }}>
              <span style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--fg-1)' }}>{ORDER_ITEMS.length} itens</span>
              <div style={{ flex: 1 }} />
              <button style={{ background: 'transparent', border: 0, color: 'var(--fg-brand)', font: '500 12px/1 var(--font-sans)', cursor: 'pointer' }}>Adicionar item</button>
            </div>
            {ORDER_ITEMS.map((it, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px',
                alignItems: 'center', padding: '12px 18px',
                borderTop: i > 0 ? '1px solid var(--border-1)' : 0
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-subtle)', color: 'var(--color-ink-40)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M3 9 5 4h14l2 5"/></svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: '500 13px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{it.n}</span>
                  <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{it.u}</span>
                </div>
                <span style={{ font: '400 13px/1 var(--font-mono)', color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>×{it.q}</span>
                <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmt(it.q * it.p)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 18px', borderTop: '1px solid var(--border-1)', background: 'var(--bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
                <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
                <span>Frete</span><span style={{ color: frete === 0 ? 'var(--color-success-fg)' : 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>{frete === 0 ? 'Grátis' : fmt(frete)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 6, borderTop: '1px dashed var(--border-1)' }}>
                <span style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--fg-1)' }}>Total</span>
                <span style={{ font: '500 22px/1 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(subtotal + frete)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Cliente</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 9999, background: 'var(--bg-inverse)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '500 13px/1 var(--font-sans)' }}>
                {o.cust.split(' ').map(p => p[0]).slice(0,2).join('')}
              </div>
              <div>
                <div style={{ font: '500 14px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{o.cust}</div>
                <div style={{ font: '400 12px/1.2 var(--font-sans)', color: 'var(--fg-3)', marginTop: 2 }}>{o.email}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 10, background: 'var(--bg-canvas)', borderRadius: 10, font: '400 12px/1.4 var(--font-sans)', color: 'var(--fg-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><span style={{ color: 'var(--fg-3)' }}>{AIc.pin}</span><b style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Vila Madalena</b></div>
              R. Harmonia, 1042 · Apt 81 · 05433-040
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Entrega</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9999, background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{AIc.truck}</span>
              <div>
                <div style={{ font: '500 13px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{o.eta}</div>
                <div style={{ font: '400 12px/1.2 var(--font-sans)', color: 'var(--fg-3)' }}>Motoboy · Diego R.</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-1)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Pagamento</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: '400 13px/1.3 var(--font-sans)', color: 'var(--fg-1)' }}>
              <StatusPill meta={pm} small dot={false} />
              <span>{o.pay}</span>
            </div>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            height: 38, background: '#fff', color: 'var(--fg-1)',
            border: '1px solid var(--border-2)', borderRadius: 10,
            font: '500 13px/1 var(--font-sans)', cursor: 'pointer'
          }}>Cancelar pedido</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  AIc, fmt, Sidebar, TopBar, StatusPill, KpiCard, GmvChart,
  OrderRow, OrderTableHeader, FilterTabs, FilterBar, Pagination,
  Dashboard, OrdersScreen, OrderDetail, btnPrimary, btnSecondary
});
