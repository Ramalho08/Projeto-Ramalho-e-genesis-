/**
 * Transaction Entity
 * Define a estrutura de uma transação no domínio da aplicação
 *
 * Entidades representam os conceitos de negócio centrais
 * e não devem conhecer detalhes de implementação (banco de dados, HTTP, etc)
 */

export interface TransactionEntity {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  description: string;
  transactionDate: string; // YYYY-MM-DD
  transactionTime: string; // HH:MM
  tags?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  receiptUrl?: string;
  isReconciled: boolean;
  notes?: string;
  createdByDevice?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exemplo de uso:
 *
 * const transaction: TransactionEntity = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   userId: 'user-001',
 *   amount: 125.50,
 *   type: 'expense',
 *   categoryId: 'cat-001',
 *   category: {
 *     id: 'cat-001',
 *     name: 'Alimentação',
 *     icon: 'food',
 *     color: '#FF6B6B',
 *   },
 *   description: 'Almoço no restaurante',
 *   transactionDate: '2024-06-03',
 *   transactionTime: '12:30',
 *   tags: [
 *     { id: 'tag-001', name: 'work', color: '#007AFF' },
 *     { id: 'tag-002', name: 'lunch', color: '#34C759' },
 *   ],
 *   receiptUrl: 'https://s3.amazonaws.com/fintech-docs/receipt-123.jpg',
 *   isReconciled: false,
 *   notes: 'Reunião com cliente',
 *   createdByDevice: 'iPhone 14 Pro',
 *   createdAt: new Date('2024-06-03T14:32:45.123Z'),
 *   updatedAt: new Date('2024-06-03T14:32:45.123Z'),
 * };
 */
