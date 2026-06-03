# 🎨 Design de UX/UI - Dashboard e Interfaces

## 1. Princípios de Design

### 1.1 Filosofia de Design
- **Simplicidade:** Interface limpa, sem clutter
- **Integridade:** Consistência visual em todos os pontos de contato
- **Acessibilidade:** WCAG 2.1 AA compliance
- **Responsividade:** Mobile-first approach (320px até 4K)
- **Performance:** Carregamento rápido, 60fps animations

### 1.2 Paleta de Cores

```
Primary (Ação):
  - #007AFF (Azul)
  - #0063CC (Azul escuro - hover)

Success (Receitas/Positivo):
  - #34C759 (Verde)
  - #30B04C (Verde escuro)

Warning (Alertas):
  - #FF9500 (Laranja)
  - #E68300 (Laranja escuro)

Error (Despesas/Negativo):
  - #FF3B30 (Vermelho)
  - #E62619 (Vermelho escuro)

Neutral:
  - #F5F5F7 (Fundo claro)
  - #FFFFFF (Branco puro)
  - #1D1D1D (Preto escuro - texto)
  - #999999 (Cinza médio - secundário)

Dark Mode:
  - #121212 (Fundo escuro)
  - #1E1E1E (Cards)
  - #EEEEEE (Texto)
```

### 1.3 Tipografia

```
Font: 'Inter' (Google Fonts - Open Source)

Headlines (Roboto, Bold):
  - H1: 32px / 1.2 line-height
  - H2: 24px / 1.3 line-height
  - H3: 18px / 1.4 line-height

Body (Inter, Regular):
  - Body Large: 16px / 1.5
  - Body Medium: 14px / 1.5
  - Body Small: 12px / 1.6

Labels: 12px / 1.4, Weight 500
```

### 1.4 Spacing System (8px base unit)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

---

## 2. Wireframes e Estrutura de Telas

### 2.1 Dashboard Principal

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  ├─ Logo | Busca | Notificações | Perfil | Menu            │
└─────────────────────────────────────────────────────────────┘
┌──────────────────────┬──────────────────────────────────────┐
│                      │                                      │
│  SIDEBAR             │  MAIN CONTENT                        │
│  ├─ Dashboard        │  ┌──────────────────────────────────┐│
│  ├─ Transações       │  │  RESUMO SALDO & KPIs             ││
│  ├─ Relatórios       │  ├─ Saldo: R$ 15.342,50             ││
│  ├─ Insights         │  ├─ Receitas: R$ 8.500              ││
│  ├─ Investimentos    │  ├─ Despesas: R$ 3.157,50           ││
│  ├─ Categorias       │  ├─ Meta do mês: 65%                ││
│  └─ Configurações    │  └──────────────────────────────────┘│
│                      │  ┌──────────────────────────────────┐│
│                      │  │  GRÁFICO DE DESPESAS (MÊS)       ││
│                      │  │  [Gráfico Pizza/Linha]           ││
│                      │  ├─ Alimentação: 32%                ││
│                      │  ├─ Transporte: 18%                 ││
│                      │  ├─ Saúde: 10%                      ││
│                      │  └─ Outros: 40%                     ││
│                      │  ┌──────────────────────────────────┐│
│                      │  │  ÚLTIMAS TRANSAÇÕES              ││
│                      │  ├─ [-] Uber - R$ 28,50 - Hoje     ││
│                      │  ├─ [+] Salário - R$ 5.000 - Hoje  ││
│                      │  ├─ [-] Supermercado - R$ 156 - Ontem││
│                      │  └─ [Ver Tudo]                      ││
│                      │  ┌──────────────────────────────────┐│
│                      │  │  INSIGHTS PERSONALIZADOS         ││
│                      │  ├─ ⚠️ Alerta: Delivery +35%        ││
│                      │  ├─ 💡 Ideia: Tesouro Direto        ││
│                      │  └─ ✅ Você economizou R$200!       ││
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

### 2.2 Estrutura Detalhada do Dashboard

#### **Seção 1: Header (Sticky Top)**

```
┌──────────────────────────────────────────────────────────────┐
│ [Π] Logo | [Busca: Procure transação...] | 🔔[3] | 👤 Menu │
└──────────────────────────────────────────────────────────────┘

Componentes:
- Logo: 32x32px com nome "FinanceFlow"
- Busca: SearchBar com autocomplete
- Notificações: Badge com contador
- Avatar: Clicável para menu dropdown
- Menu: { Perfil, Configurações, Sair }
```

