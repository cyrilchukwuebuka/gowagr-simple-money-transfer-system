import * as bcrypt from 'bcrypt';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString
} from 'class-validator';
import { BaseTable } from 'src/base/base.table';
import { Balance } from 'src/balance/entities/balance.entity';
import { Transfer } from 'src/transfer/entities/transfer.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  VersionColumn
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Entity({
  name: 'user',
})
@Index(['firstname', 'lastname', 'username'])
export class User extends BaseTable {
  @Column({ type: 'varchar', default: null })
  @IsString()
  firstname: string;

  @Column({ type: 'varchar', default: null })
  @IsString()
  lastname: string;

  @Column({ type: 'varchar', default: null, unique: true })
  @IsString()
  username: string;

  @Column({ type: 'text' })
  @IsString()
  password: string;

  @Column({ type: 'timestamp', default: null })
  @IsDateString()
  password_changed_at: Date;

  @Column({ type: 'enum', enum: Gender, default: null })
  @IsEnum(Gender)
  gender: Gender;

  @Column({ type: 'boolean', default: false })
  @IsOptional()
  @IsBoolean()
  is_deactivated: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  @IsDateString()
  deactivated_at: string;

  @Column({ type: 'varchar', default: null })
  @IsString()
  country: string;

  @OneToOne(() => Balance, (balance) => balance.user, { cascade: true })
  @JoinColumn()
  balance: Balance;

  @OneToMany(() => Transfer, (transfer) => transfer.sender)
  sentTransfers: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.receiver)
  receivedTransfers: Transfer[];

  @VersionColumn()
  version: number;

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
