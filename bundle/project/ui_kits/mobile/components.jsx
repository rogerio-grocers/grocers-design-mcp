/* global React, CATS, PRODUCTS */

// ─── Icons ───────────────────────────────────────────────────────────────────
const MIc = {
  search:   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  cart:     <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>,
  home:     <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  grid:     <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  user:     <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mapPin:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  plus:     <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  minus:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>,
  back:     <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  chev:     <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  sparkle:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/></svg>,
  bag:      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M3 9 5 4h14l2 5"/><path d="M3 9h18"/><path d="M9 13a3 3 0 0 0 6 0"/></svg>,
};

const mfmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

// ─── Top App Bar (per screen) ────────────────────────────────────────────────
const MAppBar = ({ title, onBack, right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, height: 52,
    padding: '0 16px', background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-1)'
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 9999, background: 'transparent',
        border: 0, color: 'var(--fg-1)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>{MIc.back}</button>
    )}
    <div style={{ flex: 1, font: '600 17px/1 var(--font-sans)', color: 'var(--fg-1)' }}>{title}</div>
    {right}
  </div>
);

// ─── Bottom Tab Bar ──────────────────────────────────────────────────────────
const MTabBar = ({ tab, setTab, cartCount }) => {
  const tabs = [
    { id: 'home',   label: 'Início',     ic: MIc.home },
    { id: 'cats',   label: 'Categorias', ic: MIc.grid },
    { id: 'cart',   label: 'Sacola',     ic: MIc.cart, badge: cartCount },
    { id: 'me',     label: 'Perfil',     ic: MIc.user },
  ];
  return (
    <nav style={{
      display: 'flex', height: 64, borderTop: '1px solid var(--border-1)',
      background: 'var(--bg-surface)', paddingBottom: 0
    }}>
      {tabs.map(t => {
        const sel = t.id === tab;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, background: 'transparent', border: 0,
            color: sel ? 'var(--color-brand-500)' : 'var(--fg-3)', cursor: 'pointer',
            position: 'relative'
          }}>
            <span style={{ position: 'relative' }}>
              {t.ic}
              {t.badge ? <span style={{
                position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16,
                padding: '0 4px', borderRadius: 9999, background: 'var(--color-brand-500)',
                color: '#fff', font: '700 10px/16px var(--font-sans)', textAlign: 'center'
              }}>{t.badge}</span> : null}
            </span>
            <span style={{ font: `${sel ? 600 : 500} 10px/1 var(--font-sans)` }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};


// ─── Hero Carousel (paginated banners) ───────────────────────────────────────
const HERO_BANNERS = [
  { tone: 'red',  eyebrow: 'Oferta do dia', title: 'Picanha bovina', sub: '25% OFF · termina hoje', cta: 'Comprar' },
  { tone: 'ink',  eyebrow: 'Frete grátis',  title: 'Acima de R$ 199', sub: 'Para Vila Madalena · 90 min', cta: 'Ver regras' },
  { tone: 'cream',eyebrow: 'Novidade',      title: 'Padaria fresca', sub: 'Saiu do forno às 6h', cta: 'Explorar' },
];

const MHeroCarousel = () => {
  const [i, setI] = React.useState(0);
  const onScroll = (e) => {
    const w = e.currentTarget.clientWidth;
    setI(Math.round(e.currentTarget.scrollLeft / w));
  };
  const palette = {
    red:  { bg: 'var(--color-brand-500)', fg: '#fff', eye: 'rgba(255,255,255,0.85)' },
    ink:  { bg: 'var(--bg-inverse)',      fg: '#fff', eye: 'var(--color-brand-400)' },
    cream:{ bg: '#f6efe6',                fg: 'var(--fg-1)', eye: 'var(--fg-brand)' },
  };
  return (
    <div style={{ marginTop: 14, paddingTop: 4 }}>
      <div onScroll={onScroll} style={{
        display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
        padding: '0 16px', scrollbarWidth: 'none'
      }}>
        {HERO_BANNERS.map((b, k) => {
          const p = palette[b.tone];
          return (
            <div key={k} style={{ flex: '0 0 100%', scrollSnapAlign: 'center', paddingRight: k === HERO_BANNERS.length - 1 ? 0 : 10 }}>
              <div style={{
                height: 220, borderRadius: 16, background: p.bg, color: p.fg,
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'flex-end'
              }}>
                {/* Illustration / product image area — dominates the banner */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: 18, color: p.tone === 'cream' ? 'var(--color-ink-40)' : 'rgba(255,255,255,0.30)'
                }}>
                  {React.cloneElement(MIc.bag, { width: 180, height: 180 })}
                </div>
                {/* Gradient for legibility on busier imagery */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: p.tone === 'cream'
                    ? 'linear-gradient(90deg, rgba(246,239,230,0.95) 0%, rgba(246,239,230,0.7) 50%, rgba(246,239,230,0) 100%)'
                    : `linear-gradient(90deg, ${p.bg} 0%, ${p.bg}cc 55%, ${p.bg}00 100%)`
                }}/>
                {/* Text block */}
                <div style={{ position: 'relative', padding: 20, display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '70%' }}>
                  <span style={{ font: '500 10px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: p.eye }}>{b.eyebrow}</span>
                  <span style={{ font: '500 22px/1.1 var(--font-sans)', letterSpacing: '-0.02em', color: p.fg, marginTop: 2 }}>{b.title}</span>
                  <span style={{ font: '400 13px/1.4 var(--font-sans)', color: p.fg, opacity: 0.85 }}>{b.sub}</span>
                  <button style={{
                    marginTop: 10, height: 34, alignSelf: 'flex-start', padding: '0 14px',
                    background: p.tone === 'cream' ? 'var(--bg-inverse)' : '#fff',
                    color: p.tone === 'cream' ? '#fff' : 'var(--fg-1)',
                    border: 0, borderRadius: 9999, font: '500 13px/1 var(--font-sans)', cursor: 'pointer'
                  }}>{b.cta}</button>
                </div>
                {/* sponsored mark, top-right */}
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  font: '500 9px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase',
                  color: p.tone === 'cream' ? 'var(--fg-3)' : 'rgba(255,255,255,0.65)'
                }}>Patrocinado</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 10 }}>
        {HERO_BANNERS.map((_, k) => (
          <span key={k} style={{
            width: k === i ? 18 : 5, height: 5, borderRadius: 9999,
            background: k === i ? 'var(--color-ink)' : 'var(--border-2)',
            transition: 'width 180ms'
          }}/>
        ))}
      </div>
    </div>
  );
};

// ─── Horizontal Product Row ─────────────────────────────────────────────────
const MProductRow = ({ title, products, openProduct, inc, qtyOf }) => (
  <div style={{ marginTop: 22 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 16px', marginBottom: 10 }}>
      <span style={{ font: '500 15px/1 var(--font-sans)', color: 'var(--fg-1)' }}>{title}</span>
      <button style={{ background: 'transparent', border: 0, font: '500 12px/1 var(--font-sans)', color: 'var(--fg-brand)' }}>Ver tudo {MIc.chev}</button>
    </div>
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 4px', scrollbarWidth: 'none' }}>
      {products.map(p => (
        <div key={p.id} style={{ flex: '0 0 140px' }}>
          <MProductTile p={p} qty={qtyOf(p.id)} inc={() => inc(p.id)} onOpen={() => openProduct(p.id)} />
        </div>
      ))}
    </div>
  </div>
);

// ─── Flash deal strip with countdown ────────────────────────────────────────
const MFlashStrip = () => {
  const [t, setT] = React.useState(2 * 3600 + 12 * 60 + 47);
  React.useEffect(() => {
    const id = setInterval(() => setT(x => Math.max(0, x - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(t / 3600)).padStart(2, '0');
  const mm = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  return (
    <div style={{
      margin: '20px 16px 0', padding: 14, background: 'var(--bg-inverse)',
      color: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9999, background: 'var(--color-brand-500)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: '500 10px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-brand-400)' }}>Oferta-relâmpago</span>
        <span style={{ font: '500 14px/1.2 var(--font-sans)', color: '#fff' }}>Até 30% OFF na padaria</span>
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 3, height: 28,
        padding: '0 10px', background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.14)', borderRadius: 9999,
        font: '500 12px/1 var(--font-sans)', color: '#fff', fontVariantNumeric: 'tabular-nums'
      }}>{hh}:{mm}:{ss}</div>
    </div>
  );
};

// ─── Brand strip ────────────────────────────────────────────────────────────
const MBrandStrip = () => (
  <div style={{ marginTop: 20 }}>
    <div style={{ font: '500 15px/1 var(--font-sans)', color: 'var(--fg-1)', padding: '0 16px', marginBottom: 10 }}>Marcas em destaque</div>
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 4px', scrollbarWidth: 'none' }}>
      {['Italac', 'Heineken', 'Sadia', 'Camil', 'Ypê', 'Tio João', 'Vigor', 'Pirac.'].map((b, k) => (
        <button key={k} style={{
          flex: '0 0 auto', height: 80, width: 92, borderRadius: 14,
          background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 6, cursor: 'pointer'
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '500 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
            {b.charAt(0)}
          </div>
          <span style={{ font: '500 11px/1 var(--font-sans)', color: 'var(--fg-1)' }}>{b}</span>
        </button>
      ))}
    </div>
  </div>
);

// ─── Home Screen ─────────────────────────────────────────────────────────────
const MHome = ({ setTab, openProduct, setCatFilter, inc, qtyOf }) => {
  const featured = PRODUCTS.filter(p => p.tag).slice(0, 6);
  const usual    = [1, 5, 8, 14, 17, 10, 2].map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', paddingBottom: 24 }}>
      {/* Sticky header */}
      <div style={{ background: 'var(--bg-inverse)', color: '#fff', padding: '20px 16px 24px', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 9999, color: '#fff', font: '500 12px/1 var(--font-sans)' }}>
            <span style={{ color: 'var(--color-brand-400)' }}>{MIc.mapPin}</span>
            Vila Madalena · 05433-040
            {MIc.chev}
          </button>
          <img src="../../assets/logo.png" alt="Grocers" style={{ height: 22, marginLeft: 'auto' }}/>
        </div>
        <div style={{
          marginTop: 14, height: 44, background: '#fff', borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', color: 'var(--fg-3)'
        }}>
          {MIc.search}
          <span style={{ font: '400 14px/1 var(--font-sans)' }}>Buscar em mais de 12.000 produtos</span>
        </div>
      </div>

      {/* Hero banner carousel — industry-sponsored position, tall */}
      <MHeroCarousel />

      {/* IA suggestion strip — neutral, below the carousel */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 12, width: 'calc(100% - 32px)',
        margin: '14px 16px 0', padding: '10px 14px', background: 'var(--bg-surface)',
        border: '1px solid var(--border-1)', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9999, background: 'var(--color-brand-50)',
          color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 32px'
        }}>
          {React.cloneElement(MIc.sparkle, { width: 16, height: 16 })}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '500 13px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>Sua compra da semana está pronta</span>
          <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--fg-3)' }}>Sugerida pela IA · 17 itens · R$ 287,40</span>
        </div>
        <span style={{ color: 'var(--fg-3)' }}>{MIc.chev}</span>
      </button>

      {/* Category chips */}
      <div style={{ marginTop: 18, padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ font: '500 15px/1 var(--font-sans)', color: 'var(--fg-1)' }}>Categorias</span>
          <button onClick={() => setTab('cats')} style={{ background: 'transparent', border: 0, font: '500 12px/1 var(--font-sans)', color: 'var(--fg-brand)' }}>Ver todas {MIc.chev}</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 4px', scrollbarWidth: 'none' }}>
        {CATS.slice(1, 8).map(c => (
          <button key={c.id} onClick={() => { setCatFilter(c.id); setTab('cats'); }} style={{
            flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, padding: '12px 14px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-1)', borderRadius: 14, cursor: 'pointer',
            minWidth: 80
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 9999, background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {React.cloneElement(MIc.bag, { width: 22, height: 22 })}
            </div>
            <span style={{ font: '500 12px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Flash deal strip with countdown */}
      <MFlashStrip />

      {/* Buy again row (horizontal carousel) */}
      <MProductRow title="Compre de novo" products={usual} openProduct={openProduct} inc={inc} qtyOf={qtyOf} />

      {/* Ofertas grid (2-col) */}
      <div style={{ marginTop: 22, padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ font: '500 15px/1 var(--font-sans)', color: 'var(--fg-1)' }}>Ofertas da semana</span>
          <button style={{ background: 'transparent', border: 0, font: '500 12px/1 var(--font-sans)', color: 'var(--fg-brand)' }}>Ver mais {MIc.chev}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {featured.map(p => (
            <MProductTile key={p.id} p={p} qty={qtyOf(p.id)} inc={() => inc(p.id)} onOpen={() => openProduct(p.id)} />
          ))}
        </div>
      </div>

      {/* Brand strip */}
      <MBrandStrip />

      <div style={{ height: 12 }} />
    </div>
  );
};

// ─── Product tile (mobile) ───────────────────────────────────────────────────
const MProductTile = ({ p, qty, inc, onOpen }) => (
  <article onClick={onOpen} style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column',
    gap: 6, position: 'relative', boxShadow: 'var(--shadow-xs)'
  }}>
    {p.tag && (
      <span style={{
        position: 'absolute', top: 8, left: 8, zIndex: 1,
        display: 'inline-flex', alignItems: 'center', height: 20,
        padding: '0 7px', borderRadius: 9999,
        background: p.tag.startsWith('−') ? 'var(--color-brand-500)' : 'var(--bg-inverse)',
        color: '#fff', font: '700 10px/1 var(--font-sans)'
      }}>{p.tag}</span>
    )}
    <div style={{
      aspectRatio: '4 / 5', background: 'var(--bg-subtle)', borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-40)'
    }}>{MIc.bag}</div>
    <div style={{ font: '500 13px/1.25 var(--font-sans)', color: 'var(--fg-1)', minHeight: 32 }}>{p.n}</div>
    <div style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{p.u}</div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {p.was && <span style={{ font: '400 10px/1 var(--font-sans)', color: 'var(--fg-3)', textDecoration: 'line-through' }}>{mfmt(p.was)}</span>}
        <span style={{ font: '700 15px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: p.was ? 'var(--color-brand-600)' : 'var(--fg-1)' }}>{mfmt(p.p)}</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); inc(); }} style={{
        marginLeft: 'auto', width: 32, height: 32, borderRadius: 9999,
        background: qty > 0 ? '#fff' : 'var(--color-brand-500)',
        color: qty > 0 ? 'var(--color-brand-600)' : '#fff',
        border: qty > 0 ? '1px solid var(--color-brand-200)' : 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
      }}>
        {qty > 0 ? <span style={{ font: '700 13px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{qty}</span> : MIc.plus}
      </button>
    </div>
  </article>
);

// ─── Categories Screen ───────────────────────────────────────────────────────
const MCategoriesScreen = ({ catFilter, setCatFilter, openProduct, inc, qtyOf }) => {
  const filtered = PRODUCTS.filter(p => catFilter === 'all' || p.cat === catFilter);
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Category pill rail */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-1)' }}>
        {CATS.map(c => {
          const sel = c.id === catFilter;
          return (
            <button key={c.id} onClick={() => setCatFilter(c.id)} style={{
              flex: '0 0 auto', height: 32, padding: '0 14px', borderRadius: 9999,
              background: sel ? 'var(--bg-inverse)' : 'var(--bg-subtle)',
              color: sel ? '#fff' : 'var(--fg-1)', border: 0,
              font: `${sel ? 600 : 500} 13px/1 var(--font-sans)`, cursor: 'pointer'
            }}>{c.name}</button>
          );
        })}
      </div>
      <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(p => (
          <MProductTile key={p.id} p={p} qty={qtyOf(p.id)} inc={() => inc(p.id)} onOpen={() => openProduct(p.id)} />
        ))}
      </div>
    </div>
  );
};

// ─── Product Detail Screen ───────────────────────────────────────────────────
const MProductDetail = ({ p, qty, inc, dec, onBack, onCart }) => (
  <div style={{ background: 'var(--bg-surface)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{
      position: 'relative', background: 'var(--bg-subtle)', aspectRatio: '1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-40)'
    }}>
      <button onClick={onBack} style={{
        position: 'absolute', top: 12, left: 12, width: 40, height: 40,
        borderRadius: 9999, background: '#fff', border: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)', color: 'var(--fg-1)'
      }}>{MIc.back}</button>
      {p.tag && (
        <span style={{
          position: 'absolute', top: 18, right: 16,
          display: 'inline-flex', alignItems: 'center', height: 26,
          padding: '0 10px', borderRadius: 9999,
          background: p.tag.startsWith('−') ? 'var(--color-brand-500)' : 'var(--bg-inverse)',
          color: '#fff', font: '700 12px/1 var(--font-sans)'
        }}>{p.tag}</span>
      )}
      <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M3 9 5 4h14l2 5"/><path d="M3 9h18"/><path d="M9 13a3 3 0 0 0 6 0"/>
      </svg>
    </div>
    <div style={{ flex: 1, padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ font: '500 11px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-brand)' }}>{p.cat}</span>
      <h1 style={{ font: '600 22px/1.2 var(--font-sans)', letterSpacing: '-0.01em', margin: 0, color: 'var(--fg-1)' }}>{p.n}</h1>
      <span style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{p.u}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        {p.was && <span style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--fg-3)', textDecoration: 'line-through' }}>{mfmt(p.was)}</span>}
        <span style={{ font: '700 28px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: p.was ? 'var(--color-brand-600)' : 'var(--fg-1)' }}>{mfmt(p.p)}</span>
      </div>
      <div style={{ marginTop: 8, padding: 14, background: 'var(--bg-canvas)', borderRadius: 12, border: '1px solid var(--border-1)' }}>
        <div style={{ font: '500 11px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6 }}>Entrega</div>
        <div style={{ font: '500 14px/1.3 var(--font-sans)', color: 'var(--fg-1)' }}>Receba hoje, em até <b>90 minutos</b></div>
        <div style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--fg-3)', marginTop: 2 }}>Endereço · Vila Madalena, 05433-040</div>
      </div>
      <div style={{ marginTop: 4 }}>
        <h2 style={{ font: '600 14px/1.2 var(--font-sans)', color: 'var(--fg-1)', margin: '0 0 6px' }}>Descrição</h2>
        <p style={{ font: '400 13px/1.6 var(--font-sans)', color: 'var(--fg-2)', margin: 0 }}>
          Selecionado pelos nossos compradores no mesmo dia. Origem rastreável. Imagem ilustrativa.
        </p>
      </div>
    </div>

    {/* Sticky bottom CTA */}
    <div style={{
      position: 'sticky', bottom: 0, background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-1)', padding: 14,
      display: 'flex', gap: 10, alignItems: 'center'
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', height: 48,
        border: '1px solid var(--border-2)', borderRadius: 9999, background: '#fff'
      }}>
        <button onClick={dec} style={mStepBtn}>{MIc.minus}</button>
        <span style={{ minWidth: 28, textAlign: 'center', font: '600 16px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{Math.max(qty, 1)}</span>
        <button onClick={inc} style={mStepBtn}>{MIc.plus}</button>
      </div>
      <button onClick={() => { inc(); onCart(); }} style={{
        flex: 1, height: 48, background: 'var(--color-brand-500)', color: '#fff',
        border: 0, borderRadius: 9999, font: '600 14px/1 var(--font-sans)',
        cursor: 'pointer', boxShadow: 'var(--shadow-xs)'
      }}>Adicionar · {mfmt(p.p * Math.max(qty, 1))}</button>
    </div>
  </div>
);
const mStepBtn = {
  width: 44, height: 48, background: 'transparent', border: 0,
  color: 'var(--fg-1)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
};

// ─── Cart Screen ─────────────────────────────────────────────────────────────
const MCartScreen = ({ items, inc, dec, onCheckout, setTab }) => {
  const lines = Object.entries(items)
    .filter(([_, q]) => q > 0)
    .map(([id, q]) => ({ p: PRODUCTS.find(p => p.id === +id), q }));
  const subtotal = lines.reduce((s, l) => s + l.p.p * l.q, 0);
  const freteFree = subtotal >= 199;
  const frete = freteFree ? 0 : 12.90;

  if (lines.length === 0) {
    return (
      <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 }}>
        <div style={{ color: 'var(--color-ink-40)' }}>{React.cloneElement(MIc.cart, { width: 40, height: 40 })}</div>
        <div style={{ font: '600 17px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>Sua sacola está vazia</div>
        <div style={{ font: '400 13px/1.5 var(--font-sans)', color: 'var(--fg-3)', textAlign: 'center', maxWidth: 260 }}>Adicione produtos do catálogo para começar sua compra.</div>
        <button onClick={() => setTab('home')} style={{
          marginTop: 12, height: 44, padding: '0 22px', background: 'var(--color-brand-500)',
          color: '#fff', border: 0, borderRadius: 9999, font: '600 14px/1 var(--font-sans)'
        }}>Explorar catálogo</button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px 0', font: '600 14px/1 var(--font-sans)', color: 'var(--fg-3)' }}>
        {lines.reduce((s,l)=>s+l.q,0)} itens · entrega em 90 min
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lines.map(({ p, q }) => (
          <div key={p.id} style={{ display: 'flex', gap: 12, padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-40)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M3 9 5 4h14l2 5"/></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ font: '500 14px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{p.n}</div>
              <div style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{p.u}</div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', height: 30, border: '1px solid var(--border-2)', borderRadius: 9999, background: '#fff' }}>
                  <button onClick={() => dec(p.id)} style={{ width: 30, height: 30, background: 'transparent', border: 0, color: 'var(--fg-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{MIc.minus}</button>
                  <span style={{ minWidth: 22, textAlign: 'center', font: '600 13px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{q}</span>
                  <button onClick={() => inc(p.id)} style={{ width: 30, height: 30, background: 'transparent', border: 0, color: 'var(--fg-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{MIc.plus}</button>
                </div>
                <span style={{ marginLeft: 'auto', font: '700 15px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-1)' }}>{mfmt(p.p * q)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, background: 'var(--bg-surface)', borderTop: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
          <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{mfmt(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
          <span>Frete</span><span style={{ color: freteFree ? 'var(--color-success-fg)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{freteFree ? 'Grátis' : mfmt(frete)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 8, borderTop: '1px dashed var(--border-1)' }}>
          <span style={{ font: '600 14px/1 var(--font-sans)', color: 'var(--fg-1)' }}>Total</span>
          <span style={{ font: '700 22px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-1)' }}>{mfmt(subtotal + frete)}</span>
        </div>
        <button onClick={onCheckout} style={{
          marginTop: 6, height: 50, background: 'var(--color-brand-500)', color: '#fff',
          border: 0, borderRadius: 9999, font: '500 15px/1 var(--font-sans)', cursor: 'pointer'
        }}>Finalizar compra · {mfmt(subtotal + frete)}</button>
      </div>
    </div>
  );
};

// ─── Profile (placeholder) ───────────────────────────────────────────────────
const MProfile = () => (
  <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: 9999, background: 'var(--bg-inverse)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 18px/1 var(--font-sans)' }}>VP</div>
      <div style={{ flex: 1 }}>
        <div style={{ font: '600 15px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>Vitor Pereira</div>
        <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)' }}>vitor@zonasul.com</div>
      </div>
    </div>
    {[
      ['Meus pedidos', '12 concluídos'],
      ['Endereços', 'Vila Madalena · 05433-040'],
      ['Formas de pagamento', '•••• 4242'],
      ['Cupons', '3 disponíveis'],
      ['Preferências', 'Receber por WhatsApp'],
      ['Sair', null],
    ].map(([t, sub], i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: '500 14px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{t}</div>
          {sub && <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
        </div>
        <span style={{ color: 'var(--fg-4)' }}>{MIc.chev}</span>
      </div>
    ))}
  </div>
);

Object.assign(window, {
  MIc, mfmt, MAppBar, MTabBar, MHome, MCategoriesScreen, MProductDetail, MCartScreen, MProfile, MProductTile, MHeroCarousel, MProductRow, MFlashStrip, MBrandStrip
});