#### **Seção 2: KPIs Resumidos (Cards Horizontais)**

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 💰 Saldo Total   │  │ 📈 Receitas Mês  │                │
│  │ R$ 15.342,50     │  │ R$ 8.500,00      │                │
│  │ ↑ +5,2% vs mês   │  │ ↓ -8,5% vs mês   │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 📉 Despesas Mês  │  │ 🎯 Meta Mês      │                │
│  │ R$ 3.157,50      │  │ 65% ████░░░░     │                │
│  │ ↑ +12,3% vs mês  │  │ R$2.000 / R$3.500│                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Interações:
- Cards clicáveis = Navega para gráfico detalhado
- Hover effect: Elevação + sombra
- Tooltip: Mostra comparação com mês anterior
```

#### **Seção 3: Gráficos Visuais**

**Gráfico 1: Distribuição de Despesas (Pie Chart)**

```
┌─────────────────────────────────────────────────────────────┐
│ Despesas por Categoria - Junho 2024                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│          ┌─────────────────┐                                │
│          │    Alimentação  │     Legenda:                   │
│          │      32%        │     🟢 Alimentação: 32%        │
│      ┌───┤  ████░░░░░░     │     🟠 Transporte: 18%        │
│      │   │                 │     🟡 Saúde: 10%             │
│      │   │    Transporte   │     🔴 Diversão: 15%          │
│      │   │      18%        │     🟣 Outros: 25%            │
│      │   │  ██░░░░░░░░     │                                │
│      │   └─────────────────┘                                │
│      │          │                                           │
│      └──────────┘                                           │
│                                                              │
│ Ações: [📥 Exportar] [⚙️ Personalizar] [📊 Detalhes]       │
└─────────────────────────────────────────────────────────────┘
```

**Gráfico 2: Fluxo Mensal (Line Chart)**

```
┌─────────────────────────────────────────────────────────────┐
│ Fluxo Mensal: Receitas vs Despesas                           │
├─────────────────────────────────────────────────────────────┤
│ R$                                                           │
│ 10k │                      ╱╲       ╱╲ Receitas (Verde)     │
│     │  ╱╲    ╱╲    ╱╲   ╱╲╱  ╲   ╱  ╲                      │
│ 8k  │ ╱  ╲  ╱  ╲  ╱  ╲╱        ╲╱    ╲                     │
│     │╱      ╱    ╲╱             ╲    ╱                      │
│ 6k  │     ╱                      ╲  ╱   Despesas (Vermelho)│
│ 4k  │──────────────────────────────────────────────────    │
│ 2k  │                                                       │
│ 0k  └────────────────────────────────────────────────────   │
│     Jun 1   Jun 8   Jun 15   Jun 22   Jun 29                │
│                                                              │
│ Intervalo: [Por Dia ▼] Zoom: [🔍+] [🔍-]                   │
└─────────────────────────────────────────────────────────────┘
```

#### **Seção 4: Últimas Transações (Tabela Simplificada)**

```
┌─────────────────────────────────────────────────────────────┐
│ Últimas Transações                                           │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Data    │ Descrição           │ Categoria   │ Valor        │
│ ────────┼─────────────────────┼─────────────┼──────────    │
│ 3 Jun   │ Uber                │ Transporte  │ -R$ 28,50    │
│         │ 14:32               │             │ 🟠           │
│ ────────┼─────────────────────┼─────────────┼──────────    │
│ 3 Jun   │ Salário             │ Receita     │ +R$ 5.000    │
│         │ 09:15               │             │ 🟢           │
│ ────────┼─────────────────────┼─────────────┼──────────    │
│ 2 Jun   │ Supermercado        │ Alimentação │ -R$ 156,78   │
│         │ 18:45               │             │🟢            │
│ ────────┼─────────────────────┼─────────────┼──────────    │
│ 2 Jun   │ Netflix             │ Diversão    │ -R$ 39,90    │
│         │ 00:00               │             │ 🟣           │
│                                                              │
│                                           [Ver Todas] →    │
└─────────────────────────────────────────────────────────────┘

