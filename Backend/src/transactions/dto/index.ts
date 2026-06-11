import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsDateString,
  IsUUID,
  IsArray,
  ArrayMinSize,
  Min,
  Length,
  Matches,
} from 'class-validator';

export class CreateTransactionDTO {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount: number;

  @IsIn(['income', 'expense'], {
    message: 'Tipo deve ser "income" ou "expense"',
  })
  type: 'income' | 'expense';

  @IsUUID('4', { message: 'categoryId deve ser um UUID válido' })
  categoryId: string;

  @IsString()
  @Length(3, 255, {
    message: 'Descrição deve ter entre 3 e 255 caracteres',
  })
  description: string;

  @IsDateString({}, { message: 'Data deve estar em formato ISO 8601' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  transactionDate: string;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora deve estar no formato HH:MM',
  })
  transactionTime: string;

  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array' })
  @ArrayMinSize(0)
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
