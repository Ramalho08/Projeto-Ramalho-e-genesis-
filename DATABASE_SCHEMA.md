# 🗄️ Esquema do Banco de Dados - Plataforma Financeira

## 1. Visão Geral do Modelo de Dados

O banco de dados foi projetado seguindo a normalização 3NF (Third Normal Form) para evitar redundância e garantir integridade referencial.

### Diagrama ER (Entity-Relationship)

```
┌─────────────┐
│    USERS    │
├─────────────┤
│ id (PK)     │──┐
│ email       │  │
│ phone       │  │
│ password    │  │
│ name        │  │
│ avatar_url  │  │
│ risk_profile│  │
│ created_at  │  │
│ updated_at  │  │
└─────────────┘  │
                 │
                 │ 1:N
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌─────────────────┐    ┌──────────────────┐
│  TRANSACTIONS   │    │  USER_INSIGHTS   │
├─────────────────┤    ├──────────────────┤
│ id (PK)         │    │ id (PK)          │
│ user_id (FK)    │    │ user_id (FK)     │
│ amount          │    │ insight_type     │
│ type            │    │ category         │
│ category_id(FK) │    │ message          │
│ description     │    │ data (JSON)      │
│ transaction_date│    │ priority         │
│ transaction_time│    │ is_read          │
│ receipt_url     │    │ created_at       │
│ created_at      │    └──────────────────┘
│ updated_at      │
│ deleted_at      │
└─────────────────┘
       │
       │ N:N (via Junction)
       │
┌──────────────────┐
│  TRANSACTION_TAGS│
├──────────────────┤
│ id (PK)          │
│ transaction_id   │
│ tag_id (FK)      │
└──────────────────┘
       │
       │ N:1
       │
    ┌──┴──────────┐
    │             │
    ▼             ▼
┌────────┐   ┌──────────────┐
│  TAGS  │   │ CATEGORIES   │
├────────┤   ├──────────────┤
│ id(PK) │   │ id (PK)      │
│ name   │   │ name         │
│ color  │   │ icon         │
│ user_id│   │ color        │
└────────┘   │ user_id      │
             └──────────────┘

┌──────────────────────┐
│  REPORTS             │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ period_start         │
│ period_end           │
│ cycle_type           │
│ total_income         │
│ total_expense        │
│ net_balance          │
│ performance_score    │
│ recommendations(JSON)│
│ file_path            │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│  INVESTMENT_IDEAS    │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ type                 │
│ title                │
│ description          │
│ min_amount           │
│ expected_return      │
│ risk_level           │
│ details (JSON)       │
│ link                 │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│  AUTH_SESSIONS       │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ token_hash           │
│ refresh_token_hash   │
│ expires_at           │
│ device_info          │
│ ip_address           │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│  AUDIT_LOGS          │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ action               │
│ entity               │
│ entity_id            │
│ changes (JSON)       │
│ timestamp            │
│ ip_address           │
└──────────────────────┘
```

---

## 2. Definição Detalhada das Tabelas

### 2.1 USERS

Tabela principal de usuários do sistema com autenticação segura.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  
  -- Perfil de investimento
  risk_profile VARCHAR(50) CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
  
  -- Ciclo de relatórios do usuário
  cycle_type VARCHAR(50) DEFAULT 'monthly' CHECK (cycle_type IN ('weekly', 'biweekly', 'monthly', 'custom')),
  
  -- Social Login IDs
  google_id VARCHAR(255) UNIQUE,
  facebook_id VARCHAR(255) UNIQUE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  
  -- Criptografia de dados sensíveis
  data_encryption_key_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
  
  -- Índices
  INDEX idx_email_hash (email),
  INDEX idx_user_active (is_active),
  INDEX idx_created_at (created_at)
);
```

**Campos importantes:**
- `password_hash`: Usar bcrypt com salt aleatório
- `risk_profile`: Perfil de investimento para recomendações
- `cycle_type`: Período de fechamento personalizado
- `deleted_at`: Para soft delete conforme LGPD

---

### 2.2 TRANSACTIONS

Tabela principal de transações financeiras com rastreamento completo.

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados financeiros
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  
  -- Categorização
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  
  -- Datetime precisos com timezone
  transaction_date DATE NOT NULL,
  transaction_time TIME NOT NULL,
  transaction_datetime TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS 
    (MAKE_TIMESTAMP(
      EXTRACT(YEAR FROM transaction_date)::INTEGER,
      EXTRACT(MONTH FROM transaction_date)::INTEGER,
      EXTRACT(DAY FROM transaction_date)::INTEGER,
      EXTRACT(HOUR FROM transaction_time)::INTEGER,
      EXTRACT(MINUTE FROM transaction_time)::INTEGER,
      EXTRACT(SECOND FROM transaction_time)::NUMERIC
    )) STORED,
  
  -- Attachments
  receipt_url TEXT,
  receipt_key VARCHAR(500), -- Para deletar do S3
  
  -- Status
  is_reconciled BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Auditoria
  created_by_device VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
  
  -- Índices para performance
  INDEX idx_user_transactions (user_id, transaction_date DESC),
  INDEX idx_category (category_id),
  INDEX idx_date_range (transaction_date),
  INDEX idx_type (type),
  UNIQUE INDEX idx_duplicate_check (
    user_id, 
    amount, 
    category_id, 
    transaction_date, 
    transaction_time
  ) -- Previne duplicatas acidentais
);
```

