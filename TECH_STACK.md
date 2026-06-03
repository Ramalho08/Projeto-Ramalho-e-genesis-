# 🛠️ Stack Tecnológico Recomendado

## 1. Resumo Executivo da Stack

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|--------------|
| **Frontend** | React 18 | 18.x | Componentes reativos, excelente comunidade |
| **Linguagem FE** | TypeScript | 5.x | Type safety, melhor experiência de desenvolvimento |
| **Styling** | Tailwind CSS | 3.x | Utility-first, customizável, produção-ready |
| **UI Components** | Material-UI (MUI) | 5.x | Componentes profissionais, acessibilidade WCAG |
| **State Management** | Redux Toolkit | 1.9.x | Predictable, devtools, middleware |
| **HTTP Client** | Axios | 1.x | Interceptors, cancelamento, melhor que fetch |
| **Forms** | React Hook Form | 7.x | Performance, lightweight, validation |
| **Charts** | Recharts | 2.x | Gráficos responsivos, React-friendly |
| **Backend** | Node.js/NestJS | LTS 20.x | JavaScript full-stack, ótima performance |
| **ORM** | Prisma | 5.x | Type-safe, migrations automáticas |
| **Database** | PostgreSQL | 15.x | Confiável, ACID compliant, ótimo para finanças |
| **Cache** | Redis | 7.x | Session storage, rate limiting, cache |
| **Message Queue** | Bull | 4.x | Job scheduling, background tasks |
| **Authentication** | Passport.js/Auth0 | 0.7.x | Integração OAuth, JWT, 2FA |
| **File Storage** | AWS S3 / MinIO | - | Escalável, seguro, backup automático |
| **Email** | SendGrid / SES | - | Transacional, entregabilidade alta |
| **SMS/WhatsApp** | Twilio | - | OTP, notificações, suporte mobile |
| **Testing** | Jest + RTL | 29.x | Framework padrão, snapshots |
| **Containerização** | Docker | 24.x | Isolamento, deployment simplificado |
| **Orquestração** | Kubernetes | 1.27.x | Escalabilidade, HA, production-ready |
| **CI/CD** | GitHub Actions | - | Integrado, gratuito, powerful |
| **Monitoring** | Prometheus + Grafana | - | Métricas, alertas, dashboards |
| **Logging** | ELK Stack | - | Centralizado, buscável, análise |

---

## 2. Frontend Stack - Detalhe

### 2.1 Estrutura Base

```json
{
  "dependencies": {
    "react": "18.x",
    "react-dom": "18.x",
    "react-router-dom": "6.x",
    "typescript": "5.x",
    "@mui/material": "5.x",
    "@mui/icons-material": "5.x",
    "tailwindcss": "3.x",
    "axios": "1.x",
    "react-hook-form": "7.x",
    "@hookform/resolvers": "3.x",
    "zod": "3.x",
    "recharts": "2.x",
    "@reduxjs/toolkit": "1.9.x",
    "react-redux": "8.x",
    "date-fns": "2.x",
    "clsx": "2.x",
    "lodash-es": "4.x"
  },
  "devDependencies": {
    "vite": "4.x",
    "vitest": "0.34.x",
    "@testing-library/react": "14.x",
    "@testing-library/jest-dom": "6.x",
    "eslint": "8.x",
    "prettier": "3.x"
  }
}
```

### 2.2 Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── TransactionCard.tsx
│   │   ├── insights/
│   │   │   ├── InsightCard.tsx
│   │   │   ├── InsightAlert.tsx
│   │   │   └── InsightsList.tsx
│   │   ├── reports/
│   │   │   ├── ReportDashboard.tsx
│   │   │   ├── ReportChart.tsx
│   │   │   └── ExportButton.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── OTPForm.tsx
│   │       └── SocialLogin.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Insights.tsx
│   │   ├── Reports.tsx
│   │   ├── Investments.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useTransactions.ts
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── transactionService.ts
│   │   ├── insightService.ts
│   │   └── reportService.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── transactionSlice.ts
│   │   │   ├── insightSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── domain.types.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── errors.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── tailwind.config.js
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── index.html
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .eslintrc.json
├── .prettierrc
└── package.json
```

### 2.3 Configuração Vite

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@mui/icons-material'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(
      process.env.REACT_APP_API_URL || 'http://localhost:3001'
    ),
  },
});
```

### 2.4 Exemplo de Componente (React Hooks)

