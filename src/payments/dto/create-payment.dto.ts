import { IsNumber, IsDateString, IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { PaymentStatus, PaymentType } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  status?: 'pending' | 'paid' | 'overdue';

  @IsString()
  @IsNotEmpty()
  type: 'monthly' | 'competition' | 'equipment';

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  playerId: number;
}