Interações:
- Clique em transação: Abre detalhes em modal
- Hover: Mostra ações (editar, deletar, compartilhar)
- Swipe (mobile): Revela ações
```

#### **Seção 5: Insights Personalizados**

```
┌─────────────────────────────────────────────────────────────┐
│ Seus Insights - Ações Recomendadas                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚠️ ALERTA: Gastos com Delivery aumentaram 35%              │
│  ├─ Você gastou R$450 com delivery em junho vs              │
│  │  R$330 em maio. Considere cozinhar mais em casa.         │
│  ├─ [Entender mais] [Descartar]                             │
│  └─ Prioridade: Alta | Expira: em 5 dias                    │
│                                                              │
│  💡 OPORTUNIDADE: Começar a investir em Tesouro Direto      │
│  ├─ Você tem R$15.342 de saldo. Uma aplicação em            │
│  │  Tesouro IPCA+ 2030 pode render R$850/ano.               │
│  ├─ [Explorar Investimentos] [Depois]                       │
│  └─ Prioridade: Média | Expira: em 14 dias                  │
│                                                              │
│  ✅ CONQUISTA: Você economizou R$200 este mês!              │
│  ├─ Parabéns! Você gastou menos com alimentação             │
│  │  do que a sua meta. Continue assim!                       │
│  └─ [Compartilhar] [Fechar]                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Componentes:
- Ícone + Tipo de Insight (Cor codificada)
- Mensagem clara e acionável
- Botões de ação primária e secundária
- Metadata: Prioridade, Expiração, Data criação
```

---

### 2.3 Página de Transações

```
┌─────────────────────────────────────────────────────────────┐
│ Transações                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Filtros: [Tipo ▼] [Período ▼] [Categoria ▼] [Busca...]    │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ 📊 Resumo: Total Receitas: R$8.500 | Despesas:       │   │
│ │    R$3.157,50 | Saldo: R$5.342,50                     │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                              │
│ JUNHO 2024                                                   │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ 3 JUN - R$ 5.000,00 (Receita)                         │  │
│ ├─ [💰] Salário Junho              |  +R$ 5.000  [🟢]   │  │
│ │        Trabalho                 |  09:15              │  │
│ │        [✏️ Editar] [🗑️ Deletar]                       │  │
│ ├────────────────────────────────────────────────────────┤  │
│ │ 3 JUN - R$ 28,50 (Despesa)                            │  │
│ ├─ [🚗] Uber                       |  -R$ 28,50 [🟠]   │  │
│ │        Transporte               |  14:32              │  │
│ │        #work #commute           │  [Comprovante: ✓]   │  │
│ │        [✏️ Editar] [🗑️ Deletar]                       │  │
│ ├────────────────────────────────────────────────────────┤  │
│ │ 2 JUN - R$ 156,78 (Despesa)                           │  │
│ ├─ [🛒] Supermercado Carrefour     |  -R$ 156,78 [🟢]  │  │
│ │        Alimentação              |  18:45              │  │
│ │        [✏️ Editar] [🗑️ Deletar]                       │  │
│                                                              │
│ [← Anterior]              [Próximo →]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Formulário de Nova Transação (Modal)