```typescript
// src/components/transactions/TransactionForm.tsx
import { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useTransactions } from '@/hooks/useTransactions';
import { CreateTransactionDTO } from '@/types';

const transactionSchema = z.object({
  amount: z.string().min(1).transform(Number),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1),
  description: z.string().min(3).max(255),
  transactionDate: z.string(),
  transactionTime: z.string(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const TransactionForm: FC = () => {
  const { createTransaction, loading } = useTransactions();
  const { control, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      transactionDate: new Date().toISOString().split('T')[0],
      transactionTime: new Date().toTimeString().slice(0, 5),
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await createTransaction(data as CreateTransactionDTO);
      // Reset form, show success
    } catch (error) {
      // Show error notification
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Valor"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ step: '0.01', min: '0' }}
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select {...field} label="Tipo">
              <MenuItem value="income">Receita</MenuItem>
              <MenuItem value="expense">Despesa</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select {...field} label="Categoria">
              <MenuItem value="cat-1">Alimentação</MenuItem>
              <MenuItem value="cat-2">Transporte</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Controller
          name="transactionDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Data"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.transactionDate}
              helperText={errors.transactionDate?.message}
            />
          )}
        />

        <Controller
          name="transactionTime"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Horário"
              type="time"
              InputLabelProps={{ shrink: true }}
              error={!!errors.transactionTime}
              helperText={errors.transactionTime?.message}
            />
          )}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Salvando...' : 'Registrar Transação'}
      </Button>
    </Box>
  );
};
```

---

## 3. Backend Stack - Detalhe (Node.js/NestJS)

### 3.1 Dependências

```json
{
  "dependencies": {
    "@nestjs/common": "10.x",
    "@nestjs/core": "10.x",
    "@nestjs/platform-express": "10.x",
    "@nestjs/passport": "10.x",
    "@nestjs/jwt": "10.x",
    "@nestjs/config": "3.x",
    "@nestjs/typeorm": "9.x",
    "passport": "0.7.x",
    "passport-jwt": "4.x",
    "passport-google-oauth20": "2.x",
    "passport-facebook": "3.x",
    "@nestjs/bull": "10.x",
    "bull": "4.x",
    "redis": "4.x",
    "@prisma/client": "5.x",
    "pg": "8.x",
    "bcrypt": "5.x",
    "jsonwebtoken": "9.x",
    "class-validator": "0.14.x",
    "class-transformer": "0.5.x",
    "axios": "1.x",
    "dotenv": "16.x",
    "uuid": "9.x",
    "twilio": "4.x",
    "aws-sdk": "2.x",
    "helmet": "7.x",
    "cors": "2.x"
  },
  "devDependencies": {
    "@nestjs/cli": "10.x",
    "@nestjs/schematics": "10.x",
    "@types/node": "20.x",
    "typescript": "5.x",
    "@types/express": "4.x",
    "@types/jest": "29.x",
    "jest": "29.x",
    "ts-jest": "29.x",
    "ts-loader": "9.x",
    "@typescript-eslint/eslint-plugin": "6.x",
    "@typescript-eslint/parser": "6.x",
    "eslint": "8.x",
    "prettier": "3.x"
  }
}
```

### 3.2 Estrutura de Diretórios (NestJS)

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── google.strategy.ts
│   │   │   └── facebook.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── auth-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── otp.dto.ts
│   ├── transactions/
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.module.ts
│   │   ├── repositories/
│   │   │   └── transactions.repository.ts
│   │   ├── dto/
│   │   │   ├── create-transaction.dto.ts
│   │   │   ├── update-transaction.dto.ts
│   │   │   └── filter-transaction.dto.ts
│   │   └── entities/
│   │       └── transaction.entity.ts
│   ├── insights/
│   │   ├── insights.controller.ts
│   │   ├── insights.service.ts
│   │   ├── insights.module.ts
│   │   ├── algorithms/
│   │   │   ├── spending-detector.ts
│   │   │   ├── investment-recommender.ts
│   │   │   └── savings-calculator.ts
│   │   └── dto/
│   │       └── insight.dto.ts
│   ├── reports/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   ├── reports.module.ts
│   │   ├── generators/
│   │   │   ├── pdf-generator.ts
│   │   │   ├── csv-generator.ts
│   │   │   └── excel-generator.ts
│   │   └── dto/
│   │       └── report.dto.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── repositories/
│   │   │   └── users.repository.ts
│   │   └── dto/
│   │       └── user.dto.ts
│   ├── common/
│   │   ├── exceptions/
│   │   │   └── business.exception.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── middleware/
│   │   │   ├── request-id.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   ├── decorators/
│   │   │   └── public.decorator.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   ├── cache.config.ts
│   │   ├── mail.config.ts
│   │   └── storage.config.ts
│   ├── events/
│   │   ├── transaction-created.event.ts
│   │   └── events.emitter.ts
│   ├── workers/
│   │   ├── insights.worker.ts
│   │   ├── report-generator.worker.ts
│   │   └── notification.worker.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
│   ├── auth.spec.ts
│   ├── transactions.spec.ts
│   └── insights.spec.ts
├── docker/
│   ├── Dockerfile
│   └── .dockerignore
├── .env.example
├── .env.test
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Banco de Dados

