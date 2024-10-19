import { BaseTable } from 'src/base/base.table';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({
  name: 'balance',
})
export class Balance extends BaseTable {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @OneToOne(() => User, (user) => user.balance)
  user: User;
}
