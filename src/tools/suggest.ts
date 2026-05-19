import * as z from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DesignSystemIndex } from "../indexer.js";

type Kit = "web" | "mobile" | "admin";

interface IntentEntry {
  id: string;
  keywords: string[];
  kind: "component" | "pattern";
  component?: { kit: Kit; name: string };
  pattern?: {
    title: string;
    description: string;
    snippet?: string;
  };
  rationale: string;
  invariants?: string[];
  alternatives?: Array<{ kit: Kit; name: string; why: string }>;
}

function asTextJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

const INTENTS: IntentEntry[] = [
  // ─── Admin patterns ───────────────────────────────────────────────────
  {
    id: "kpi-card",
    keywords: ["kpi", "métrica", "metrica", "indicador", "delta", "sparkline", "stat", "estatística", "card de número"],
    kind: "component",
    component: { kit: "admin", name: "KpiCard" },
    rationale:
      "KpiCard é o padrão Grocers para mostrar um número grande com delta vs período anterior + sparkline pequena. " +
      "Stack vertical (rótulo → número 28px tabular-nums → delta verde/âmbar + contexto), sparkline 36px no rodapé.",
    invariants: [
      "Número usa font-variant-numeric: tabular-nums (sempre).",
      "Delta verde só pra positivo, âmbar pra negativo — nunca brand red.",
      "Tracking apertado (-0.01em) no número.",
    ],
  },
  {
    id: "status-pill",
    keywords: ["status", "pill", "estado", "pedido pendente", "etiqueta status", "label estado"],
    kind: "component",
    component: { kit: "admin", name: "StatusPill" },
    rationale:
      "StatusPill é o padrão Grocers para indicar status de pedido (pendente, preparando, em rota, entregue, cancelado). " +
      "24px pill, bolinha colorida + label, sempre da família semantic.",
    invariants: [
      "Cor vem da família semantic (info/warning/success/danger/neutral), NUNCA da brand red.",
      "Cancelado usa danger (âmbar/laranja), não vermelho da marca.",
    ],
  },
  {
    id: "sidebar-admin",
    keywords: ["sidebar", "navegação lateral", "nav admin", "menu admin", "navegacao lateral"],
    kind: "component",
    component: { kit: "admin", name: "Sidebar" },
    rationale:
      "Sidebar admin oferece dois padrões: flat (com section caps) e submenus (accordion). Linha ativa usa surface ink; bolinha vermelha aparece no ícone — reforça a marca sem competir.",
    invariants: [
      "Usar grupos de seção em UPPERCASE eyebrow para visão hierárquica.",
      "Badge contador (ex. 'Pedidos · 247') é convenção Grocers.",
    ],
  },
  {
    id: "topbar-admin",
    keywords: ["topbar", "header admin", "barra superior", "breadcrumb", "busca global", "command k", "⌘k"],
    kind: "component",
    component: { kit: "admin", name: "TopBar" },
    rationale:
      "TopBar admin tem breadcrumbs à esquerda, busca global com atalho ⌘K, sino com indicador vermelho, e pill do usuário com escopo (org · papel).",
  },
  {
    id: "orders-table",
    keywords: ["tabela de pedidos", "lista de pedidos", "orders table", "pedidos lista"],
    kind: "component",
    component: { kit: "admin", name: "OrdersScreen" },
    rationale:
      "OrdersScreen é a tela completa de pedidos com tabs por status + filtros pílula + botão Exportar CSV. Cada linha (OrderRow) abre detalhe.",
    alternatives: [
      { kit: "admin", name: "OrderRow", why: "se você só precisa do row, não da tela inteira" },
      { kit: "admin", name: "FilterTabs", why: "só as abas + contador, sem tabela" },
    ],
  },
  {
    id: "order-detail",
    keywords: ["detalhe pedido", "order detail", "pedido completo", "timeline pedido"],
    kind: "component",
    component: { kit: "admin", name: "OrderDetail" },
    rationale:
      "OrderDetail mostra header com status + ações (imprimir, mensagem, atualizar), timeline em 4 etapas, lista de itens com totais, sidebar com cliente/entrega/pagamento.",
  },
  {
    id: "filter-tabs",
    keywords: ["filter tabs", "abas filtro", "tabs com contador", "filter pills", "filtros pílula"],
    kind: "component",
    component: { kit: "admin", name: "FilterTabs" },
    rationale:
      "FilterTabs é o combo de abas com contador (Todos · 247, Pendentes · 12, Concluídos · 235) + filtros pílula. Convenção Grocers em telas de lista.",
  },
  {
    id: "pagination",
    keywords: ["paginação", "paginate", "pagination", "página", "next page"],
    kind: "component",
    component: { kit: "admin", name: "Pagination" },
    rationale: "Pagination padrão Grocers para tabelas longas.",
  },
  {
    id: "gmv-chart",
    keywords: ["gmv", "gráfico vendas", "receita semanal", "weekly revenue", "chart gmv"],
    kind: "component",
    component: { kit: "admin", name: "GmvChart" },
    rationale: "GmvChart mostra GMV semanal — line chart com eixo dia/semana.",
  },
  {
    id: "kpi-row",
    keywords: ["kpi row", "linha de kpis", "row de métricas", "metrics row"],
    kind: "component",
    component: { kit: "admin", name: "Dashboard" },
    rationale: "Dashboard contém a KPI row típica do painel Grocers (pedidos · GMV · ticket · tempo).",
    alternatives: [{ kit: "admin", name: "KpiCard", why: "componente individual da row" }],
  },

  // ─── Web (consumer e-commerce) ────────────────────────────────────────
  {
    id: "cart-sheet",
    keywords: ["carrinho", "cart", "sacola", "drawer carrinho", "side cart"],
    kind: "component",
    component: { kit: "web", name: "CartSheet" },
    rationale: "CartSheet é o drawer lateral direito com itens, totais, frete e CTA — padrão Grocers web.",
  },
  {
    id: "product-card-web",
    keywords: ["product card", "tile produto web", "card de produto"],
    kind: "component",
    component: { kit: "web", name: "ProductCard" },
    rationale:
      "ProductCard web: imagem 1:1 padded, título + unidade, preço, stepper de quantidade ou pill + no bottom-right. Use radius lg (14px).",
    invariants: [
      "Imagem em aspect-ratio 4:5 portrait (decisão registrada — embalagens de mercado são verticais).",
      "Preço usa font-variant-numeric: tabular-nums.",
    ],
  },
  {
    id: "product-detail-web",
    keywords: ["pdp", "product detail", "página de produto", "detalhe produto"],
    kind: "component",
    component: { kit: "web", name: "ProductDetail" },
    rationale: "ProductDetail web: galeria + título + bloco de preço + controles (qty + add).",
  },
  {
    id: "hero-web",
    keywords: ["hero", "banner principal", "destaque home web"],
    kind: "component",
    component: { kit: "web", name: "Hero" },
    rationale: "Hero full-bleed dark com posicionamento de oferta. Padrão Grocers web.",
  },
  {
    id: "deal-strip",
    keywords: ["oferta da semana", "deal strip", "promo bar"],
    kind: "component",
    component: { kit: "web", name: "DealStrip" },
    rationale: "DealStrip — strip de accent com mensagens rotativas de oferta.",
  },

  // ─── Mobile (consumer iOS) ─────────────────────────────────────────────
  {
    id: "product-tile-mobile",
    keywords: ["product tile mobile", "tile mobile", "card produto app"],
    kind: "component",
    component: { kit: "mobile", name: "MProductTile" },
    rationale:
      "MProductTile: tile compacto pro grid 2 colunas ou carrossel horizontal. Imagem 4:5 portrait, preço tabular-nums.",
    invariants: ["Aspect-ratio 4:5 portrait — produtos de mercado são verticais."],
  },
  {
    id: "appbar-mobile",
    keywords: ["app bar mobile", "header mobile", "topo app"],
    kind: "component",
    component: { kit: "mobile", name: "MAppBar" },
    rationale: "MAppBar: 56px topo, location pill + busca + carrinho.",
  },
  {
    id: "tabbar-mobile",
    keywords: ["tab bar", "navegação bottom", "bottom navigation", "rodapé app"],
    kind: "component",
    component: { kit: "mobile", name: "MTabBar" },
    rationale: "MTabBar: 60px barra inferior com tabs Início · Categorias · Sacola · Perfil.",
  },
  {
    id: "home-mobile",
    keywords: ["home mobile", "tela inicial app", "home com carrossel"],
    kind: "component",
    component: { kit: "mobile", name: "MHome" },
    rationale:
      "MHome contém hero carrossel 220px (slot patrocinado pela indústria), strip IA fino abaixo, categorias, flash deal, compre de novo, ofertas grid, marcas.",
    invariants: [
      "Hero carrossel é 220px de altura, label 'PATROCINADO' visível no canto.",
      "Sugestão IA fica abaixo do carrossel em strip fino — nunca em vermelho (parece alerta).",
    ],
  },
  {
    id: "cart-mobile",
    keywords: [
      "cart mobile",
      "sacola mobile",
      "tela carrinho app",
      "carrinho",
      "cart",
      "sacola",
      "checkout app",
    ],
    kind: "component",
    component: { kit: "mobile", name: "MCartScreen" },
    rationale: "MCartScreen: lista de itens com stepper + subtotal/frete/total + CTA sticky.",
  },
  {
    id: "pdp-mobile",
    keywords: ["pdp mobile", "detalhe produto app", "product detail mobile"],
    kind: "component",
    component: { kit: "mobile", name: "MProductDetail" },
    rationale: "MProductDetail: imagem full-bleed + sticky bottom 'Adicionar' com stepper.",
  },

  // ─── Patterns (não-componentes) ───────────────────────────────────────
  {
    id: "destructive-action",
    keywords: [
      "destrutivo",
      "destrutiva",
      "destructive",
      "deletar",
      "apagar",
      "excluir",
      "cancelar pedido",
      "delete confirmation",
      "remover permanentemente",
    ],
    kind: "pattern",
    pattern: {
      title: "Ação destrutiva: ink filled + type-to-confirm",
      description:
        "Botões destrutivos NUNCA usam vermelho da marca. Use ink (#0B0119) como fill + um campo type-to-confirm onde o usuário digita uma palavra-chave (ex. 'Digite CANCELAR') antes do botão habilitar.",
      snippet: `<form>
  <p className="t-body">Esta ação é irreversível.</p>
  <input
    placeholder="Digite CANCELAR para confirmar"
    onChange={(e) => setConfirmed(e.target.value === 'CANCELAR')}
  />
  <button
    disabled={!confirmed}
    style={{ background: 'var(--color-ink)', color: 'var(--fg-inverse)' }}
  >
    Cancelar pedido
  </button>
</form>`,
    },
    rationale:
      "Vermelho da marca é cor de destaque/CTA positivo no DS Grocers. Usar vermelho pra destruição confunde o sistema visual e dilui a marca.",
    invariants: [
      "NUNCA use --color-brand-* em botão destrutivo.",
      "SEMPRE adicione type-to-confirm pra ações irreversíveis.",
      "Ícone de alerta no header da modal pode ser âmbar (warning); nunca vermelho.",
    ],
  },
  {
    id: "error-state",
    keywords: ["erro", "error state", "validation error", "campo inválido", "invalid"],
    kind: "pattern",
    pattern: {
      title: "Estado de erro: âmbar, não vermelho",
      description:
        "Inputs inválidos e mensagens de erro usam a família semantic danger (âmbar/laranja: --color-danger-bg/fg/border), nunca vermelho da marca.",
      snippet: `<div className="field">
  <input
    aria-invalid="true"
    style={{ borderColor: 'var(--color-danger-border)' }}
  />
  <p style={{ color: 'var(--color-danger-fg)' }} className="t-body-sm">
    Informe um CPF válido.
  </p>
</div>`,
    },
    rationale:
      "Decisão arquitetural registrada no chat de criação: 'Teoria das cores não pode ser usada 100% no nosso DS' — vermelho é cor de marca, não de erro.",
    invariants: [
      "Borda de input inválido: var(--color-danger-border) (âmbar).",
      "Texto de erro: var(--color-danger-fg).",
      "Focus state usa --border-focus (ink), não vermelho.",
    ],
  },
  {
    id: "price-display",
    keywords: ["preço", "preco", "price", "valor monetário", "R$", "currency"],
    kind: "pattern",
    pattern: {
      title: "Exibição de preço",
      description: "Use a classe semântica .t-price (ou .t-price-sm) para que tabular-nums fique consistente.",
      snippet: `<span className="t-price">R$ 89,90</span>
{/* equivalente: */}
<span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>R$ 89,90</span>`,
    },
    rationale: "Tabular-nums evita pulinho visual quando o número muda (filtro, qty update).",
    invariants: ["Currency BR: R$ 89,90 — vírgula decimal, ponto milhar."],
  },
  {
    id: "icon-usage",
    keywords: ["ícone", "icone", "icon", "iconography", "lucide"],
    kind: "pattern",
    pattern: {
      title: "Iconografia: Lucide via CDN",
      description:
        "Use Lucide (https://lucide.dev), 2px stroke, 24px (ou 20px em dense). Cor sempre currentColor; em geral --fg-2, --fg-1 ativo, --fg-brand só quando o ícone É a identidade do controle (ex. carrinho no header).",
      snippet: `import { ShoppingCart } from 'lucide-react';
<ShoppingCart size={24} strokeWidth={2} style={{ color: 'var(--fg-2)' }} />`,
    },
    rationale: "Lucide harmoniza com Neue Montreal e fica modular.",
    invariants: ["NUNCA use emoji em UI Grocers.", "NUNCA hand-roll SVG quando Lucide tem o ícone."],
  },
  {
    id: "tone-of-voice",
    keywords: ["tom de voz", "copy", "microcopy", "tone", "linguagem", "writing"],
    kind: "pattern",
    pattern: {
      title: "Tom de voz Grocers",
      description:
        "Português Brasileiro, sentence case em headings/botões, segunda pessoa formal (você/seu). Sem emoji. Currency `R$ 89,90`. Marketing fala de 'Grocers' em 3a pessoa; produto fala em 'você'.",
      snippet: `Empty cart:  "Sua sacola está vazia"
Search:      "Buscar em mais de 12.000 produtos"
Loading:     "Carregando..."
Error:       "Não conseguimos finalizar seu pedido. Tente novamente."
Success:     "Pedido confirmado"
Address:     "Onde você quer receber?"`,
    },
    rationale: "Copy curta, direta, com responsabilidade ('Não conseguimos' não 'Algo deu errado').",
  },
];