### 4.1 PostgreSQL Setup

```yaml
# docker-compose.yml
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    container_name: fintech-db
    environment:
      POSTGRES_USER: fintech_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: fintech_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fintech_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: fintech-cache
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
```

### 4.2 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                  String      @id @default(uuid())
  email               String      @unique
  phone               String?     @unique
  passwordHash        String?
  name                String
  avatarUrl           String?
  riskProfile         String      @default("moderate")
  cycleType           String      @default("monthly")
  googleId            String?     @unique
  facebookId          String?     @unique
  isActive            Boolean     @default(true)
  emailVerified       Boolean     @default(false)
  phoneVerified       Boolean     @default(false)
  twoFactorEnabled    Boolean     @default(false)
  
  transactions        Transaction[]
  categories          Category[]
  tags                Tag[]
  insights            UserInsight[]
  investmentIdeas     InvestmentIdea[]
  reports             Report[]
  sessions            AuthSession[]
  auditLogs           AuditLog[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  lastLoginAt         DateTime?
  deletedAt           DateTime?   @db.Timestamp()

  @@index([email])
  @@index([isActive])
}

model Transaction {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  amount              Decimal     @db.Decimal(15, 2)
  type                String      // 'income' | 'expense'
  categoryId          String
  category            Category    @relation(fields: [categoryId], references: [id])
  description         String
  
  transactionDate     DateTime    @db.Date()
  transactionTime     DateTime    @db.Time()
  receiptUrl          String?
  receiptKey          String?
  
  isReconciled        Boolean     @default(false)
  notes               String?
  
  tags                TransactionTag[]
  
  createdByDevice     String?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  deletedAt           DateTime?

  @@index([userId, transactionDate(sort: Desc)])
  @@index([categoryId])
  @@unique([userId, amount, categoryId, transactionDate, transactionTime])
}

