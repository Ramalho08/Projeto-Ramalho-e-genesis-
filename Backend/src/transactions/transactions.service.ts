/**
 * Transactions Service
 * Contém toda a lógica de negócio para transações
 *
 * Responsabilidades:
 * 1. Validar dados de entrada
 * 2. Verificar permissões do usuário
 * 3. Executar regras de negócio
 * 4. Chamar o repository para persistir dados
 * 5. Emitir eventos para processamento assíncrono
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/database/prisma.service';
import { CacheService } from '@/common/cache/cache.service';
import { AuditLogService } from '@/common/audit/audit-log.service';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  FilterTransactionDTO,
} from './dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly auditLog: AuditLogService,
  ) {}

  /**
   * Criar nova transação
   *
   * Validações:
   * 1. Categoria deve existir e pertencer ao usuário
   * 2. Valor deve ser maior que zero
   * 3. Data não pode ser futura
   * 4. Verificar para não criar duplicata acidental
   * 5. Registrar em auditoria
   *
   * @param userId - ID do usuário autenticado
   * @param dto - Dados da transação
   * @returns Transação criada
   */
  async create(userId: string, dto: CreateTransactionDTO): Promise<TransactionEntity> {
    this.logger.log(`Iniciando criação de transação para usuário: ${userId}`);

    // 1️⃣ Validar categoria
    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        userId: userId,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException(
        'Categoria não encontrada ou não pertence a este usuário',
      );
    }

    // 2️⃣ Validar dados
    if (dto.amount <= 0) {
      throw new BadRequestException('Valor deve ser maior que zero');
    }

    const transactionDate = new Date(dto.transactionDate);
    if (transactionDate > new Date()) {
      throw new BadRequestException(
        'Data da transação não pode ser no futuro',
      );
    }

    // 3️⃣ Validar tipo de transação vs categoria
    if (category.type !== 'both' && category.type !== dto.type) {
      throw new BadRequestException(
        `Categoria "${category.name}" só aceita transações do tipo ${category.type}`,
      );
    }

    // 4️⃣ Verificar duplicata acidental (mesma transação em menos de 5 minutos)
    const recentDuplicate = await this.prisma.transaction.findFirst({
      where: {
        userId: userId,
        amount: new Prisma.Decimal(dto.amount),
        categoryId: dto.categoryId,
        type: dto.type,
        transactionDate: transactionDate,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // últimos 5 minutos
        },
      },
    });

    if (recentDuplicate) {
      throw new ConflictException(
        'Transação duplicada detectada. Já existe uma transação com os mesmos dados.',
      );
    }

    // 5️⃣ Preparar dados da transação
    const [hours, minutes] = dto.transactionTime.split(':');
    const transactionDateTime = new Date(transactionDate);
    transactionDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // 6️⃣ Criar transação no banco
    const transaction = await this.prisma.transaction.create({
      data: {
        userId: userId,
        amount: new Prisma.Decimal(dto.amount),
        type: dto.type,
        categoryId: dto.categoryId,
        description: dto.description,
        transactionDate: transactionDate,
        transactionTime: dto.transactionTime,
        notes: dto.notes,
        isReconciled: false,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 7️⃣ Adicionar tags se fornecidas
    if (dto.tags && dto.tags.length > 0) {
      for (const tagName of dto.tags) {
        // Buscar ou criar tag
        const tag = await this.prisma.tag.upsert({
          where: {
            userId_name: {
              userId: userId,
              name: tagName,
            },
          },
          update: {},
          create: {
            userId: userId,
            name: tagName,
          },
        });

        // Associar tag à transação
        await this.prisma.transactionTag.create({
          data: {
            transactionId: transaction.id,
            tagId: tag.id,
          },
        });
      }
    }

    // 8️⃣ Registrar em auditoria
    await this.auditLog.log({
      userId: userId,
      action: 'CREATE',
      entity: 'transaction',
      entityId: transaction.id,
      changes: {
        before: null,
        after: transaction,
      },
    });

    // 9️⃣ Invalidar cache
    await this.cache.del(`user:${userId}:transactions:monthly`);
    await this.cache.del(`user:${userId}:balance`);

    // 🔟 Emitir evento para processamento assíncrono
    this.eventEmitter.emit('transaction.created', {
      transactionId: transaction.id,
      userId: userId,
      amount: dto.amount,
      type: dto.type,
      categoryId: dto.categoryId,
      timestamp: new Date(),
    });

    this.logger.log(`Transação criada com sucesso: ${transaction.id}`);

    return this.mapToEntity(transaction);
  }

  /**
   * Listar transações com filtros e paginação
   *
   * @param userId - ID do usuário
   * @param filterDTO - Filtros, paginação e ordenação
   * @returns Lista de transações com paginação e resumo
   */
  async findAll(userId: string, filterDTO: FilterTransactionDTO) {
    this.logger.log(`Listando transações para usuário: ${userId}`, filterDTO);

    // Validar parâmetros de paginação
    const skip = Math.max(0, filterDTO.skip || 0);
    const take = Math.min(filterDTO.take || 20, 100); // Máximo 100 por page

    // Construir filtro WHERE
    const where: Prisma.TransactionWhereInput = {
      userId: userId,
      deletedAt: null, // Não incluir transações deletadas
    };

    // Aplicar filtros opcionais
    if (filterDTO.type) {
      where.type = filterDTO.type;
    }

    if (filterDTO.categoryId) {
      where.categoryId = filterDTO.categoryId;
    }

    if (filterDTO.startDate) {
      where.transactionDate = {
        ...where.transactionDate,
        gte: new Date(filterDTO.startDate),
      };
    }

    if (filterDTO.endDate) {
      where.transactionDate = {
        ...where.transactionDate,
        lte: new Date(filterDTO.endDate),
      };
    }

    if (filterDTO.description) {
      where.description = {
        contains: filterDTO.description,
        mode: 'insensitive', // Busca case-insensitive
      };
    }

    // Construir ordenação
    const orderBy: Prisma.TransactionOrderByWithRelationInput = {};
    switch (filterDTO.sortBy) {
      case 'amount':
        orderBy.amount = filterDTO.sortOrder || 'desc';
        break;
      case 'created':
        orderBy.createdAt = filterDTO.sortOrder || 'desc';
        break;
      case 'date':
      default:
        orderBy.transactionDate = filterDTO.sortOrder || 'desc';
        orderBy.transactionTime = filterDTO.sortOrder || 'desc';
    }

    // Executar queries em paralelo
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // Calcular resumo financeiro
    const summary = await this.calculateSummary(userId, where);

    // Transformar para entidades
    const transactionEntities = transactions.map((t) => this.mapToEntity(t));

    return {
      transactions: transactionEntities,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
      summary,
    };
  }

  /**
   * Buscar uma transação específica
   *
   * @param userId - ID do usuário
   * @param transactionId - ID da transação
   * @returns Transação ou null se não encontrada
   */
  async findOne(userId: string, transactionId: string): Promise<TransactionEntity | null> {
    this.logger.log(`Buscando transação ${transactionId} para usuário ${userId}`);

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!transaction) {
      return null;
    }

    return this.mapToEntity(transaction);
  }

  /**
   * Atualizar transação existente
   *
   * Regras:
   * 1. Transação deve pertencer ao usuário
   * 2. Não pode atualizar se deletada
   * 3. Se reconciliada, apenas notas podem ser atualizadas
   * 4. Registrar mudanças em auditoria
   *
   * @param userId - ID do usuário
   * @param transactionId - ID da transação
   * @param dto - Dados a atualizar
   * @returns Transação atualizada
   */
  async update(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDTO,
  ): Promise<TransactionEntity | null> {
    this.logger.log(
      `Atualizando transação ${transactionId} para usuário ${userId}`,
      dto,
    );

    // Buscar transação
    const currentTransaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId,
        deletedAt: null,
      },
    });

    if (!currentTransaction) {
      return null;
    }

    // Se reconciliada, apenas notas podem ser atualizadas
    if (currentTransaction.isReconciled && Object.keys(dto).length > 0) {
      const updatableFields = ['notes'];
      const attemptedUpdates = Object.keys(dto);
      const invalidUpdates = attemptedUpdates.filter(
        (f) => !updatableFields.includes(f),
      );

      if (invalidUpdates.length > 0) {
        throw new ForbiddenException(
          `Não é possível atualizar transação reconciliada. Apenas notas podem ser editadas.`,
        );
      }
    }

    // Validar categoria se estiver sendo atualizada
    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          userId: userId,
          isActive: true,
        },
      });

      if (!category) {
        throw new NotFoundException(
          'Categoria não encontrada ou não pertence a este usuário',
        );
      }
    }

    // Validar data se estiver sendo atualizada
    if (dto.transactionDate) {
      const transactionDate = new Date(dto.transactionDate);
      if (transactionDate > new Date()) {
        throw new BadRequestException(
          'Data da transação não pode ser no futuro',
        );
      }
    }

    // Preparar dados de atualização
    const updateData: Prisma.TransactionUpdateInput = {};

    if (dto.amount !== undefined) {
      updateData.amount = new Prisma.Decimal(dto.amount);
    }

    if (dto.categoryId) {
      updateData.categoryId = dto.categoryId;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }

    if (dto.transactionDate !== undefined) {
      updateData.transactionDate = new Date(dto.transactionDate);
    }

    if (dto.transactionTime !== undefined) {
      updateData.transactionTime = dto.transactionTime;
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    if (dto.isReconciled !== undefined) {
      updateData.isReconciled = dto.isReconciled;
    }

    // Executar atualização
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Registrar em auditoria
    await this.auditLog.log({
      userId: userId,
      action: 'UPDATE',
      entity: 'transaction',
      entityId: transactionId,
      changes: {
        before: currentTransaction,
        after: updatedTransaction,
      },
    });

    // Invalidar cache
    await this.cache.del(`user:${userId}:transactions:monthly`);
    await this.cache.del(`user:${userId}:balance`);

    // Emitir evento
    this.eventEmitter.emit('transaction.updated', {
      transactionId: transactionId,
      userId: userId,
      changes: dto,
    });

    this.logger.log(`Transação ${transactionId} atualizada com sucesso`);

    return this.mapToEntity(updatedTransaction);
  }

  /**
   * Deletar transação (soft delete)
   *
   * @param userId - ID do usuário
   * @param transactionId - ID da transação
   */
  async remove(userId: string, transactionId: string): Promise<void> {
    this.logger.log(`Deletando transação ${transactionId} para usuário ${userId}`);

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId,
        deletedAt: null,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    // Soft delete
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        deletedAt: new Date(),
      },
    });

    // Registrar em auditoria
    await this.auditLog.log({
      userId: userId,
      action: 'DELETE',
      entity: 'transaction',
      entityId: transactionId,
      changes: {
        before: transaction,
        after: { ...transaction, deletedAt: new Date() },
      },
    });

    // Invalidar cache
    await this.cache.del(`user:${userId}:transactions:monthly`);
    await this.cache.del(`user:${userId}:balance`);

    // Emitir evento
    this.eventEmitter.emit('transaction.deleted', {
      transactionId: transactionId,
      userId: userId,
    });

    this.logger.log(`Transação ${transactionId} deletada com sucesso`);
  }

  /**
   * Obter estatísticas mensais
   *
   * @param userId - ID do usuário
   * @returns Estatísticas do mês atual
   */
  async getMonthlyStats(userId: string) {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Buscar transações do mês atual
    const currentMonthTransactions = await this.prisma.transaction.findMany({
      where: {
        userId: userId,
        transactionDate: {
          gte: currentMonth,
          lte: endOfCurrentMonth,
        },
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });

    // Calcular totais
    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum.plus(t.amount), new Prisma.Decimal(0));

    const totalExpense = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum.plus(t.amount), new Prisma.Decimal(0));

    const netBalance = totalIncome.minus(totalExpense);

    // Encontrar categoria com maior gasto
    const categoryExpenses = new Map();
    currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryExpenses.get(t.categoryId) || new Prisma.Decimal(0);
        categoryExpenses.set(t.categoryId, current.plus(t.amount));
      });

    let topExpenseCategory = null;
    if (categoryExpenses.size > 0) {
      const topCategoryId = [...categoryExpenses.entries()].sort(
        (a, b) => b[1].toNumber() - a[1].toNumber(),
      )[0][0];

      const topCategory = currentMonthTransactions.find(
        (t) => t.categoryId === topCategoryId,
      )?.category;

      topExpenseCategory = {
        id: topCategoryId,
        name: topCategory?.name,
        amount: categoryExpenses.get(topCategoryId),
        percentage: (
          (categoryExpenses.get(topCategoryId).toNumber() / totalExpense.toNumber()) *
          100
        ).toFixed(1),
      };
    }

    return {
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      totalIncome: totalIncome.toNumber(),
      totalExpense: totalExpense.toNumber(),
      netBalance: netBalance.toNumber(),
      topExpenseCategory,
      transactionCount: currentMonthTransactions.length,
      averageTransaction: (
        totalExpense.toNumber() /
        currentMonthTransactions.filter((t) => t.type === 'expense').length
      ).toFixed(2),
    };
  }

  /**
   * Calcular resumo financeiro baseado em filtro WHERE
   *
   * @private
   */
  private async calculateSummary(userId: string, where: Prisma.TransactionWhereInput) {
    const summary = await this.prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    const incomeSum = await this.prisma.transaction.aggregate({
      where: { ...where, type: 'income' },
      _sum: { amount: true },
    });

    const expenseSum = await this.prisma.transaction.aggregate({
      where: { ...where, type: 'expense' },
      _sum: { amount: true },
    });

    const totalIncome = incomeSum._sum?.amount?.toNumber() || 0;
    const totalExpense = expenseSum._sum?.amount?.toNumber() || 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  /**
   * Mapear objeto do Prisma para entidade do domínio
   *
   * @private
   */
  private mapToEntity(data: any): TransactionEntity {
    return {
      id: data.id,
      userId: data.userId,
      amount: data.amount.toNumber(),
      type: data.type,
      categoryId: data.categoryId,
      category: data.category
        ? {
            id: data.category.id,
            name: data.category.name,
            icon: data.category.icon,
            color: data.category.color,
          }
        : undefined,
      description: data.description,
      transactionDate: data.transactionDate.toISOString().split('T')[0],
      transactionTime: data.transactionTime,
      tags: data.tags?.map((t: any) => ({
        id: t.tag.id,
        name: t.tag.name,
        color: t.tag.color,
      })) || [],
      receiptUrl: data.receiptUrl,
      isReconciled: data.isReconciled,
      notes: data.notes,
      createdByDevice: data.createdByDevice,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