function inferKit(intent: string): Kit | undefined {
  const lower = intent.toLowerCase();
  if (/\b(mobile|app|ios|android|celular|telefone)\b/.test(lower)) return "mobile";
  if (/\b(admin|painel|dashboard|gestor|gestão|backoffice|management)\b/.test(lower)) return "admin";
  if (/\b(web|site|desktop|browser|navegador|landing|e-?commerce)\b/.test(lower)) return "web";
  return undefined;
}

function scoreEntry(entry: IntentEntry, intent: string, kitHint?: Kit): number {
  const lower = intent.toLowerCase();
  let score = 0;
  for (const kw of entry.keywords) {
    if (lower.includes(kw.toLowerCase())) {
      score += kw.length >= 5 ? 12 : 6;
    }
  }
  if (entry.id.replace(/-/g, " ").split(" ").every((w) => lower.includes(w))) score += 4;
  if (kitHint && entry.component?.kit === kitHint) score += 14;
  if (kitHint && entry.component && entry.component.kit !== kitHint) score -= 12;
  return score;
}

export function registerSuggestTool(server: McpServer, index: DesignSystemIndex) {
  server.registerTool(
    "suggest_component",
    {
      title: "Suggest the idiomatic Grocers component or pattern for an intent",
      description:
        "Maps a natural-language intent (e.g. 'CTA destrutivo', 'KPI card', 'tela de carrinho', 'erro de CPF') " +
        "to the idiomatic Grocers component OR pattern. Returns either a component reference (with kit, name, " +
        "and the same source you'd get from get_component) OR a pattern (with description, snippet, and invariants). " +
        "Prefer this over searching by hand — encodes Grocers's brand decisions (e.g. vermelho ≠ erro, destrutivas " +
        "usam ink + type-to-confirm) that are not obvious from token names alone.",
      inputSchema: {
        intent: z
          .string()
          .min(2)
          .describe("Natural-language description of what you want to build (any language)."),
        kit: z
          .enum(["web", "mobile", "admin"])
          .optional()
          .describe("Optional kit hint to bias suggestions."),
        include_source: z
          .boolean()
          .optional()
          .describe("Include the full component source in the top suggestion. Default true."),
      },
    },
    async ({ intent, kit, include_source }) => {
      const includeSource = include_source ?? true;
      const effectiveKit = kit ?? inferKit(intent);
      const scored = INTENTS.map((entry) => ({
        entry,
        score: scoreEntry(entry, intent, effectiveKit),
      }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (scored.length === 0) {
        return asTextJson({
          found: false,
          intent,
          hint:
            "Não encontrei mapeamento direto. Tente palavras mais específicas (ex. 'kpi', 'destrutivo', 'pagar', 'carrinho') ou use a tool `search`.",
        });
      }

      const [top, ...rest] = scored;
      const buildEntry = (s: { entry: IntentEntry; score: number }, withSource: boolean) => {
        const e = s.entry;
        const base = {
          id: e.id,
          kind: e.kind,
          score: s.score,
          rationale: e.rationale,
          invariants: e.invariants,
          alternatives: e.alternatives,
        };
        if (e.kind === "component" && e.component) {
          const comp = index.componentsByName.get(`${e.component.kit}/${e.component.name}`);
          return {
            ...base,
            component: e.component,
            source: withSource && comp ? comp.source : undefined,
          };
        }
        if (e.kind === "pattern" && e.pattern) {
          return { ...base, pattern: e.pattern };
        }
        return base;
      };

      return asTextJson({
        found: true,
        intent,
        inferred_kit: effectiveKit,
        top: buildEntry(top, includeSource),
        other_matches: rest.map((s) => buildEntry(s, false)),
      });
    },
  );
}
