/* global React */
const { useState, useMemo, useEffect, useRef } = React;

// ─── Icons (Lucide-style inline SVGs) ────────────────────────────────────────
const Ic = {
  search:  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  cart:    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>,
  user:    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  heart:   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  mapPin:  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  plus:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  minus:   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>,
  check:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  chevron: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  back:    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  x:       <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  sparkle: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/></svg>,
  truck:   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1"/></svg>,
};

// product placeholder thumb — small shopping-bag glyph at neutral tint
const ProductThumb = ({ size = 96 }) => (
  <div style={{
    width: '100%', aspectRatio: '4 / 5', background: 'var(--bg-subtle)',
    borderRadius: 'var(--radius-md)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-40)'
  }}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/>
      <path d="M3 9 5 4h14l2 5"/>
      <path d="M3 9h18"/>
      <path d="M9 13a3 3 0 0 0 6 0"/>
    </svg>
  </div>
);

// price formatter
const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ q, setQ, cartCount, onCartClick, onLogoClick }) => (
  <header style={{
    position: 'sticky', top: 0, zIndex: 30, height: 64, background: 'var(--bg-inverse)',
    color: '#fff', display: 'flex', alignItems: 'center', gap: 24,
    padding: '0 32px', borderBottom: '1px solid var(--border-inverse)'
  }}>
    <button onClick={onLogoClick} style={{
      background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
      height: 36, display: 'inline-flex', alignItems: 'center'
    }}>
      <img src="../../assets/logo.png" alt="Grocers" style={{ height: 28, display: 'block' }}/>
    </button>
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 36,
      padding: '0 14px', background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.10)', borderRadius: 9999,
      color: '#fff', font: '500 13px/1 var(--font-sans)', cursor: 'pointer'
    }}>
      <span style={{ color: 'var(--color-brand-400)' }}>{Ic.mapPin}</span>
      <span>Vila Madalena · 05433-040</span>
    </button>
    <div style={{
      flex: 1, maxWidth: 560, height: 40, background: '#fff', borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', color: 'var(--fg-3)'
    }}>
      {Ic.search}
      <input
        value={q} onChange={e => setQ(e.target.value)}
        placeholder="Buscar em mais de 12.000 produtos"
        style={{
          flex: 1, border: 0, outline: 0, background: 'transparent',
          font: '400 14px/1 var(--font-sans)', color: 'var(--fg-1)'
        }}
      />
      {q && <button onClick={() => setQ('')} style={{ background: 'transparent', border: 0, color: 'var(--fg-3)', cursor: 'pointer', padding: 0 }}>{Ic.x}</button>}
    </div>
    <div style={{ flex: 1 }}/>
    <button style={iconBtnDark}>{Ic.heart}</button>
    <button style={iconBtnDark}>{Ic.user}</button>
    <button onClick={onCartClick} style={{ ...iconBtnDark, position: 'relative' }}>
      {Ic.cart}
      {cartCount > 0 && (
        <span style={{
          position: 'absolute', top: -2, right: -4, minWidth: 18, height: 18,
          padding: '0 5px', borderRadius: 9999, background: 'var(--color-brand-500)',
          color: '#fff', font: '700 11px/18px var(--font-sans)', textAlign: 'center'
        }}>{cartCount}</span>
      )}
    </button>
  </header>
);
const iconBtnDark = {
  width: 40, height: 40, borderRadius: 10, background: 'transparent',
  border: 0, color: '#fff', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
};

// ─── Category Rail ───────────────────────────────────────────────────────────
const CategoryRail = ({ cats, active, setActive }) => (
  <aside style={{
    width: 240, flex: '0 0 240px', borderRight: '1px solid var(--border-1)',
    background: 'var(--bg-surface)', padding: '20px 12px',
    position: 'sticky', top: 64, alignSelf: 'flex-start', height: 'calc(100vh - 64px)',
    overflowY: 'auto'
  }}>
    <div style={{
      font: '500 11px/1 var(--font-sans)', letterSpacing: '.08em',
      textTransform: 'uppercase', color: 'var(--fg-3)', padding: '6px 12px 12px'
    }}>Categorias</div>
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {cats.map(c => {
        const sel = c.id === active;
        return (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, height: 38,
              padding: '0 12px', borderRadius: 10,
              background: sel ? 'var(--bg-inverse)' : 'transparent',
              color: sel ? '#fff' : 'var(--fg-1)',
              border: 0, font: `${sel ? 600 : 500} 14px/1 var(--font-sans)`,
              cursor: 'pointer', textAlign: 'left'
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: 9999,
              background: sel ? 'var(--color-brand-500)' : 'var(--border-2)'
            }}/>
            {c.name}
          </button>
        );
      })}
    </nav>
  </aside>
);