```
┌──────────────────────────────────────────────────────────┐
│ ✕ Nova Transação                                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  [◉ Despesa] [ ○ Receita]                               │
│                                                           │
│  Valor *                                                 │
│  ┌──────────────────────────────────────────────┐       │
│  │ R$ │ [________].00              [X] R$0,00  │       │
│  └──────────────────────────────────────────────┘       │
│  Dica: Digite o valor (ex: 125.50)                       │
│                                                           │
│  Categoria *                                             │
│  ┌──────────────────────────────────────────────┐       │
│  │ [Selecione uma categoria ▼]                 │       │
│  │ 🟢 Alimentação                              │       │
│  │ 🟠 Transporte                               │       │
│  │ 🟡 Saúde                                    │       │
│  │ 🔴 Diversão                                 │       │
│  │ 🟣 Outros                                   │       │
│  └──────────────────────────────────────────────┘       │
│                                                           │
│  Descrição *                                             │
│  ┌──────────────────────────────────────────────┐       │
│  │ [_________________________________]          │       │
│  └──────────────────────────────────────────────┘       │
│  Máx 255 caracteres | 0/255                             │
│                                                           │
│  Data & Hora *                                           │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ [3 Jun 2024 ▼]  [14:32]        │                   │
│  └──────────────┘  └──────────────┘                    │
│                                                           │
│  Tags (Opcional)                                         │
│  [#work] [#commute] [#important]  [+ Adicionar]         │
│                                                           │
│  Comprovante (Opcional)                                  │
│  ┌──────────────────────────────────────────────┐       │
│  │ [📎 Clique ou arraste arquivo aqui]          │       │
│  │ Formatos: JPG, PNG, PDF (Máx 5MB)           │       │
│  └──────────────────────────────────────────────┘       │
│                                                           │
│  Notas (Opcional)                                        │
│  ┌──────────────────────────────────────────────┐       │
│  │ [_________________________________]          │       │
│  │ [_________________________________]          │       │
│  └──────────────────────────────────────────────┘       │
│                                                           │
│  ┌─────────────────────────────────────────────┐       │
│  │ [Cancelar]           [Salvar Transação]     │       │
│  └─────────────────────────────────────────────┘       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

### 2.5 Página de Relatórios

```
┌──────────────────────────────────────────────────────────────┐
│ Relatórios & Fechamento                                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Período: [Junho 1 - Junho 30, 2024 ▼]  [Gerar Novo] [📥]   │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ 📊 RELATÓRIO DE JUNHO 2024                              │  │
│ ├─────────────────────────────────────────────────────────┤  │
│ │                                                         │  │
│ │ RESUMO EXECUTIVO:                                       │  │
│ │ ├─ Receitas: R$8.500,00 (↓ 8,5% vs maio)              │  │
│ │ ├─ Despesas: R$3.157,50 (↑ 12,3% vs maio)             │  │
│ │ ├─ Saldo Líquido: +R$5.342,50                          │  │
│ │ └─ Performance Score: 72/100 ⭐⭐⭐⭐                   │  │
│ │                                                         │  │
│ │ CATEGORIA COM MAIOR GASTO:                              │  │
│ │ 🟢 Alimentação: R$1.850,50 (58.6% do total)            │  │
│ │    → Comparação: -5,2% vs maio                         │  │
│ │    → Recomendação: Manter com atenção a delivery       │  │
│ │                                                         │  │
│ │ RECOMENDAÇÕES PARA JULHO:                               │  │
│ │ 1. Reduzir gastos com delivery em 20%                  │  │
│ │ 2. Aumentar economia para fundo de emergência          │  │
│ │ 3. Considerar investir R$3.000 em Tesouro             │  │
│ │                                                         │  │
│ └─────────────────────────────────────────────────────────┘  │
│                                                               │
│ [📊 Ver Gráficos] [📋 Download PDF] [📊 Excel] [📧 Email]  │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ HISTÓRICO DE RELATÓRIOS                                 │  │
│ ├─────────────────────────────────────────────────────────┤  │
│ │ Maio 2024    │ 68/100  │ [Ver] [📥 PDF]               │  │
│ │ Abril 2024   │ 75/100  │ [Ver] [📥 PDF]               │  │
│ │ Março 2024   │ 71/100  │ [Ver] [📥 PDF]               │  │
│ │ Fevereiro    │ 69/100  │ [Ver] [📥 PDF]               │  │
│ └─────────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### 2.6 Página de Investimentos

