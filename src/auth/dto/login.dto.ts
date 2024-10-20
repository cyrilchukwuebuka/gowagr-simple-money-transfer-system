import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO for user log in details
 */
export class LoginDto {
  /**
   * The current password for the user
   * @type {string}
   */
  @IsString()
  @ApiProperty({
    description: 'The current password for the user',
    format: 'string',
  })
  password: string;

  /**
   * The current username for the user
   * @type {string}
   */
  @IsString()
  @ApiProperty({
    description: 'The username for the user',
    format: 'string',
  })
  username: string;
}
