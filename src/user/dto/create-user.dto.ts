import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';
import { Gender } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user create details
 */
export class CreateUserDto {
  /**
   * The firstname of the user
   * @type {string}
   * @example "John"
   */
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The firstname of the user',
    format: 'string',
    example: 'John',
  })
  firstname: string;

  /**
   * The lastname of the user
   * @type {string}
   * @example "Doe"
   */
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The lastname of the user',
    format: 'string',
    example: 'Doe',
  })
  lastname: string;

  /**
   * The username of the user
   * @type {string}
   * @example "johndoe"
   */
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The username of the user',
    format: 'string',
    example: 'johndoe',
  })
  username: string;

  /**
   * The current password for the user
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The password for the user',
    example: '123456789',
  })
  password: string;

  @IsEnum(Gender)
  @ApiProperty({
    description: 'The gender of the user',
    enum: Gender,
    enumName: 'Gender',
    example: Gender.MALE,
  })
  gender: Gender;

  /**
   * The country of the user
   * @type {string}
   * @example "Nigeria"
   */
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The country of the user',
    format: 'string',
    example: 'Nigeria',
  })
  country: string;
}