```
┌──────────────────────────────────────────────────────────────┐
│ 💼 Ideias de Investimento                                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Seu Perfil: Conservador | Saldo Disponível: R$15.342,50     │
│ Filtro: [Risco: Todos ▼] [Liquidez ▼] [Retorno Min ▼]      │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 1. TESOURO IPCA+ 2030                                   │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 📊 Risco: Baixo | Liquidez: Alta | Retorno: 5,5% a.a.  │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ Aplicação Mínima: R$50                                  │ │
│ │ Retorno Esperado: R$850/ano (em R$15.342)               │ │
│ │ Recomendação: Aplicar R$5.000                           │ │
│ │                                                          │ │
│ │ "Tesouro Direto é uma excelente forma de começar a      │ │
│ │  investir. Seguro, com baixo risco e retorno previsível."│ │
│ │                                                          │ │
│ │ [🔗 Mais Informações]  [✅ Tenho Interesse]  [Depois]   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 2. CDB - BANCO ITAÚ (105% CDI)                          │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 📊 Risco: Baixo | Liquidez: Média | Retorno: ~11% a.a. │ │
│ │ Aplicação Mínima: R$1.000                               │ │
│ │ [🔗 Mais Informações]  [✅ Tenho Interesse]  [Depois]   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ [Carregando mais ideias...]                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### 2.7 Página de Autenticação (Login)

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                      💰 FinanceFlow                           │
│                  Organização Financeira Inteligente           │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  Bem-vindo de Volta!                   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  Email ou Telefone *                                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [_____________________________]                 │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  Senha *                                              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [___________________________] [👁️]             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  [✓] Lembrar-me  [Esqueceu a senha?]                 │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │          [Entrar]                              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ─────────────── OU ─────────────────                │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  [🔵 Google]     [🔵 Facebook]                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  [📱 Entrar com OTP via SMS]                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  Não tem conta? [Criar conta grátis]                 │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  Segurança 🔒 • Privacidade 🔐 • Termos                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Fluxo OTP:**

```
┌─────────────────────────┬──────────────────────┬──────────────┐
│   Passo 1: Número      │   Passo 2: OTP       │  Passo 3: OK │
├─────────────────────────┼──────────────────────┼──────────────┤
│ Telefone: ┌────────┐   │ Enviamos SMS para:   │ ✅ Sucesso!  │
│          │        │   │ +55 11 9XXXX-XXXX   │ Bem-vindo!   │
│          └────────┘   │                      │              │
│ [Enviar OTP]          │ Código: ┌────────┐  │ [Dashboard]  │
│                       │        │        │  │              │
│ ou [Whatsapp]         │        └────────┘  │              │
│                       │                      │              │
│                       │ Não recebeu?         │              │
│                       │ [Reenviar em 30s]    │              │
│                       │ [Outro método]       │              │
└─────────────────────────┴──────────────────────┴──────────────┘
```

---

## 3. Componentes Reutilizáveis (Design System)

### 3.1 Cards

```
╔════════════════════════════════════╗
║ 🏷️ Card Title                      ║
╠════════════════════════════════════╣
║ Card content goes here...          ║
║                                    ║
║ [Action Button] [Secondary Action] ║
╚════════════════════════════════════╝

Variantes:
- Elevated (sombra)
- Outlined (borda)
- Filled (fundo colorido)
```

### 3.2 Buttons

```
Primário (Ação principal):
┌─────────────────────┐
│ [Entrar/Enviar]     │ ← Azul, 16px, sem borda
└─────────────────────┘

Secundário (Ação alternativa):
┌─────────────────────┐
│ [Cancelar/Fechar]   │ ← Branco, borda cinza, 16px
└─────────────────────┘

Perigo (Ações destrutivas):
┌─────────────────────┐
│ [Deletar]           │ ← Vermelho, 16px
└─────────────────────┘

Success (Ações bem-sucedidas):
┌─────────────────────┐
│ [Confirmar]         │ ← Verde, 16px
└─────────────────────┘

Ícone + Texto: [📥] Download  │  [✓] Concluído  │  [🔗] Link
```

### 3.3 Inputs

```
Text Input:
┌────────────────────────────┐
│ Label                      │
├────────────────────────────┤
│ Placeholder text...        │
└────────────────────────────┘

Select:
┌────────────────────────────┐
│ [Opção Selecionada        ▼] │
├────────────────────────────┤
│ □ Opção 1                  │
│ ✓ Opção 2                  │
│ □ Opção 3                  │
└────────────────────────────┘

Checkbox:
☑ Lembrar-me de novo
☐ Não mostrar novamente

Radio:
◉ Despesa
○ Receita

Toggle:
[●────────] Dark Mode: ON
[────────●] Dark Mode: OFF
```

### 3.4 Notifications

```
Sucesso:
┌─────────────────────────────────────┐
│ ✅ Sucesso! Transação salva.        │
│ [Desfazer] [Fechar]                 │
└─────────────────────────────────────┘

Erro:
┌─────────────────────────────────────┐
│ ❌ Erro: Email já cadastrado.       │
│ [Tentar Novamente] [Fechar]         │
└─────────────────────────────────────┘

Aviso:
┌─────────────────────────────────────┐
│ ⚠️  Atenção: Você excedeu seu limite│
│ [Ver Detalhes] [Fechar]             │
└─────────────────────────────────────┘

Info:
┌─────────────────────────────────────┐
│ ℹ️  Nova versão disponível. Atualizar?│
│ [Atualizar] [Depois]                │
└─────────────────────────────────────┘
```

### 3.5 Modals/Dialogs

```
┌────────────────────────────────────┐
│ ✕ Título do Dialog                 │
├────────────────────────────────────┤
│                                    │
│ Conteúdo do dialog...              │
│ Com múltiplas linhas possível       │
│                                    │
│ ┌────────────────┬────────────────┐│
│ │ [Cancelar]     │ [Confirmar]   ││
│ └────────────────┴────────────────┘│
└────────────────────────────────────┘

