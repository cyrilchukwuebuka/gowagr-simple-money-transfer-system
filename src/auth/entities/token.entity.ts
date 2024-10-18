import { IsString } from 'class-validator';
import { BaseTable } from 'src/base/base.table';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Auth } from './auth.entity';

@Entity({ name: 'tokens' })
export class Token extends BaseTable {
  @Column({ type: 'varchar' })
  @IsString()
  token: string;

  @OneToOne(() => Auth)
  @JoinColumn()
  auth: Auth;
}
