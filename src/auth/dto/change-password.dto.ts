import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO for user password change
 */
export class ChangePasswordDto {
  /**
   * The current password for the user
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The current password for the user',
    format: 'string',
  })
  current_password: string;

  /**
   * The new password for the user
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The new password for the user',
    format: 'string',
  })
  new_password: string;
}
