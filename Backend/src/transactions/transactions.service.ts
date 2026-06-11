import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from './dto';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
  transactionDate: string;
  transactionTime: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
}

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = [];

  findAll() {
    return {
      statusCode: 200,
      data: this.transactions,
      total: this.transactions.length,
    };
  }

  create(dto: CreateTransactionDTO) {
    const transaction: Transaction = {
      id: `${Date.now()}`,
      amount: dto.amount,
      type: dto.type,
      categoryId: dto.categoryId,
      description: dto.description,
      transactionDate: dto.transactionDate,
      transactionTime: dto.transactionTime,
      tags: dto.tags,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(transaction);
    return {
      statusCode: 201,
      message: 'Transação criada com sucesso',
      data: transaction,
    };
  }
}