model Category {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name                String
  icon                String?
  color               String?
  type                String      // 'income' | 'expense' | 'both'
  
  parentCategoryId    String?
  parentCategory      Category?   @relation("SubCategories", fields: [parentCategoryId], references: [id], onDelete: Cascade)
  subCategories       Category[]  @relation("SubCategories")
  
  monthlyBudgetLimit  Decimal?    @db.Decimal(15, 2)
  isActive            Boolean     @default(true)
  
  transactions        Transaction[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@unique([userId, name])
  @@index([userId])
}

model Tag {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name                String
  color               String?
  
  transactions        TransactionTag[]
  
  createdAt           DateTime    @default(now())

  @@unique([userId, name])
  @@index([userId])
}

model TransactionTag {
  id                  String      @id @default(uuid())
  transactionId       String
  transaction         Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  tagId               String
  tag                 Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([transactionId, tagId])
}

model UserInsight {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  insightType         String      // 'spending_alert' | 'savings_opportunity' | 'investment_idea' | ...
  category            String?
  title               String
  message             String
  data                Json?
  
  actionUrl           String?
  actionText          String?
  
  priority            Int         @default(1)
  isRead              Boolean     @default(false)
  isActioned          Boolean     @default(false)
  
  createdAt           DateTime    @default(now())
  expiresAt           DateTime?

  @@index([userId, isRead])
  @@index([insightType])
}

model InvestmentIdea {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type                String      // 'tesouro_direto' | 'cdb' | 'fundo_imobiliario' | ...
  title               String
  description         String?
  
  minAmount           Decimal?    @db.Decimal(15, 2)
  expectedReturn      Decimal?    @db.Decimal(5, 2)
  riskLevel           String      // 'conservative' | 'moderate' | 'aggressive'
  liquidity           String      // 'high' | 'medium' | 'low'
  
  details             Json?
  linkProvider        String?
  recommendedAmount   Decimal?    @db.Decimal(15, 2)
  reason              String?
  
  isUserInterested    Boolean     @default(false)
  
  createdAt           DateTime    @default(now())

  @@index([userId])
  @@index([riskLevel])
}

model Report {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  periodStart         DateTime    @db.Date()
  periodEnd           DateTime    @db.Date()
  cycleType           String?     // 'weekly' | 'biweekly' | 'monthly'
  
  totalIncome         Decimal     @db.Decimal(15, 2)
  totalExpense        Decimal     @db.Decimal(15, 2)
  netBalance          Decimal     @db.Decimal(15, 2)
  
  incomeChangePercent Decimal?    @db.Decimal(5, 2)
  expenseChangePercent Decimal?   @db.Decimal(5, 2)
  
  performanceScore    Int         // 0-100
  
  topExpenseCategory  String?
  topExpenseAmount    Decimal?    @db.Decimal(15, 2)
  
  recommendations     Json?
  
  fileFormat          String?     // 'pdf' | 'csv' | 'excel'
  filePath            String?
  isExported          Boolean     @default(false)
  
  createdAt           DateTime    @default(now())

  @@index([userId, periodEnd(sort: Desc)])
  @@index([periodStart, periodEnd])
}

model AuthSession {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  tokenHash           String      @unique
  refreshTokenHash    String      @unique
  
  expiresAt           DateTime
  refreshExpiresAt    DateTime
  
  deviceInfo          Json?
  ipAddress           String?
  userAgent           String?
  
  isRevoked           Boolean     @default(false)
  
  createdAt           DateTime    @default(now())
  revokedAt           DateTime?

  @@index([userId, isRevoked])
  @@index([expiresAt])
}

model AuditLog {
  id                  String      @id @default(uuid())
  userId              String?
  user                User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action              String      // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN'
  entity              String?     // 'transaction' | 'user' | 'category'
  entityId            String?
  
  changes             Json?
  
  ipAddress           String?
  userAgent           String?
  
  timestamp           DateTime    @default(now())

  @@index([userId, timestamp(sort: Desc)])
  @@index([entity, entityId])
  @@index([timestamp(sort: Desc)])
}
```

---

## 5. Configuração de Ambiente

```bash
# .env.example
# Banco de dados
DATABASE_URL=postgresql://fintech_user:password@localhost:5432/fintech_db
DB_PASSWORD=your_secure_password

# Redis
REDIS_URL=redis://:password@localhost:6379

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=another_secret_key_min_32_chars
JWT_REFRESH_EXPIRATION=7d

# OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
FACEBOOK_APP_ID=xxxxx
FACEBOOK_APP_SECRET=xxxxx

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+14155552671

# AWS
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=fintech-documents

# SendGrid
SENDGRID_API_KEY=SG.xxxxx

# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# App
NODE_ENV=development
APP_PORT=3001
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug

# Security
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=10
```

---

## 6. Scripts e Automação

### 6.1 Package.json Scripts (Backend)

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "start:prod": "node dist/main.js",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "docker:build": "docker build -f docker/Dockerfile -t fintech-api:latest .",
    "docker:run": "docker run -p 3001:3001 fintech-api:latest"
  }
}
```

### 6.2 Package.json Scripts (Frontend)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit",
    "docker:build": "docker build -f Dockerfile -t fintech-ui:latest .",
    "docker:run": "docker run -p 3000:3000 fintech-ui:latest"
  }
}
```

---

## 7. Docker Compose Completo

```yaml
version: '3.9'

services:
  # Frontend
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: fintech-frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001
    depends_on:
      - api
    networks:
      - fintech-network

  # Backend API
  api:
    build:
      context: ./Backend
      dockerfile: docker/Dockerfile
    container_name: fintech-api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://fintech_user:${DB_PASSWORD}@postgres:5432/fintech_db
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      FACEBOOK_APP_ID: ${FACEBOOK_APP_ID}
      FACEBOOK_APP_SECRET: ${FACEBOOK_APP_SECRET}
      NODE_ENV: development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - fintech-network
    volumes:
      - ./Backend/src:/app/src

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: fintech-postgres
    environment:
      POSTGRES_USER: fintech_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: fintech_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fintech_user"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - fintech-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: fintech-redis
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - fintech-network

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: fintech-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@fintech.local
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - fintech-network

  # Redis Commander (Redis Management)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: fintech-redis-commander
    environment:
      REDIS_HOSTS: local:redis:6379:0:${REDIS_PASSWORD}
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - fintech-network

volumes:
  postgres_data:
  redis_data:

networks:
  fintech-network:
    driver: bridge
```

---

## 8. Próximas Etapas

1. ✅ Escolher stack tecnológico
2. 📌 Configurar ambiente de desenvolvimento
3. 📌 Implementar autenticação
4. 📌 Criar CRUD de transações
5. 📌 Desenvolver módulo de insights
6. 📌 Gerar relatórios
7. 📌 Testes e deployment

**Referências de leitura:**
- `ARCHITECTURE.md` - Design geral do sistema
- `/Backend/README.md` - Setup do backend
- `/Frontend/README.md` - Setup do frontend
