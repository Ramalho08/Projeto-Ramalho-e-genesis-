/**
 * DTOs (Data Transfer Objects) - Transactions
 *
 * DTOs definem a estrutura de dados esperada para entrada e saída
 * Usamos class-validator para validação automática
 */

import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsBoolean,
  Min,
  Max,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para criar nova transação
 *
 * Validações:
 * - amount: número positivo
 * - type: 'income' ou 'expense'
 * - categoryId: UUID válido
 * - description: string de 3 a 255 caracteres
 * - transactionDate: data em formato YYYY-MM-DD, não pode ser futura
 * - transactionTime: hora em formato HH:MM
 */
export class CreateTransactionDTO {
  @ApiProperty({
    description: 'Valor da transação',
    type: Number,
    example: 125.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, {
    message: 'Valor deve ser maior que zero',
  })
  amount: number;

  @ApiProperty({
    description: 'Tipo da transação',
    enum: ['income', 'expense'],
    example: 'expense',
  })
  @IsEnum(['income', 'expense'], {
    message: 'Tipo deve ser "income" ou "expense"',
  })
  type: 'income' | 'expense';

  @ApiProperty({
    description: 'ID da categoria',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, {
    message: 'categoryId deve ser um UUID válido',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Descrição da transação',
    type: String,
    minLength: 3,
    maxLength: 255,
    example: 'Almoço no restaurante',
  })
  @IsString()
  @Length(3, 255, {
    message: 'Descrição deve ter entre 3 e 255 caracteres',
  })
  description: string;

  @ApiProperty({
    description: 'Data da transação (YYYY-MM-DD)',
    type: String,
    format: 'date',
    example: '2024-06-03',
  })
  @IsDateString({}, {
    message: 'Data deve estar em formato ISO 8601 (YYYY-MM-DD)',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  transactionDate: string;

  @ApiProperty({
    description: 'Hora da transação (HH:MM)',
    type: String,
    example: '12:30',
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora deve estar no formato HH:MM (00:00 até 23:59)',
  })
  transactionTime: string;

  @ApiPropertyOptional({
    description: 'Tags para categorizar a transação',
    type: [String],
    example: ['work', 'lunch'],
  })
  @IsOptional()
  @IsArray({
    message: 'Tags deve ser um array',
  })
  @ArrayMinSize(0)
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Notas adicionais',
    type: String,
    example: 'Reunião com cliente',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'URL do comprovante (preenchido após upload)',
    type: String,
    format: 'uri',
  })
  @IsOptional()
  @IsString()
  receiptUrl?: string;
}

/**
 * DTO para atualizar transação existente
 *
 * Todos os campos são opcionais
 * Apenas os campos fornecidos serão atualizados
 */
export class UpdateTransactionDTO {
  @ApiPropertyOptional({
    description: 'Novo valor da transação',
    type: Number,
    example: 130.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Nova categoria',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4)
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Nova descrição',
    type: String,
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Nova data (YYYY-MM-DD)',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  transactionDate?: string;

  @ApiPropertyOptional({
    description: 'Novo horário (HH:MM)',
    type: String,
    example: '14:45',
  })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  transactionTime?: string;

  @ApiPropertyOptional({
    description: 'Novas tags',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Notas atualizadas',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Marcar como reconciliada',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isReconciled?: boolean;

  @ApiPropertyOptional({
    description: 'URL do novo comprovante',
    type: String,
    format: 'uri',
  })
  @IsOptional()
  @IsString()
  receiptUrl?: string;
}

/**
 * DTO para filtrar e listar transações
 *
 * Parâmetros opcionais para:
 * - Filtrar por tipo, categoria, período
 * - Buscar por descrição
 * - Paginar resultados
 * - Ordenar por diferentes campos
 */
export class FilterTransactionDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de transação',
    enum: ['income', 'expense'],
    example: 'expense',
  })
  @IsOptional()
  @IsEnum(['income', 'expense'])
  type?: 'income' | 'expense';

  @ApiPropertyOptional({
    description: 'Filtrar por ID da categoria',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4)
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Data inicial para filtro (YYYY-MM-DD)',
    type: String,
    format: 'date',
    example: '2024-06-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final para filtro (YYYY-MM-DD)',
    type: String,
    format: 'date',
    example: '2024-06-30',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Buscar por descrição (case-insensitive)',
    type: String,
    example: 'Uber',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Número de registros a pular (offset)',
    type: Number,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Número de registros a retornar (limit, máximo 100)',
    type: Number,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  take?: number = 20;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    enum: ['date', 'amount', 'created'],
    default: 'date',
  })
  @IsOptional()
  @IsEnum(['date', 'amount', 'created'])
  sortBy?: 'date' | 'amount' | 'created' = 'date';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * DTO para bulk upload de transações
 *
 * Permite importar múltiplas transações de um arquivo CSV
 */
export class BulkUploadTransactionDTO {
  @ApiProperty({
    description: 'Array de transações para importar',
    type: [CreateTransactionDTO],
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Deve ter pelo menos uma transação',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDTO)
  transactions: CreateTransactionDTO[];
}

/**
 * DTO para resposta de transação (saída)
 *
 * Define a estrutura de dados retornada pela API
 */
export class TransactionResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({
    enum: ['income', 'expense'],
  })
  type: 'income' | 'expense';

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };

  @ApiProperty()
  description: string;

  @ApiProperty({
    format: 'date',
  })
  transactionDate: string;

  @ApiProperty()
  transactionTime: string;

  @ApiPropertyOptional({
    type: [Object],
  })
  tags?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;

  @ApiPropertyOptional()
  receiptUrl?: string;

  @ApiProperty()
  isReconciled: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * DTO para resposta listada (paginada)
 */
export class TransactionListResponseDTO {
  @ApiProperty({
    type: [TransactionResponseDTO],
  })
  data: TransactionResponseDTO[];

  @ApiProperty()
  pagination: {
    total: number;
    skip: number;
    take: number;
    pages: number;
  };

  @ApiProperty()
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

/**
 * DTO para resumo mensal
 */
export class MonthlySummaryDTO {
  @ApiProperty({
    example: '2024-06',
    description: 'Mês no formato YYYY-MM',
  })
  month: string;

  @ApiProperty({
    description: 'Receita total do mês',
  })
  totalIncome: number;

  @ApiProperty({
    description: 'Despesa total do mês',
  })
  totalExpense: number;

  @ApiProperty({
    description: 'Saldo líquido do mês',
  })
  netBalance: number;

  @ApiPropertyOptional({
    description: 'Categoria com maior gasto',
  })
  topExpenseCategory?: {
    id: string;
    name: string;
    amount: number;
    percentage: string;
  };

  @ApiProperty({
    description: 'Total de transações no mês',
  })
  transactionCount: number;

  @ApiProperty({
    description: 'Média de valor por transação',
  })
  averageTransaction: string;
}
