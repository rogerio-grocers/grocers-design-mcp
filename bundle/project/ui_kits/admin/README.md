# Grocers Admin — UI Kit

Recriação click-through do painel administrativo do Grocers para gestores de
loja/rede (Zona Sul, etc.). Inclui as três telas mais usadas no dia a dia:

- **Visão geral** — saudação, KPIs (pedidos, GMV, ticket, tempo) com sparklines,
  gráfico de GMV semanal, donut de mix por categoria, pedidos recentes.
- **Pedidos** — tabela completa com tabs por status, filtros, exportação,
  paginação. Clique em qualquer linha para abrir o detalhe.
- **Pedido (detalhe)** — header com status e ações (imprimir, mensagem, atualizar),
  timeline em 4 etapas, lista de itens com totais, sidebar com cliente/entrega/pagamento.

As outras seções da sidebar (Catálogo, Clientes, Promoções, Lojas, Mensagens)
renderizam um estado vazio — são suficientes para usar a sidebar como referência
visual sem inflar o kit.

## Files

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Boots React + o app. Abre aqui. |
| `app.jsx` | Routing entre Dashboard / Pedidos / Detalhe. |
| `components.jsx` | `Sidebar`, `TopBar`, `StatusPill`, `KpiCard`, `GmvChart`, `OrderRow`, `OrderTableHeader`, `FilterTabs`, `FilterBar`, `Pagination`, `Dashboard`, `OrdersScreen`, `OrderDetail`. |
| `data.js` | Fixtures: `ORDERS`, `ORDER_ITEMS`, `STATUS_META`, `PAYMENT_META`. |

## Padrões que valem a pena reaproveitar

- **Sidebar nav** com badge contador (e.g. `Pedidos · 247`). A linha ativa usa o
  surface ink; o ponto vermelho aparece no ícone — reforça a marca sem
  competir com o conteúdo.
- **Top bar** com breadcrumbs + busca global (⌘K) + sino com indicador vermelho
  + pill do usuário escopada (org · papel).
- **KPI card**: rótulo cinza, número 26px com `tabular-nums` e tracking
  apertado, delta verde/âmbar com ícone de seta, sparkline 36px no rodapé.
- **Status pill**: 24px pill com bolinha colorida + label, sempre da família
  semantic (info/warning/success/danger/neutral). **Importante:** o vermelho da
  marca não é usado para status — para isso usamos `--color-danger-fg` (laranja
  queimado), conforme regra documentada no README.
- **Tabs com contador** + filtros pílula + botão "Exportar CSV" ink — combo
  padrão em todas as telas de lista.

## O que é intencionalmente fake

- Os números são fixos no `data.js`.
- A busca global (⌘K) e os filtros não filtram nada.
- Imprimir / Mensagem / Cancelar pedido são botões cosméticos.

## TODO antes de virar produção

- Substituir fixtures por queries reais.
- Ligar o "Atualizar status" ao backend de pedidos.
- Construir as telas vazias (Catálogo, Clientes, Promoções, Lojas, Mensagens).
