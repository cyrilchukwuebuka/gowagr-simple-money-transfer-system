import { BaseTable } from 'src/base/base.table';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, OneToOne, VersionColumn } from 'typeorm';

@Entity({
  name: 'balance',
})
@Index(['amount'])
export class Balance extends BaseTable {
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount: number;

  @OneToOne(() => User, (user) => user.balance)
  user: User;

  @VersionColumn()
  version: number;
}
