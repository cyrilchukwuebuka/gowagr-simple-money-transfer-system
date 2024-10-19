import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  firstname: string;

  @IsString()
  @MinLength(3)
  lastname: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @MinLength(3)
  country: string;
}
