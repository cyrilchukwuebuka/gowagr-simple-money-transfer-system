import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsString,
  MinLength
} from 'class-validator';
import { Gender } from '../entities/auth.entity';

export class CreateAuthDto {
  @IsString()
  @MinLength(3)
  firstname: string;

  @IsString()
  @MinLength(3)
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @MinLength(3)
  country: string;

  @IsDateString()
  dob: Date;

  @IsEmpty()
  role: null;
}
