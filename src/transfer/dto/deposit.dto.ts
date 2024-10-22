import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

/**
 * DTO for transfer details
 */
export class DepositDto {
  /**
   * The amount in the transfer context
   * @type {number}
   * @example 1
   */
  @IsPositive()
  @IsNumber()
  @ApiProperty({
    description: 'The amount in the transfer context',
    minimum: 1,
    default: 1,
    type: Number,
  })
  amount: number;

  /**
   * The description of the transaction
   * @type {string}
   * @example A payment for the service
   */
  @IsString()
  @ApiPropertyOptional({
    description: 'The description of the transaction',
    format: 'string',
    example: 'A payment for the service',
  })
  description?: string;
}
