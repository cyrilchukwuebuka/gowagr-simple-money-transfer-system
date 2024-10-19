import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  receiverId: string;

  @IsPositive()
  @IsNumber()
  amount: number;

  @IsString()
  description: string;
}
