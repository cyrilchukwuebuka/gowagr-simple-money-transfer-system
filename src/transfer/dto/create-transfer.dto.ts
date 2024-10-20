import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

/**
 * DTO for transfer details
 */
export class CreateTransferDto {
  /**
   * The unique identifier of the user
   * @type {string}
   * @example "c1f74b35-d99c-4c49-9a2d-54a82440982e"
   */
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier of the receiving user',
    format: 'uuid',
    example: 'c1f74b35-d99c-4c49-9a2d-54a82440982e',
  })
  receiverId: string;

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
    type: Number
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
