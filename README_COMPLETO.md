# 📚 README - Projeto FinanceFlow

## 🎯 Visão Geral

**FinanceFlow** é uma **Plataforma Web de Organização Financeira de Nível Profissional** desenvolvida com as melhores práticas de engenharia de software, arquitetura em camadas e padrões de design modernos.

A plataforma foi projetada para:
- ✅ Ajudar usuários a organizar e otimizar suas finanças pessoais
- ✅ Fornecer insights inteligentes baseados em IA
- ✅ Gerar relatórios detalhados e insights profissionais
- ✅ Oferecer recomendações personalizadas de investimentos
- ✅ Manter segurança e privacidade em nível corporativo

---

## 📋 Índice

1. [Stack Tecnológico](#-stack-tecnológico)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Setup Rápido](#-setup-rápido)
4. [Endpoints da API](#-endpoints-da-api)
5. [Exemplos de Uso](#-exemplos-de-uso)
6. [Arquitetura do Banco de Dados](#-arquitetura-do-banco-de-dados)
7. [Autenticação e Segurança](#-autenticação-e-segurança)
8. [Contribuindo](#-contribuindo)

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** com TypeScript
- **Material-UI (MUI)** para componentes
- **Tailwind CSS** para styling
- **Redux Toolkit** para state management
- **React Hook Form** para validação de formulários
- **Recharts** para gráficos e visualizações
- **Axios** para requisições HTTP
- **Vite** como build tool

### Backend
- **Node.js LTS 20** com NestJS 10
- **TypeScript** para type safety
- **Prisma ORM** para acesso a dados
- **PostgreSQL 15** como banco de dados principal
- **Redis 7** para cache e sessões
- **Bull Queue** para processamento de jobs
- **Passport.js** para autenticação
- **JWT** para autorização
- **Swagger/OpenAPI** para documentação

### DevOps & Monitoring
- **Docker** para containerização
- **Docker Compose** para orquestração local
- **Kubernetes** para produção
- **GitHub Actions** para CI/CD
- **Prometheus + Grafana** para monitoramento
- **ELK Stack** para logging centralizado

---

## 📁 Estrutura do Projeto

```
Projeto-Ramalho-e-genesis-/
├── README.md (este arquivo)
├── ARCHITECTURE.md           # 📐 Arquitetura técnica completa
├── DATABASE_SCHEMA.md        # 🗄️ Esquema do banco de dados
├── TECH_STACK.md            # 🛠️ Stack tecnológico detalhado
├── UI_UX_DESIGN.md          # 🎨 Design de UX/UI
│
├── Backend/
│   ├── src/
│   │   ├── auth/            # 🔐 Autenticação & Segurança
│   │   ├── transactions/    # 💰 Gestão de Transações
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── dto/
│   │   │   │   └── index.ts
│   │   │   └── entities/
│   │   ├── insights/        # 🧠 IA & Insights
│   │   ├── reports/         # 📊 Relatórios
│   │   ├── users/           # 👤 Usuários
│   │   ├── common/          # 🔧 Utilitários
│   │   ├── config/          # ⚙️ Configuração
│   │   └── main.ts          # 🚀 Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # 🗄️ Schema do Prisma
│   │   └── migrations/      # 📝 Migrações
│   ├── tests/               # ✅ Testes
│   ├── docker/              # 🐳 Docker
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md            # Backend setup
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # 🎨 Componentes React
│   │   ├── pages/           # 📄 Páginas
│   │   ├── hooks/           # 🪝 Custom Hooks
│   │   ├── services/        # 🔗 API Services
│   │   ├── store/           # 🗃️ Redux Store
│   │   ├── types/           # 📘 TypeScript Types
│   │   ├── utils/           # 🔧 Utilitários
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/              # 📦 Assets estáticos
│   ├── tests/               # ✅ Testes
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md            # Frontend setup
│
└── docker-compose.yml       # 🐳 Orchestração completa
```

---

## 🚀 Setup Rápido

### Pré-requisitos

- **Node.js** >= 20.0.0
- **Docker** && **Docker Compose** >= 2.0
- **PostgreSQL** 15 (ou via Docker)
- **Redis** 7 (ou via Docker)
- **Git**

### Instalação Rápida (5 minutos)

#### 1️⃣ Clonar Repositório

```bash
git clone https://github.com/Ramalho08/Projeto-Ramalho-e-genesis-.git
cd Projeto-Ramalho-e-genesis-
```

#### 2️⃣ Configurar Variáveis de Ambiente

```bash
# Backend
cp Backend/.env.example Backend/.env
cp Backend/.env.test Backend/.env.test

# Frontend  
cp Frontend/.env.example Frontend/.env
```

Editar `.env` com credenciais:
```bash
# Backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/fintech_db
REDIS_URL=redis://:password@localhost:6379
JWT_SECRET=your_super_secret_key_min_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
```

#### 3️⃣ Iniciar com Docker Compose

```bash
# Start todos os serviços (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Verificar se tudo está rodando
docker-compose ps

# Ver logs
docker-compose logs -f
```

#### 4️⃣ Executar Migrações

```bash
cd Backend
npm install
npm run db:push  # Criar tabelas
npm run db:seed  # Popular com dados de teste (opcional)
```

#### 5️⃣ Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **pgAdmin**: http://localhost:5050
- **Redis Commander**: http://localhost:8081

---

## 📡 Endpoints da API

### Autenticação

```
POST   /api/auth/register           - Registrar novo usuário
POST   /api/auth/login              - Login com email/senha
POST   /api/auth/login/social       - Login social (Google/Facebook)
POST   /api/auth/send-otp           - Enviar OTP via SMS
POST   /api/auth/verify-otp         - Verificar OTP
POST   /api/auth/refresh            - Renovar token JWT
POST   /api/auth/logout             - Logout (revocar token)
POST   /api/auth/2fa/enable         - Habilitar 2FA
```

### Transações (Exemplo: Criar transação)

```
POST   /api/transactions            - Criar transação ✨
GET    /api/transactions            - Listar transações (com filtro)
GET    /api/transactions/:id        - Obter transação por ID
PUT    /api/transactions/:id        - Atualizar transação
DELETE /api/transactions/:id        - Deletar transação
GET    /api/transactions/stats/monthly - Estatísticas do mês
```

### Categorias

```
POST   /api/categories              - Criar categoria
GET    /api/categories              - Listar categorias
PUT    /api/categories/:id          - Atualizar categoria
DELETE /api/categories/:id          - Deletar categoria
```

### Relatórios

```
GET    /api/reports                 - Listar relatórios
GET    /api/reports/:id             - Obter relatório
POST   /api/reports/generate        - Gerar novo relatório
GET    /api/reports/:id/export      - Exportar (PDF/Excel)
```

### Insights

```
GET    /api/insights                - Listar insights do usuário
GET    /api/insights/:id            - Obter insight específico
PATCH  /api/insights/:id/read       - Marcar como lido
POST   /api/insights/:id/action     - Tomar ação no insight
```

### Investimentos

```
GET    /api/investments/ideas       - Listar ideias de investimento
POST   /api/investments/ideas/:id/interest - Marcar como interessado
GET    /api/investments/portfolio   - Ver portfolio do usuário
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Criar Transação

**Request:**
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 125.50,
    "type": "expense",
    "categoryId": "cat-001",
    "description": "Almoço no restaurante",
    "transactionDate": "2024-06-03",
    "transactionTime": "12:30",
    "tags": ["work", "lunch"],
    "notes": "Reunião com cliente"
  }'
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Transação criada com sucesso",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-001",
    "amount": 125.5,
    "type": "expense",
    "categoryId": "cat-001",
    "category": {
      "name": "Alimentação",
      "icon": "food",
      "color": "#FF6B6B"
    },
    "description": "Almoço no restaurante",
    "transactionDate": "2024-06-03",
    "transactionTime": "12:30",
    "tags": ["work", "lunch"],
    "isReconciled": false,
    "createdAt": "2024-06-03T14:32:45.123Z",
    "updatedAt": "2024-06-03T14:32:45.123Z"
  },
  "timestamp": "2024-06-03T14:32:45.123Z"
}
```

### Exemplo 2: Listar Transações com Filtro

**Request:**
```bash
curl -X GET "http://localhost:3001/api/transactions?type=expense&startDate=2024-06-01&endDate=2024-06-30&take=10&sortBy=amount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "amount": 156.78,
      "description": "Supermercado",
      "category": { "name": "Alimentação" },
      "transactionDate": "2024-06-02"
    }
  ],
  "pagination": {
    "total": 45,
    "skip": 0,
    "take": 10,
    "pages": 5
  },
  "summary": {
    "totalIncome": 8500,
    "totalExpense": 3157.50,
    "balance": 5342.50
  },
  "timestamp": "2024-06-03T14:32:45.123Z"
}
```

### Exemplo 3: Obter Estatísticas Mensais

**Request:**
```bash
curl -X GET http://localhost:3001/api/transactions/stats/monthly \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "month": "2024-06",
    "totalIncome": 8500,
    "totalExpense": 3157.50,
    "netBalance": 5342.50,
    "topExpenseCategory": {
      "id": "cat-001",
      "name": "Alimentação",
      "amount": 1850.50,
      "percentage": "58.6"
    },
    "transactionCount": 45,
    "averageTransaction": "72.17"
  },
  "timestamp": "2024-06-03T14:32:45.123Z"
}
```

---

## 🗄️ Arquitetura do Banco de Dados

### Tabelas Principais

```
USERS (Usuários)
├── id (UUID)
├── email (unique)
├── password_hash (bcrypt)
├── name
├── risk_profile (conservative, moderate, aggressive)
└── ...

TRANSACTIONS (Transações)
├── id (UUID)
├── user_id (FK → USERS)
├── amount (Decimal)
├── type (income, expense)
├── category_id (FK → CATEGORIES)
├── description
├── transaction_date
├── transaction_time
├── transaction_datetime (GENERATED)
└── ...

CATEGORIES (Categorias)
├── id (UUID)
├── user_id (FK → USERS)
├── name
├── type (income, expense, both)
├── monthly_budget_limit
└── ...

INSIGHTS (Insights/Recomendações)
├── id (UUID)
├── user_id (FK → USERS)
├── insight_type
├── message
├── data (JSONB)
├── priority
└── ...

REPORTS (Relatórios)
├── id (UUID)
├── user_id (FK → USERS)
├── period_start
├── period_end
├── total_income
├── total_expense
├── performance_score
└── ...
```

Ver documentação completa em: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 🔐 Autenticação e Segurança

### Fluxo de Autenticação

```
1. Usuário entra email/telefone
   ↓
2. Sistema envia OTP (SMS/WhatsApp)
   ↓
3. Usuário verifica código
   ↓
4. Sistema emite JWT + Refresh Token
   ↓
5. Requisições subsequentes incluem JWT no header
   ↓
6. Servidor valida assinatura JWT
```

### Camadas de Segurança

✅ **HTTPS/TLS 1.3** - Criptografia em trânsito
✅ **JWT + Refresh Tokens** - Autenticação stateless
✅ **bcrypt + Salt** - Hash de senhas
✅ **AES-256** - Criptografia de dados sensíveis
✅ **CORS** - Proteção de origem
✅ **Rate Limiting** - Proteção contra força bruta
✅ **CSRF Tokens** - Proteção de formulários
✅ **Soft Delete** - Conformidade LGPD

---

## 📊 Exemplo de Resposta de Erro

```json
{
  "statusCode": 400,
  "message": [
    "amount must be a positive number",
    "type must be income or expense",
    "categoryId must be a valid UUID"
  ],
  "error": "Bad Request",
  "timestamp": "2024-06-03T14:32:45.123Z"
}
```

---

## 🧪 Testes

### Executar Testes

```bash
# Backend - Testes unitários
cd Backend
npm run test

# Backend - Testes com coverage
npm run test:cov

# Backend - Testes E2E
npm run test:e2e

# Frontend - Testes
cd Frontend
npm run test

# Frontend - Testes com coverage
npm run test:coverage
```

---

## 📝 Logs e Monitoramento

### Acessar Logs

```bash
# Logs do backend
docker-compose logs -f api

# Logs de todos os serviços
docker-compose logs -f

# Logs com filtro
docker-compose logs api | grep error
```

### Métricas (Prometheus)

```
http://localhost:9090
```

### Dashboards (Grafana)

```
http://localhost:3000
```

---

## 🚀 Deploy em Produção

### Checklist de Deploy

- [ ] Testes passando em 100%
- [ ] Variáveis de ambiente configuradas
- [ ] Backups de banco de dados agendados
- [ ] SSL/TLS certificado
- [ ] Rate limiting configurado
- [ ] Monitoring ativo (Prometheus + Grafana)
- [ ] Logs centralizados (ELK)
- [ ] Backup strategy definida

### Deploy em Kubernetes

```bash
# Criar namespace
kubectl create namespace fintech

# Deploy backend
kubectl apply -f k8s/backend.yaml -n fintech

# Deploy frontend
kubectl apply -f k8s/frontend.yaml -n fintech

# Deploy database
kubectl apply -f k8s/postgres.yaml -n fintech
```

---

## 📞 Suporte e Contribuição

### Reportar Bugs

1. Abra uma **GitHub Issue**
2. Descreva o problema com detalhes
3. Inclua logs e prints
4. Aguarde resposta da equipe

### Contribuir com Código

1. Fork o repositório
2. Crie branch: `git checkout -b feature/sua-feature`
3. Commit mudanças: `git commit -am 'Adiciona nova feature'`
4. Push para branch: `git push origin feature/sua-feature`
5. Abra Pull Request

---

## 📖 Documentação Completa

- [🏗️ ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura técnica detalhada
- [🗄️ DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Esquema do banco de dados
- [🛠️ TECH_STACK.md](TECH_STACK.md) - Stack tecnológico e setup
- [🎨 UI_UX_DESIGN.md](UI_UX_DESIGN.md) - Design e layout

---

## 📜 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes

---

## 👥 Equipe

- **Arquitetor de Soluções**: GitHub Copilot
- **Desenvolvedor Lead**: Seu Nome
- **DevOps Engineer**: Seu Nome
- **QA Engineer**: Seu Nome

---

## 🎯 Roadmap

### v1.0 (MVP - Q3 2024)
- ✅ Autenticação & Segurança
- ✅ CRUD de Transações
- ✅ Dashboard Básico
- ✅ Relatórios Simples

### v1.5 (Q4 2024)
- 📌 Insights IA
- 📌 Social Login
- 📌 Exportação Avançada
- 📌 Mobile App (React Native)

### v2.0 (Q1 2025)
- 📌 Integração com Bancos
- 📌 Marketplace de Serviços
- 📌 API Aberta
- 📌 Integrações com Brokers

---

**Última atualização**: 3 de Junho de 2024
**Status**: 🟢 Ativo e em desenvolvimento

---

Para dúvidas, abra uma issue ou envie email para support@financeflow.com
