/**
 * Transactions Controller
 * Responsável por receber requisições HTTP e orquestrá-las
 * para o serviço de transações
 *
 * Endpoints:
 * POST   /api/transactions              - Criar nova transação
 * GET    /api/transactions              - Listar transações (com filtro)
 * GET    /api/transactions/:id          - Obter detalhes de uma transação
 * PUT    /api/transactions/:id          - Atualizar transação
 * DELETE /api/transactions/:id          - Deletar transação
 * GET    /api/transactions/stats/month  - Estatísticas mensais
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  FilterTransactionDTO,
} from './dto';
import { User } from '@/users/entities/user.entity';

@ApiTags('Transações')
@Controller('api/transactions')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * POST /api/transactions
   *
   * Criar nova transação financeira
   *
   * Regras de Negócio:
   * 1. Usuário autenticado obrigatório
   * 2. Categoria deve pertencer ao usuário
   * 3. Valor deve ser positivo
   * 4. Data não pode ser futura
   * 5. Validar OTP se for grande valor (> R$1000)
   *
   * Exemplo de Requisição:
   * {
   *   \"amount\": 125.50,
   *   \"type\": \"expense\",
   *   \"categoryId\": \"cat-001\",
   *   \"description\": \"Almoço no restaurante\",
   *   \"transactionDate\": \"2024-06-03\",
   *   \"transactionTime\": \"12:30\",
   *   \"tags\": [\"work\", \"lunch\"],
   *   \"notes\": \"Reunião com cliente\"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova transação',
    description:
      'Cria uma nova transação financeira com validação de categoria, data e hora',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: 'user-001',
        amount: 125.5,
        type: 'expense',
        categoryId: 'cat-001',
        category: { name: 'Alimentação', icon: 'food' },
        description: 'Almoço no restaurante',
        transactionDate: '2024-06-03',
        transactionTime: '12:30:00',
        transactionDateTime: '2024-06-03T12:30:00.000Z',
        isReconciled: false,
        createdAt: '2024-06-03T14:32:45.123Z',
        updatedAt: '2024-06-03T14:32:45.123Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['amount must be a positive number', 'type must be expense or income'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async create(
    @AuthUser() user: User,
    @Body() createTransactionDTO: CreateTransactionDTO,
  ) {
    this.logger.log(`Criando transação para usuário: ${user.id}`);

    try {
      const transaction = await this.transactionsService.create(
        user.id,
        createTransactionDTO,
      );

      this.logger.log(`Transação criada com sucesso: ${transaction.id}`);

      // Emitir evento para disparar análises de insights em background
      // this.eventBus.emit('transaction.created', { ...transaction, userId: user.id });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transação criada com sucesso',
        data: transaction,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Erro ao criar transação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * GET /api/transactions
   *
   * Listar transações com filtros opcionais
   *
   * Query Parameters:
   * - type: 'income' | 'expense' (filtro por tipo)
   * - categoryId: UUID (filtro por categoria)
   * - startDate: YYYY-MM-DD (data inicial)
   * - endDate: YYYY-MM-DD (data final)
   * - description: string (busca por descrição)
   * - skip: number (paginação - offset)
   * - take: number (paginação - limit, máx 100)
   * - sortBy: 'date' | 'amount' | 'created' (ordenação)
   * - sortOrder: 'asc' | 'desc' (direção)
   *
   * Exemplo:
   * GET /api/transactions?type=expense&startDate=2024-06-01&endDate=2024-06-30&skip=0&take=20
   */
  @Get()
  @ApiOperation({
    summary: 'Listar transações',
    description: 'Lista as transações do usuário com filtros e paginação',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['income', 'expense'],
    description: 'Filtrar por tipo de transação',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'UUID da categoria para filtrar',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    example: '2024-06-01',
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    example: '2024-06-30',
    description: 'Data final (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    description: 'Busca por descrição (like search)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    example: 0,
    description: 'Número de registros a pular',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    example: 20,
    description: 'Número de registros a retornar (máx 100)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['date', 'amount', 'created'],
    description: 'Campo para ordenar',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Direção da ordenação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: 'user-001',
            amount: 125.5,
            type: 'expense',
            categoryId: 'cat-001',
            category: { name: 'Alimentação', icon: 'food', color: '#FF6B6B' },
            description: 'Almoço',
            transactionDate: '2024-06-03',
            transactionTime: '12:30:00',
            tags: ['work', 'lunch'],
            isReconciled: false,
            createdAt: '2024-06-03T14:32:45.123Z',
          },
        ],
        pagination: {
          total: 150,
          skip: 0,
          take: 20,
          pages: 8,
        },
        summary: {
          totalIncome: 8500,
          totalExpense: 3157.5,
          balance: 5342.5,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de filtro inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async findAll(
    @AuthUser() user: User,
    @Query() filterDTO: FilterTransactionDTO,
  ) {
    this.logger.log(`Listando transações para usuário: ${user.id}`, filterDTO);

    try {
      const result = await this.transactionsService.findAll(user.id, filterDTO);

      return {
        statusCode: HttpStatus.OK,
        data: result.transactions,
        pagination: result.pagination,
        summary: result.summary,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Erro ao listar transações: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * GET /api/transactions/:id
   *
   * Obter detalhes de uma transação específica
   *
   * Regras:
   * 1. Transação deve pertencer ao usuário autenticado
   * 2. Retornar 404 se não encontrada
   *
   * Exemplo:
   * GET /api/transactions/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obter transação por ID',
    description: 'Retorna os detalhes completos de uma transação',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da transação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: 'user-001',
        amount: 125.5,
        type: 'expense',
        category: {
          id: 'cat-001',
          name: 'Alimentação',
          icon: 'food',
          color: '#FF6B6B',
          monthlyBudgetLimit: 500,
        },
        description: 'Almoço no restaurante',
        transactionDate: '2024-06-03',
        transactionTime: '12:30:00',
        transactionDateTime: '2024-06-03T12:30:00.000Z',
        tags: [
          { id: 'tag-001', name: 'work', color: '#007AFF' },
          { id: 'tag-002', name: 'lunch', color: '#34C759' },
        ],
        receiptUrl: 'https://s3.amazonaws.com/fintech-docs/receipt-123.jpg',
        isReconciled: false,
        notes: 'Reunião com cliente',
        createdByDevice: 'iPhone 14 Pro',
        createdAt: '2024-06-03T14:32:45.123Z',
        updatedAt: '2024-06-03T14:32:45.123Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada ou não pertence ao usuário',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async findOne(
    @AuthUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    this.logger.log(`Buscando transação ${id} para usuário ${user.id}`);

    try {
      const transaction = await this.transactionsService.findOne(user.id, id);

      if (!transaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      return {
        statusCode: HttpStatus.OK,
        data: transaction,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar transação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * PUT /api/transactions/:id
   *
   * Atualizar transação existente
   *
   * Regras:
   * 1. Transação deve pertencer ao usuário
   * 2. Não pode mudar tipo de receita para despesa se já reconciliada
   * 3. Registrar auditoria da mudança
   *
   * Campos atualizáveis:
   * - amount
   * - categoryId
   * - description
   * - transactionDate
   * - transactionTime
   * - tags
   * - notes
   * - isReconciled
   *
   * Exemplo:
   * PUT /api/transactions/123e4567-e89b-12d3-a456-426614174000
   * {
   *   \"amount\": 130.00,
   *   \"description\": \"Almoço no restaurante (incluindo bebida)\"
   * }
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar transação',
    description: 'Atualiza dados de uma transação existente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da transação',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar (transação reconciliada)',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async update(
    @AuthUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTransactionDTO: UpdateTransactionDTO,
  ) {
    this.logger.log(
      `Atualizando transação ${id} para usuário ${user.id}`,
      updateTransactionDTO,
    );

    try {
      const transaction = await this.transactionsService.update(
        user.id,
        id,
        updateTransactionDTO,
      );

      if (!transaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      this.logger.log(`Transação ${id} atualizada com sucesso`);

      return {
        statusCode: HttpStatus.OK,
        message: 'Transação atualizada com sucesso',
        data: transaction,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Erro ao atualizar transação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * DELETE /api/transactions/:id
   *
   * Deletar transação (soft delete)
   *
   * Regras:
   * 1. Soft delete (não remove fisicamente)
   * 2. Registra quem/quando deletou
   * 3. Dados continuam em backup e auditoria
   *
   * Exemplo:
   * DELETE /api/transactions/123e4567-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar transação',
    description: 'Deleta uma transação (soft delete para conformidade LGPD)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da transação',
  })
  @ApiResponse({
    status: 204,
    description: 'Transação deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async remove(
    @AuthUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    this.logger.log(`Deletando transação ${id} para usuário ${user.id}`);

    try {
      await this.transactionsService.remove(user.id, id);

      this.logger.log(`Transação ${id} deletada com sucesso`);

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Transação deletada com sucesso',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Erro ao deletar transação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * GET /api/transactions/stats/monthly
   *
   * Obter estatísticas mensais do usuário
   *
   * Retorna:
   * - Receita total
   * - Despesa total
   * - Saldo líquido
   * - Maior categoria de gasto
   * - Comparação com mês anterior
   */
  @Get('stats/monthly')
  @ApiOperation({
    summary: 'Obter estatísticas mensais',
    description: 'Retorna resumo financeiro do mês atual',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      example: {
        month: '2024-06',
        totalIncome: 8500,
        totalExpense: 3157.5,
        netBalance: 5342.5,
        topExpenseCategory: {
          id: 'cat-001',
          name: 'Alimentação',
          amount: 1850.5,
          percentage: 58.6,
        },
        previousMonthComparison: {
          incomeChange: -8.5,
          expenseChange: 12.3,
          balanceChange: -20.8,
        },
        transactionCount: 45,
        averageTransaction: 72.17,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async getMonthlyStats(@AuthUser() user: User) {
    this.logger.log(`Obtendo estatísticas mensais para usuário ${user.id}`);

    try {
      const stats = await this.transactionsService.getMonthlyStats(user.id);

      return {
        statusCode: HttpStatus.OK,
        data: stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Erro ao obter estatísticas: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
