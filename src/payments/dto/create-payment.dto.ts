import { IsNumber, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, PaymentType } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  playerId: number;
}
