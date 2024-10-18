import * as bcrypt from 'bcrypt';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BaseTable } from 'src/base/base.table';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  AUTHOR = 'author',
  EDITOR = 'editor',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

export enum AUTH_TYPE {
  MANUAL = 'manual',
  GOOGLE = 'google',
}

@Entity({
  name: 'auth',
})
export class Auth extends BaseTable {
  @Column({ type: 'varchar', default: null })
  @IsString()
  firstname: string;

  @Column({ type: 'varchar', default: null })
  @IsString()
  lastname: string;

  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'text' })
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  @IsEnum(Role)
  @IsOptional()
  roles: Role[];

  @Column({ type: 'timestamp', default: null })
  @IsDateString()
  password_changed_at: Date;

  @Column({ type: 'date', default: null })
  @IsDateString()
  dob: Date;

  @Column({ type: 'enum', enum: Gender, default: null })
  @IsEnum(Gender)
  gender: Gender;

  @Column({ type: 'varchar', default: null, nullable: true })
  @IsOptional()
  @IsUrl()
  photo_url: string;

  @Column({ type: 'enum', enum: AUTH_TYPE, default: AUTH_TYPE.MANUAL })
  @IsEnum(AUTH_TYPE)
  auth_type: AUTH_TYPE;

  @Column({ type: 'boolean', default: false })
  @IsOptional()
  @IsBoolean()
  is_deactivated: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  @IsDateString()
  deactivated_at: string;

  @Column({ type: 'boolean', default: false })
  @IsOptional()
  @IsBoolean()
  is_subscribed: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.owner)
  subscriptions: Subscription[];

  @Column({ type: 'varchar', default: null })
  @IsString()
  country: string;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  @BeforeInsert()
  async encryptPassword() {
    this.password = await this.hashPassword(this.password);
  }
}
