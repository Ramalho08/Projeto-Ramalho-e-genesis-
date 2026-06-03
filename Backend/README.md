# 🚀 Backend Setup Guide

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Executar Aplicação](#executar-aplicação)
5. [Estrutura de Pastas](#estrutura-de-pastas)
6. [Scripts Disponíveis](#scripts-disponíveis)
7. [Banco de Dados](#banco-de-dados)
8. [Autenticação](#autenticação)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Pré-requisitos

```bash
# Verificar Node.js (>=20.0.0)
node --version

# Verificar npm (>=10.0.0)
npm --version

# Verificar Docker (opcional, mas recomendado)
docker --version
docker-compose --version
```

---

## 📦 Instalação

### 1. Clonar repositório

```bash
git clone https://github.com/Ramalho08/Projeto-Ramalho-e-genesis-.git
cd Projeto-Ramalho-e-genesis-/Backend
```

### 2. Instalar dependências

```bash
npm install

# Ou com yarn
yarn install
```

### 3. Instalar ferramentas CLI globais (opcional)

```bash
npm install -g @nestjs/cli
npm install -g prisma
```

---

## ⚙️ Configuração

### 1. Criar arquivo .env

```bash
cp .env.example .env
```

### 2. Configurar variáveis de ambiente

Editar `.env` com suas credenciais:

```bash
# ============================================
# 🗄️ BANCO DE DADOS
# ============================================

# PostgreSQL
DATABASE_URL=postgresql://fintech_user:your_secure_password@localhost:5432/fintech_db
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_USER=fintech_user
DB_NAME=fintech_db

# Redis
REDIS_URL=redis://:redis_password@localhost:6379
REDIS_PASSWORD=redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

# ============================================
# 🔐 AUTENTICAÇÃO & JWT
# ============================================

JWT_SECRET=your_super_secret_key_here_min_32_chars_for_security
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=another_secret_key_min_32_chars_for_refresh_tokens
JWT_REFRESH_EXPIRATION=7d

# OTP (One Time Password)
OTP_EXPIRATION_MINUTES=5
OTP_LENGTH=6

# ============================================
# 🔑 OAUTH (Social Login)
# ============================================

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

FACEBOOK_APP_ID=xxxxx
FACEBOOK_APP_SECRET=xxxxx
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/auth/facebook/callback

# ============================================
# 📱 TWILIO (SMS & WhatsApp)
# ============================================

TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+14155552671

# ============================================
# 📧 EMAIL (SendGrid)
# ============================================

SENDGRID_API_KEY=SG.xxxxx

# ============================================
# ☁️ AWS S3 (File Storage)
# ============================================

AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=fintech-documents
AWS_S3_URL=https://fintech-documents.s3.amazonaws.com

# ============================================
# 🌐 FRONTEND
# ============================================

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# ============================================
# 🚀 APLICAÇÃO
# ============================================

NODE_ENV=development
APP_PORT=3001
APP_NAME=FinanceFlow
APP_VERSION=1.0.0

# ============================================
# 📝 LOGGING
# ============================================

LOG_LEVEL=debug
LOG_FORMAT=json

# ============================================
# 🔒 SEGURANÇA
# ============================================

BCRYPT_ROUNDS=10
SESSION_EXPIRATION_HOURS=24
RATE_LIMIT_REQUESTS_PER_MINUTE=100

# ============================================
# 📊 ANALYTICS (Opcional)
# ============================================

SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 3. Verificar arquivo de ambiente

```bash
# Verificar se arquivo foi criado
cat .env

# Nunca fazer commit do arquivo .env!
# Adicionar ao .gitignore
echo ".env" >> .gitignore
```

---

## 🏃 Executar Aplicação

### Opção 1: Desenvolvimento Local (sem Docker)

#### Pré-requisito: Ter PostgreSQL e Redis rodando

```bash
# Instalar PostgreSQL localmente
# macOS
brew install postgresql redis

# Linux (Ubuntu)
sudo apt-get install postgresql redis-server

# Windows
# Download: https://www.postgresql.org/download/windows/
# Download: https://github.com/microsoftarchive/redis/releases
```

#### Iniciar PostgreSQL e Redis

```bash
# macOS
brew services start postgresql
brew services start redis

# Linux
sudo service postgresql start
sudo service redis-server start

# Windows (PostgreSQL)
# Procure "psql" na barra de pesquisa

# Windows (Redis)
# Execute o arquivo redis-server.exe
```

#### Executar aplicação em desenvolvimento

```bash
cd Backend

# Instalar dependências
npm install

# Executar migrações
npm run db:push

# Seed de dados (opcional)
npm run db:seed

# Iniciar em modo watch
npm run dev

# Aplicação estará disponível em: http://localhost:3001
```

### Opção 2: Com Docker Compose (Recomendado)

```bash
# A partir da raiz do projeto
docker-compose up -d

# Verificar se tudo iniciou
docker-compose ps

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down
```

---

## 📁 Estrutura de Pastas

```
Backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts      # Endpoints de autenticação
│   │   ├── auth.service.ts         # Lógica de autenticação
│   │   ├── auth.module.ts          # Módulo NestJS
│   │   ├── strategies/             # Estratégias Passport
│   │   ├── guards/                 # Guards JWT, etc
│   │   ├── decorators/             # Decoradores customizados
│   │   └── dto/                    # Data Transfer Objects
│   │
│   ├── transactions/               # ⭐ MÓDULO PRINCIPAL
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.module.ts
│   │   ├── repositories/
│   │   ├── dto/
│   │   ├── entities/
│   │   └── spec/                   # Testes
│   │
│   ├── insights/
│   │   ├── insights.controller.ts
│   │   ├── insights.service.ts
│   │   ├── algorithms/             # ML/IA algorithms
│   │   └── ...
│   │
│   ├── reports/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   ├── generators/             # PDF, Excel, CSV
│   │   └── ...
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── ...
│   │
│   ├── common/
│   │   ├── database/               # Prisma service
│   │   ├── cache/                  # Redis service
│   │   ├── exceptions/             # Custom exceptions
│   │   ├── filters/                # Global exception filters
│   │   ├── interceptors/           # Global interceptors
│   │   ├── middleware/             # Custom middleware
│   │   ├── guards/                 # Guards customizados
│   │   ├── pipes/                  # Pipes customizados
│   │   └── decorators/             # Decoradores globais
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   ├── cache.config.ts
│   │   ├── mail.config.ts
│   │   └── storage.config.ts
│   │
│   ├── events/                     # Event emitters
│   ├── workers/                    # Background jobs
│   ├── app.module.ts               # Root module
│   └── main.ts                     # Entry point
│
├── prisma/
│   ├── schema.prisma               # 🗄️ Database schema
│   └── migrations/                 # Migration history
│
├── tests/
│   ├── auth.spec.ts
│   ├── transactions.spec.ts
│   └── insights.spec.ts
│
├── docker/
│   ├── Dockerfile                  # Container image
│   └── .dockerignore
│
├── .env.example                    # Exemplo de variáveis
├── .env.test                       # Variáveis para testes
├── .eslintrc.json                  # ESLint config
├── .prettierrc                     # Prettier config
├── jest.config.js                  # Jest config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependências
├── package-lock.json
└── README.md                       # Este arquivo
```

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Modo watch (hot reload)
npm run dev

# Sem hot reload
npm run start:dev
```

### Build & Production

```bash
# Build para produção
npm run build

# Executar build (produção)
npm run start:prod

# Build com otimizações
npm run build:prod
```

### Banco de Dados

```bash
# Executar migrações pendentes
npm run db:push

# Criar nova migração
npm run db:migrate -- --name add_new_field

# Abrir interface gráfica do Prisma
npm run db:studio

# Seed database com dados de teste
npm run db:seed

# Resetar banco (⚠️ DELETE ALL DATA)
npm run db:reset
```

### Testes

```bash
# Executar todos os testes
npm run test

# Modo watch
npm run test:watch

# Com coverage
npm run test:cov

# Apenas testes E2E
npm run test:e2e
```

### Linting & Formatting

```bash
# Verificar problemas de linting
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Formatar código
npm run format
```

### Docker

```bash
# Build imagem Docker
npm run docker:build

# Executar container
npm run docker:run

# Build com tag
docker build -t fintech-api:1.0.0 -f docker/Dockerfile .
```

---

## 🗄️ Banco de Dados

### Estrutura das Principais Tabelas

```
Users → Transactions ← Categories
                        ↓
                        Tags
```

### Criar Banco Manualmente

```bash
# Conectar ao PostgreSQL
psql -U fintech_user -d postgres

# Criar banco
CREATE DATABASE fintech_db;

# Conectar ao banco novo
\c fintech_db

# Executar migrações
npm run db:push
```

### Backup & Restore

```bash
# Backup
pg_dump -U fintech_user fintech_db > backup.sql

# Restore
psql -U fintech_user fintech_db < backup.sql
```

---

## 🔐 Autenticação

### Fluxo de Login

1. **Usuário entra email/telefone**
   ```bash
   POST /api/auth/send-otp
   {
     "email": "user@example.com"
   }
   ```

2. **Sistema envia OTP**
   ```
   Email/SMS recebido com código: 123456
   ```

3. **Usuário verifica OTP**
   ```bash
   POST /api/auth/verify-otp
   {
     "email": "user@example.com",
     "otp": "123456"
   }
   ```

4. **Sistema retorna JWT**
   ```json
   {
     "accessToken": "eyJhbGc...",
     "refreshToken": "eyJhbGc...",
     "expiresIn": 86400
   }
   ```

5. **Usar JWT em requisições**
   ```bash
   curl -H "Authorization: Bearer eyJhbGc..." \
     http://localhost:3001/api/transactions
   ```

### Social Login (Google)

```bash
# Redirecionar para Google
GET /api/auth/google

# Google redireciona de volta
GET /api/auth/google/callback?code=xxxxx

# Retorna JWT
{
  "accessToken": "eyJhbGc...",
  "user": { "id": "...", "email": "..." }
}
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Port 5432 already in use"

```bash
# Encontrar processo usando porta
lsof -i :5432

# Matar processo
kill -9 <PID>

# Ou trocar porta no .env
DATABASE_URL=postgresql://user:pass@localhost:5433/fintech_db
```

### ❌ Erro: "Cannot connect to database"

```bash
# Verificar se PostgreSQL está rodando
psql -U fintech_user -d postgres

# Verificar conexão
psql postgresql://fintech_user:password@localhost:5432/fintech_db

# Se usar Docker
docker ps | grep postgres
```

### ❌ Erro: "PRISMA: Migration pending"

```bash
# Aplicar migrações pendentes
npm run db:push

# Ou resetar (⚠️ CUIDADO: deleta dados)
npm run db:reset
```

### ❌ Erro: "Redis connection failed"

```bash
# Verificar se Redis está rodando
redis-cli ping

# Se Docker
docker ps | grep redis

# Verificar credenciais em .env
echo $REDIS_URL
```

### ❌ Erro: "401 Unauthorized"

```bash
# Token expirado? Fazer refresh
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

# Token inválido? Fazer login novamente
POST /api/auth/send-otp
```

### ❌ Erro: "CORS error"

```bash
# Verificar CORS_ORIGIN em .env
echo $CORS_ORIGIN

# Deve ser igual ao frontend
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 Recursos Adicionais

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Redis Documentation](https://redis.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ✅ Checklist de Setup Completo

- [ ] Node.js instalado (v20+)
- [ ] Dependências instaladas (`npm install`)
- [ ] PostgreSQL rodando
- [ ] Redis rodando
- [ ] `.env` configurado
- [ ] Migrações aplicadas (`npm run db:push`)
- [ ] Aplicação iniciada (`npm run dev`)
- [ ] Swagger acessível (http://localhost:3001/api/docs)
- [ ] Testes passando (`npm test`)

---

## 🚀 Próximas Etapas

1. Explorar endpoints no Swagger: http://localhost:3001/api/docs
2. Criar primeiro usuário via `/api/auth/send-otp`
3. Criar transações via `/api/transactions`
4. Gerar relatórios via `/api/reports`
5. Verificar insights em `/api/insights`

---

**Dúvidas?** Abra uma issue ou consulte a [documentação principal](../ARCHITECTURE.md)

**Status**: 🟢 Pronto para desenvolvimento