Backdrop: Semi-transparente (rgba(0,0,0,0.5))
```

---

## 4. Responsividade e Breakpoints

```css
Mobile (xs):    320px - 479px
Tablet (sm):    480px - 767px
Desktop (md):   768px - 1023px
Wide (lg):      1024px - 1365px
4K (xl):        1366px+

/* Dashboard Breakpoints */
@media (max-width: 768px) {
  /* Sidebar vira drawer hamburger */
  /* Cards ficam full-width, em coluna */
  /* Gráficos ficam menores, podem usar scroll horizontal */
  /* Tabelas viram cards expandíveis */
}

@media (min-width: 1024px) {
  /* 2-3 colunas de cards */
  /* Gráficos lado a lado */
  /* Layout ideal para desktop */
}
```

---

## 5. Fluxo de Interação e Micro-interactions

### 5.1 Hover Effects

```
Buttons: Elevação + mudança de cor
- Primário: Azul → Azul Escuro + sombra
- Secundário: Branco → Cinza Claro + sombra

Cards: Elevação + zoom leve
- Sem hover: sombra padrão
- Com hover: sombra 12px, transform: scale(1.02)

Links: Underline animado
- Sem hover: sem underline
- Com hover: underline aparece em 200ms
```

### 5.2 Loading States

```
Skeleton Loading (antes de carregar dados):
┌──────────────────────────────┐
│ ████ (pulsando)              │
│ ████████████ (pulsando)      │
│ ████████ (pulsando)          │
└──────────────────────────────┘

Spinner (ações assíncronas):
  ⟳ Carregando...
  (rotação contínua)

Progresso (uploads, downloads):
████████░░░░░░░░░░░░ 40%
```

### 5.3 Feedback Visual

```
✅ Confirmação: Checkmark animado + cor verde
❌ Erro: X animado + cor vermelha
⏳ Processamento: Spinner + mensagem
✨ Sucesso: Confetti animation (opcional)
```

---

## 6. Acessibilidade (WCAG 2.1 AA)

### 6.1 Cores
- Contraste mínimo 4.5:1 para texto pequeno
- Contraste 3:1 para texto grande
- Não usar cor como único meio de comunicação (adicionar ícones/texto)

### 6.2 Keyboard Navigation
- Tab entre elementos focáveis
- Enter/Space para ativar
- Escape para fechar modals
- Setas para selects

### 6.3 Screen Reader
- Alt text em imagens descritivo
- ARIA labels em elementos interativos
- Ordem lógica de conteúdo (tabindex 0)
- Landmarks HTML5: <header>, <nav>, <main>, <footer>

### 6.4 Responsive Text
- Mínimo 14px para corpo de texto
- Line height mínimo 1.5
- Sem "zoom desabilitado" (meta viewport)

---

## 7. Prototipagem e Ferramentas

**Softwares Recomendados:**
- **Figma:** Design colaborativo (tem versão free)
- **Adobe XD:** Design e prototyping
- **Sketch:** Design (macOS)
- **InVision:** Prototyping interativo

**Link Figma Template:** [Será criado na fase de design]

**Documentação Viva:**
- Storybook.js para componentes React
- Design Tokens em JSON

---

## 8. Temas e Dark Mode

### 8.1 Light Theme (Padrão)

```json
{
  "colors": {
    "primary": "#007AFF",
    "background": "#FFFFFF",
    "surface": "#F5F5F7",
    "text": "#1D1D1D",
    "textSecondary": "#999999",
    "success": "#34C759",
    "error": "#FF3B30",
    "warning": "#FF9500"
  }
}
```

### 8.2 Dark Theme

```json
{
  "colors": {
    "primary": "#0A84FF",
    "background": "#121212",
    "surface": "#1E1E1E",
    "text": "#EEEEEE",
    "textSecondary": "#888888",
    "success": "#32D74B",
    "error": "#FF453A",
    "warning": "#FFB800"
  }
}
```

---

## 9. Próximas Etapas

1. ✅ Aprovação do design system
2. 📌 Criação de protótipos interativos em Figma
3. 📌 Testes de usabilidade com usuários reais
4. 📌 Implementação em React seguindo specs
5. 📌 Testes de acessibilidade automatizados
6. 📌 Deploy e feedback contínuo

**Referências:**
- `TECH_STACK.md` - Componentes React MUI
- Material Design: https://material.io
- Figma Community: https://www.figma.com/community