// ─── Hero ────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{
    margin: '20px 0', padding: '32px 36px', borderRadius: 18,
    background: 'var(--bg-inverse)', color: '#fff',
    display: 'flex', alignItems: 'center', gap: 32, overflow: 'hidden', position: 'relative'
  }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
      <span style={{ font: '500 11px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-brand-400)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {Ic.sparkle} Sugerido pela IA
      </span>
      <h1 style={{ font: '600 36px/1.1 var(--font-sans)', letterSpacing: '-0.02em', margin: 0, color: '#fff', textWrap: 'pretty' }}>
        Sua compra da semana, montada do jeito que você gosta<span style={{ color: 'var(--color-brand-500)' }}>.</span>
      </h1>
      <p style={{ font: '400 15px/1.5 var(--font-sans)', color: 'var(--color-ink-20)', margin: 0, maxWidth: 460 }}>
        14 itens recorrentes do seu histórico + 3 ofertas que combinam com você. Revise e finalize em menos de 1 minuto.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <button style={btnPrimary}>Ver carrinho sugerido</button>
        <button style={btnGhostDark}>Comprar do zero</button>
      </div>
    </div>
    <div style={{
      width: 320, height: 200, borderRadius: 14,
      background: 'linear-gradient(135deg, var(--color-ink-90), var(--color-ink-80))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 70% 30%, rgba(255,68,68,0.18), transparent 60%)'
      }}/>
      <div style={{
        background: '#fff', borderRadius: 14, padding: 16, width: 200,
        boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: 8
      }}>
        <div style={{ font: '500 10px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-brand)' }}>Sua sacola IA</div>
        <div style={{ font: '700 22px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>R$ 287,40</div>
        <div style={{ height: 1, background: 'var(--border-1)' }}/>
        <div style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--fg-3)' }}>17 itens · entrega em 90 min</div>
      </div>
    </div>
  </section>
);

const btnPrimary = {
  height: 44, padding: '0 20px', background: 'var(--color-brand-500)',
  color: '#fff', border: 0, borderRadius: 10,
  font: '500 14px/1 var(--font-sans)', cursor: 'pointer'
};
const btnGhostDark = {
  height: 44, padding: '0 20px', background: 'transparent',
  color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
  font: '600 14px/1 var(--font-sans)', cursor: 'pointer'
};

// ─── Deal strip ──────────────────────────────────────────────────────────────
const DealStrip = () => (
  <div style={{
    margin: '16px 0', display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', background: 'var(--color-brand-50)',
    border: '1px solid var(--color-brand-100)', borderRadius: 12, color: 'var(--color-brand-800)'
  }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 22,
      padding: '0 10px', background: 'var(--color-brand-500)', color: '#fff',
      borderRadius: 9999, font: '700 11px/1 var(--font-sans)'
    }}>OFERTA</span>
    <span style={{ font: '500 13px/1.4 var(--font-sans)', flex: 1 }}>
      Frete grátis em pedidos acima de R$ 199,00 para Vila Madalena · entrega em até 90 minutos
    </span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 13px/1 var(--font-sans)', color: 'var(--color-brand-700)', cursor: 'pointer' }}>
      Ver regras {Ic.chevron}
    </span>
  </div>
);

// ─── Product Card ────────────────────────────────────────────────────────────
const ProductCard = ({ p, qty, inc, dec, onOpen }) => {
  const out = qty > 0;
  return (
    <article style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: 14,
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 14, boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
      position: 'relative', transition: 'box-shadow 180ms, border-color 180ms',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xs)'}
    onClick={onOpen}>
      {p.tag && (
        <span style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1,
          display: 'inline-flex', alignItems: 'center', height: 22,
          padding: '0 8px', borderRadius: 9999,
          background: p.tag.startsWith('−') ? 'var(--color-brand-500)' : 'var(--bg-inverse)',
          color: '#fff', font: '700 11px/1 var(--font-sans)'
        }}>{p.tag}</span>
      )}
      <ProductThumb />
      <div style={{ font: '500 14px/1.3 var(--font-sans)', color: 'var(--fg-1)', textWrap: 'pretty', minHeight: 36 }}>{p.n}</div>
      <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{p.u}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {p.was && <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--fg-3)', textDecoration: 'line-through' }}>{fmt(p.was)}</span>}
          <span style={{ font: '700 17px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: p.was ? 'var(--color-brand-600)' : 'var(--fg-1)' }}>{fmt(p.p)}</span>
        </div>
        <div style={{ marginLeft: 'auto' }} onClick={e => e.stopPropagation()}>
          {!out ? (
            <button onClick={inc} style={{
              width: 36, height: 36, borderRadius: 9999, background: 'var(--color-brand-500)',
              color: '#fff', border: 0, cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)'
            }}>{Ic.plus}</button>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', height: 36,
              background: 'var(--color-brand-500)', color: '#fff', borderRadius: 9999,
              boxShadow: 'var(--shadow-xs)'
            }}>
              <button onClick={dec} style={stepBtn}>{Ic.minus}</button>
              <span style={{ minWidth: 26, textAlign: 'center', font: '700 14px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
              <button onClick={inc} style={stepBtn}>{Ic.plus}</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
const stepBtn = {
  width: 32, height: 36, background: 'transparent', border: 0,
  color: '#fff', cursor: 'pointer', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center'
};

// ─── Product Detail ──────────────────────────────────────────────────────────
const ProductDetail = ({ p, qty, inc, dec, onBack }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <button onClick={onBack} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 36,
      padding: '0 12px', background: 'transparent', border: 0, color: 'var(--fg-2)',
      font: '500 13px/1 var(--font-sans)', cursor: 'pointer', alignSelf: 'flex-start'
    }}>{Ic.back} Voltar ao catálogo</button>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 18, padding: 32 }}>
        <div style={{ aspectRatio: '1', background: 'var(--bg-subtle)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-40)' }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/>
            <path d="M3 9 5 4h14l2 5"/>
            <path d="M3 9h18"/>
            <path d="M9 13a3 3 0 0 0 6 0"/>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 64, height: 64, borderRadius: 10, background: 'var(--bg-subtle)',
              border: i === 0 ? '2px solid var(--color-brand-500)' : '1px solid var(--border-1)'
            }}/>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: '500 12px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-brand)' }}>{p.cat}</div>
        <h1 style={{ font: '600 36px/1.1 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--fg-1)', margin: 0 }}>{p.n}</h1>
        <div style={{ font: '400 15px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{p.u} · SKU 78910001{p.id.toString().padStart(5,'0')}</div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          {p.was && <span style={{ font: '400 16px/1 var(--font-sans)', color: 'var(--fg-3)', textDecoration: 'line-through' }}>{fmt(p.was)}</span>}
          <span style={{ font: '600 36px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: p.was ? 'var(--color-brand-600)' : 'var(--fg-1)' }}>{fmt(p.p)}</span>
          {p.tag && p.tag.startsWith('−') && (
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 10px', borderRadius: 9999, background: 'var(--color-brand-500)', color: '#fff', font: '700 12px/1 var(--font-sans)' }}>{p.tag}</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', height: 44,
            border: '1px solid var(--border-2)', borderRadius: 9999, background: '#fff'
          }}>
            <button onClick={dec} style={pdpStep}>{Ic.minus}</button>
            <span style={{ minWidth: 32, textAlign: 'center', font: '600 16px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{Math.max(qty, 1)}</span>
            <button onClick={inc} style={pdpStep}>{Ic.plus}</button>
          </div>
          <button onClick={inc} style={{ ...btnPrimary, height: 44, flex: 1 }}>Adicionar à sacola — {fmt(p.p * Math.max(qty, 1))}</button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {[
            { i: Ic.truck, t: 'Entrega em 90 min', s: 'Vila Madalena' },
            { i: Ic.check, t: 'Em estoque', s: 'Mais de 50 unidades' },
            { i: Ic.sparkle, t: 'Sugerido pela IA', s: 'Com base no seu histórico' },
          ].map((b,i) => (
            <div key={i} style={{
              flex: 1, padding: 14, background: 'var(--bg-surface)',
              border: '1px solid var(--border-1)', borderRadius: 12,
              display: 'flex', flexDirection: 'column', gap: 6
            }}>
              <span style={{ color: 'var(--fg-brand)' }}>{b.i}</span>
              <span style={{ font: '600 13px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>{b.t}</span>
              <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--fg-3)' }}>{b.s}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <h2 style={{ font: '600 16px/1.2 var(--font-sans)', color: 'var(--fg-1)', margin: '0 0 8px' }}>Descrição</h2>
          <p style={{ font: '400 14px/1.6 var(--font-sans)', color: 'var(--fg-2)', margin: 0 }}>
            Selecionado pelos nossos compradores no mesmo dia. Origem rastreável.
            Conservar em local fresco. Imagem ilustrativa.
          </p>
        </div>
      </div>
    </div>
  </div>
);
const pdpStep = {
  width: 44, height: 44, background: 'transparent', border: 0,
  color: 'var(--fg-1)', cursor: 'pointer', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center'
};

// ─── Cart Sheet ──────────────────────────────────────────────────────────────
const CartSheet = ({ open, onClose, items, products, inc, dec }) => {
  if (!open) return null;
  const lines = Object.entries(items)
    .filter(([_, q]) => q > 0)
    .map(([id, q]) => ({ p: products.find(p => p.id === +id), q }));
  const subtotal = lines.reduce((s, l) => s + l.p.p * l.q, 0);
  const freteFree = subtotal >= 199;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(11,1,25,0.6)',
        backdropFilter: 'blur(4px)', zIndex: 40
      }}/>
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)',
        zIndex: 41, display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-1)' }}>
          <h2 style={{ font: '600 18px/1 var(--font-sans)', margin: 0, color: 'var(--fg-1)' }}>Sua sacola <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>· {lines.reduce((s,l) => s+l.q, 0)} {lines.reduce((s,l) => s+l.q, 0) === 1 ? 'item' : 'itens'}</span></h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, color: 'var(--fg-2)', cursor: 'pointer', padding: 4 }}>{Ic.x}</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
          {lines.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center', padding: '64px 16px', color: 'var(--fg-3)' }}>
              <div style={{ color: 'var(--color-ink-40)' }}>{React.cloneElement(Ic.cart, { width: 32, height: 32 })}</div>
              <div style={{ font: '600 16px/1.2 var(--font-sans)', color: 'var(--fg-1)' }}>Sua sacola está vazia</div>
              <div style={{ font: '400 13px/1.5 var(--font-sans)', maxWidth: 240 }}>Adicione produtos do catálogo para começar.</div>
            </div>
          ) : lines.map(({ p, q }) => (
            <div key={p.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-1)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--bg-subtle)', flex: '0 0 56px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-40)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M3 9 5 4h14l2 5"/></svg>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ font: '500 14px/1.3 var(--font-sans)', color: 'var(--fg-1)' }}>{p.n}</div>
                <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{p.u}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', height: 28, border: '1px solid var(--border-2)', borderRadius: 9999, background: '#fff' }}>
                    <button onClick={() => dec(p.id)} style={{ ...stepBtn, color: 'var(--fg-1)', height: 28, width: 28 }}>{Ic.minus}</button>
                    <span style={{ minWidth: 22, textAlign: 'center', font: '600 13px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{q}</span>
                    <button onClick={() => inc(p.id)} style={{ ...stepBtn, color: 'var(--fg-1)', height: 28, width: 28 }}>{Ic.plus}</button>
                  </div>
                  <span style={{ marginLeft: 'auto', font: '600 14px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-1)' }}>{fmt(p.p * q)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
              <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 13px/1 var(--font-sans)', color: 'var(--fg-2)' }}>
              <span>Frete (Vila Madalena, 90 min)</span>
              <span style={{ color: freteFree ? 'var(--color-success-fg)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
                {freteFree ? 'Grátis' : fmt(12.90)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', font: '600 16px/1 var(--font-sans)', color: 'var(--fg-1)', paddingTop: 6, borderTop: '1px dashed var(--border-1)' }}>
              <span>Total</span>
              <span style={{ font: '700 22px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{fmt(subtotal + (freteFree ? 0 : 12.90))}</span>
            </div>
            <button style={{ ...btnPrimary, height: 48, marginTop: 6 }}>Finalizar compra</button>
          </div>
        )}
      </aside>
    </>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    marginTop: 48, background: 'var(--bg-inverse)', color: 'var(--color-ink-20)',
    padding: '40px 32px 32px'
  }}>
    <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
      <div>
        <img src="../../assets/logo.png" alt="Grocers" style={{ height: 28, marginBottom: 16 }}/>
        <p style={{ font: '400 13px/1.6 var(--font-sans)', color: 'var(--color-ink-20)', maxWidth: 320, margin: 0 }}>
          Tecnologia para liderar o varejo alimentício. Do online ao físico, uma plataforma unificada.
        </p>
      </div>
      {[
        ['Produto', ['App', 'E-Commerce', 'Assistente Virtual', 'B2B', 'Lojas']],
        ['Empresa', ['Sobre', 'Carreiras', 'Imprensa', 'Contato']],
        ['Legal',   ['Termos', 'Privacidade', 'LGPD']],
      ].map(([h, items]) => (
        <div key={h}>
          <div style={{ font: '500 11px/1 var(--font-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', marginBottom: 14 }}>{h}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(i => <li key={i} style={{ font: '400 13px/1 var(--font-sans)' }}>{i}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <div style={{ maxWidth: 1240, margin: '32px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', font: '400 12px/1 var(--font-sans)', color: 'var(--color-ink-40)' }}>
      <span>© 2026 Grocers.ai</span>
      <span>Selecionada pelo Microsoft for Startups · OpenAI · GPT</span>
    </div>
  </footer>
);

// expose
Object.assign(window, {
  Ic, Header, CategoryRail, Hero, DealStrip, ProductCard, ProductDetail, CartSheet, Footer,
  fmt, btnPrimary
});