**Decisões de Design:**

1. **Separação de Data e Hora:**
   ```sql
   -- Permite buscar por período específico e filtrar por horário
   SELECT * FROM transactions 
   WHERE transaction_date BETWEEN '2024-01-01' AND '2024-01-31'
   AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 17;
   ```

2. **Campo Gerado (Computed Column):**
   - `transaction_datetime` é calculado automaticamente
   - Evita inconsistência entre data e hora

3. **Soft Delete:**
   - Respeita LGPD sem perder dados de auditoria

---

### 2.3 CATEGORIES

Categorização de transações com suporte a subcategorias.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- Ex: "food", "transport", "entertainment"
  color VARCHAR(7), -- Hex color: #FF0000
  
  type VARCHAR(50) CHECK (type IN ('income', 'expense', 'both')),
  
  -- Subcategorias
  parent_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  
  -- Budget limit opcional
  monthly_budget_limit DECIMAL(15, 2),
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_categories (user_id),
  INDEX idx_parent (parent_category_id)
);
```

**Exemplo de dados:**
```json
{
  "id": "cat-001",
  "user_id": "user-001",
  "name": "Alimentação",
  "icon": "food",
  "color": "#FF6B6B",
  "type": "expense",
  "monthly_budget_limit": 500.00,
  "parent_category_id": null
},
{
  "id": "cat-002",
  "user_id": "user-001",
  "name": "Restaurante",
  "parent_category_id": "cat-001"
}
```

---

### 2.4 TAGS

Tags personalizadas para marcar transações.

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7),
  
  UNIQUE (user_id, name),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_tags (user_id)
);

-- Tabela de junção N:N
CREATE TABLE transaction_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  
  UNIQUE (transaction_id, tag_id),
  
  INDEX idx_tag (tag_id)
);
```

---

### 2.5 USER_INSIGHTS

Insights e recomendações gerados para cada usuário.

```sql
CREATE TABLE user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  insight_type VARCHAR(100) NOT NULL CHECK (insight_type IN (
    'spending_alert',
    'savings_opportunity',
    'investment_idea',
    'budget_warning',
    'positive_achievement'
  )),
  
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Dados estruturados do insight
  data JSONB, -- Ex: { "category": "food", "increase_percent": 15, "suggestion": "..." }
  
  -- Recomendação de ação
  action_url VARCHAR(500),
  action_text VARCHAR(100),
  
  -- Prioridade
  priority INTEGER DEFAULT 1, -- 1 = low, 5 = critical
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_actioned BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  INDEX idx_user_insights (user_id, is_read),
  INDEX idx_type (insight_type),
  INDEX idx_priority (priority DESC)
);
```

**Exemplo de Insight:**
```json
{
  "id": "insight-001",
  "user_id": "user-001",
  "insight_type": "spending_alert",
  "category": "delivery",
  "title": "Alerta: Gastos com Delivery aumentaram 35%",
  "message": "Você gastou R$450 com delivery este mês, 35% a mais que o mês anterior. Considere cozinhar mais em casa para economizar.",
  "data": {
    "category": "delivery",
    "current_month_spending": 450,
    "previous_month_spending": 330,
    "increase_percent": 35,
    "monthly_average": 320
  },
  "priority": 3,
  "is_read": false
}
```

---

### 2.6 INVESTMENT_IDEAS

Ideias de investimento personalizadas baseadas no perfil de risco.

```sql
CREATE TABLE investment_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(100) NOT NULL CHECK (type IN (
    'tesouro_direto',
    'cdb',
    'fundo_imobiliario',
    'fundo_renda_fixa',
    'fundo_acao',
    'cripto',
    'acao'
  )),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Informações de investimento
  min_amount DECIMAL(15, 2),
  expected_return DECIMAL(5, 2), -- % ao ano
  risk_level VARCHAR(50) CHECK (risk_level IN ('conservative', 'moderate', 'aggressive')),
  liquidity VARCHAR(50) CHECK (liquidity IN ('high', 'medium', 'low')),
  
  -- Detalhes estruturados
  details JSONB,
  
  -- Link para mais informações
  link_provider VARCHAR(500),
  
  -- Recomendação
  recommended_amount DECIMAL(15, 2),
  reason TEXT,
  
  is_user_interested BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_ideas (user_id),
  INDEX idx_risk_level (risk_level)
);
```

