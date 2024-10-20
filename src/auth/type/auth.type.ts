import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO for user log in details
 */
export class AuthResponse {
  /**
   * The access token for the authenticated user
   * @type {string}
   */
  @IsString()
  @ApiProperty({
    description: 'The access token for the authenticated user',
    format: 'string',
  })
  access_token: string;

  /**
   * User deactivation status
   * @type {Boolean}
   * @example true
   */
  @ApiProperty({
    description: 'User deactivation status',
    example: true,
  })
  is_deactivated: boolean;

  /**
   * Deactivation timestamp
   * @type {Date}
   * @example "2024-10-04T12:34:56Z"
   */
  @ApiProperty({
    description: 'Deactivation timestamp',
    example: '2024-10-04T12:34:56Z',
  })
  deactivated_at: string;
}

/**
 * DTO for user change password
 */
export class ChangePasswordResponse {
  /**
   * User success message
   * @type {string}
   */
  @IsString()
  @ApiProperty({
    description: 'User success message',
    format: 'string',
  })
  message: string;
}
