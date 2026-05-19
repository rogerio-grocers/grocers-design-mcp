/* Admin demo fixture data */

window.ORDERS = [
  { id: 'GRC-48201', cust: 'Mariana Silva',    email: 'mariana.silva@gmail.com',  status: 'delivered', payment: 'paid',    items: 12, total: 287.40, eta: 'Entregue às 11h42', date: '2026-05-18T09:12:00', store: 'Vila Madalena', pay: 'Mastercard •• 4242' },
  { id: 'GRC-48200', cust: 'João Pedro Lima',  email: 'joao.lima@outlook.com',    status: 'picking',   payment: 'paid',    items: 8,  total: 142.90, eta: 'Em separação · 90 min', date: '2026-05-18T11:30:00', store: 'Pinheiros', pay: 'Pix' },
  { id: 'GRC-48199', cust: 'Beatriz Santos',   email: 'beatriz.santos@uol.com.br',status: 'transit',   payment: 'paid',    items: 23, total: 612.10, eta: 'Em rota · chega em 18 min', date: '2026-05-18T10:48:00', store: 'Itaim', pay: 'Visa •• 1881' },
  { id: 'GRC-48198', cust: 'Carlos Eduardo',   email: 'carloseduardo@gmail.com',  status: 'canceled',  payment: 'refunded',items: 4,  total: 89.40,  eta: 'Cancelado pelo cliente', date: '2026-05-18T10:02:00', store: 'Vila Madalena', pay: 'Pix' },
  { id: 'GRC-48197', cust: 'Ana Luiza Costa',  email: 'analuiza@hotmail.com',     status: 'delivered', payment: 'paid',    items: 15, total: 312.80, eta: 'Entregue às 09h21', date: '2026-05-18T08:30:00', store: 'Moema', pay: 'Mastercard •• 7301' },
  { id: 'GRC-48196', cust: 'Rafael Mendonça',  email: 'rafael.m@gmail.com',       status: 'new',       payment: 'pending', items: 6,  total: 174.20, eta: 'Aguardando pagamento', date: '2026-05-18T11:48:00', store: 'Pinheiros', pay: 'Boleto' },
  { id: 'GRC-48195', cust: 'Patrícia Oliveira',email: 'patricia.o@yahoo.com',     status: 'transit',   payment: 'paid',    items: 19, total: 482.30, eta: 'Em rota · chega em 32 min', date: '2026-05-18T10:05:00', store: 'Itaim', pay: 'Visa •• 4400' },
  { id: 'GRC-48194', cust: 'Felipe Cardoso',   email: 'felipe.cardoso@gmail.com', status: 'delivered', payment: 'paid',    items: 7,  total: 156.70, eta: 'Entregue às 08h54', date: '2026-05-18T08:00:00', store: 'Vila Madalena', pay: 'Pix' },
  { id: 'GRC-48193', cust: 'Camila Ferreira',  email: 'camilaf@gmail.com',        status: 'picking',   payment: 'paid',    items: 11, total: 218.90, eta: 'Em separação · 90 min', date: '2026-05-18T11:20:00', store: 'Moema', pay: 'Mastercard •• 9912' },
  { id: 'GRC-48192', cust: 'Bruno Almeida',    email: 'bruno.almeida@gmail.com',  status: 'delivered', payment: 'paid',    items: 28, total: 742.40, eta: 'Entregue às 08h12', date: '2026-05-18T07:00:00', store: 'Itaim', pay: 'Visa •• 6602' },
];

window.STATUS_META = {
  new:        { label: 'Novo',         bg: 'var(--color-info-bg)',    fg: 'var(--color-info-fg)',    bd: 'var(--color-info-border)' },
  picking:    { label: 'Em separação', bg: 'var(--color-info-bg)',    fg: 'var(--color-info-fg)',    bd: 'var(--color-info-border)' },
  transit:    { label: 'Em rota',      bg: 'var(--color-warning-bg)', fg: 'var(--color-warning-fg)', bd: 'var(--color-warning-border)' },
  delivered:  { label: 'Entregue',     bg: 'var(--color-success-bg)', fg: 'var(--color-success-fg)', bd: 'var(--color-success-border)' },
  canceled:   { label: 'Cancelado',    bg: 'var(--color-danger-bg)',  fg: 'var(--color-danger-fg)',  bd: 'var(--color-danger-border)' },
};

window.PAYMENT_META = {
  paid:     { label: 'Pago',      bg: 'var(--color-success-bg)', fg: 'var(--color-success-fg)', bd: 'var(--color-success-border)' },
  pending:  { label: 'Pendente',  bg: 'var(--color-warning-bg)', fg: 'var(--color-warning-fg)', bd: 'var(--color-warning-border)' },
  refunded: { label: 'Estornado', bg: 'var(--bg-subtle)',        fg: 'var(--fg-2)',             bd: 'var(--border-2)' },
};

window.ORDER_ITEMS = [
  { n: 'Banana Prata',                    u: 'penca · 1kg',       q: 2, p: 6.49 },
  { n: 'Leite Integral Italac',           u: '1L',                q: 6, p: 4.89 },
  { n: 'Pão Francês',                     u: 'kg',                q: 1, p: 18.90 },
  { n: 'Queijo Mussarela Fatiado',        u: '150g',              q: 2, p: 14.90 },
  { n: 'Iogurte Natural Vigor',           u: '170g',              q: 4, p: 3.79 },
  { n: 'Maçã Fuji',                       u: 'bandeja 1kg',       q: 1, p: 12.90 },
  { n: 'Arroz Tio João',                  u: '5kg',               q: 1, p: 32.90 },
  { n: 'Azeite Português',                u: '500ml',             q: 1, p: 29.90 },
];