**Exemplo:**
```json
{
  "type": "tesouro_direto",
  "title": "Tesouro IPCA+ 2030",
  "min_amount": 50,
  "expected_return": 5.5,
  "risk_level": "conservative",
  "liquidity": "high",
  "details": {
    "maturity_date": "2030-01-01",
    "current_rate": "IPCA + 5.5% a.a.",
    "minimum_hold": "365 days"
  },
  "recommended_amount": 5000,
  "reason": "Baseado no seu saldo de R$15.000 e perfil conservador"
}
```

---

### 2.7 REPORTS

Relatórios gerados ao final de cada período.

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  cycle_type VARCHAR(50), -- 'weekly', 'biweekly', 'monthly'
  
  -- Resumo financeiro
  total_income DECIMAL(15, 2),
  total_expense DECIMAL(15, 2),
  net_balance DECIMAL(15, 2),
  
  -- Comparação com período anterior
  income_change_percent DECIMAL(5, 2),
  expense_change_percent DECIMAL(5, 2),
  
  -- Score de performance
  performance_score INTEGER CHECK (performance_score BETWEEN 0 AND 100),
  
  -- Categoria com mais gasto
  top_expense_category VARCHAR(255),
  top_expense_amount DECIMAL(15, 2),
  
  -- Recomendações estruturadas
  recommendations JSONB,
  
  -- Arquivo gerado
  file_format VARCHAR(20) CHECK (file_format IN ('pdf', 'csv', 'excel')),
  file_path VARCHAR(500),
  
  is_exported BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_reports (user_id, period_end DESC),
  INDEX idx_period (period_start, period_end)
);
```

---

### 2.8 AUTH_SESSIONS

Tabela de sessões ativas para controle de login.

```sql
CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
  
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  refresh_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  device_info JSONB, -- { "type": "mobile", "os": "iOS", "browser": "Safari" }
  ip_address INET,
  user_agent VARCHAR(500),
  
  is_revoked BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP WITH TIME ZONE,
  
  INDEX idx_user_active_sessions (user_id, is_revoked),
  INDEX idx_expires (expires_at)
);
```

---

### 2.9 AUDIT_LOGS

Registro completo de auditoria para conformidade LGPD/GDPR.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc
  entity VARCHAR(100), -- 'transaction', 'user', 'category'
  entity_id UUID,
  
  changes JSONB, -- { "before": {...}, "after": {...} }
  
  ip_address INET,
  user_agent VARCHAR(500),
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_audit (user_id, timestamp DESC),
  INDEX idx_entity_audit (entity, entity_id),
  INDEX idx_timestamp (timestamp DESC)
);
```

---

## 3. Índices de Performance

```sql
-- Índices críticos para busca rápida
CREATE INDEX idx_user_transactions_recent 
  ON transactions(user_id, transaction_date DESC, transaction_time DESC);

CREATE INDEX idx_user_expenses_by_category 
  ON transactions(user_id, category_id, transaction_date DESC) 
  WHERE type = 'expense' AND deleted_at IS NULL;

CREATE INDEX idx_user_income_by_month 
  ON transactions(user_id, DATE_TRUNC('month', transaction_date), type) 
  WHERE type = 'income' AND deleted_at IS NULL;

-- Índice de texto para busca de descrição
CREATE INDEX idx_transaction_description_search 
  ON transactions USING GIN (to_tsvector('portuguese', description));
```

---

## 4. Constraints e Regras de Negócio

### 4.1 Validações de Aplicação

```sql
-- Não permitir categoria excluída
ALTER TABLE transactions ADD CONSTRAINT check_category_exists
  CHECK (category_id IS NOT NULL);

-- Amount sempre positivo
ALTER TABLE transactions ADD CONSTRAINT check_amount_positive
  CHECK (amount > 0);

-- Data da transação não pode ser futura
ALTER TABLE transactions ADD CONSTRAINT check_transaction_date_not_future
  CHECK (transaction_date <= CURRENT_DATE);

-- Período do relatório válido
ALTER TABLE reports ADD CONSTRAINT check_report_period_valid
  CHECK (period_start <= period_end);
```

---

## 5. Particionamento (Para escala)

Quando atingir milhões de registros:

```sql
-- Particionar transações por mês
CREATE TABLE transactions_2024_01 PARTITION OF transactions
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE transactions_2024_02 PARTITION OF transactions
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... etc
```

---

## 6. Backup e Recuperação

```bash
# Backup completo
pg_dump --file=backup.sql --verbose fintech_db

# Backup incremental (WAL archiving)
# Configure em postgresql.conf: 
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /backup/wal/%f'

# Restore
psql fintech_db < backup.sql
```

---

## 7. Script SQL de Criação (Completo)

Ver arquivo `schema.sql` no diretório `Backend/database/`

**Próximas etapas:**
1. Criar migração Prisma
2. Seed database com dados de teste
3. Configurar backups automáticos
4. Implementar replication para HA

---

**Próximas leituras:**
- `TECH_STACK.md` - Implementação prática
- `/Backend/database/schema.sql` - SQL completo
- `/Backend/database/migrations/` - Histórico de mudanças
