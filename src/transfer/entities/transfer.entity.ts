import { IsEnum } from 'class-validator';
import { BaseTable } from 'src/base/base.table';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESSFUL = 'successful',
}

@Entity({
  name: 'transfer',
})
export class Transfer extends BaseTable {
  @ManyToOne(() => User, (user) => user.sentTransfers, { eager: true })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedTransfers, { eager: true })
  receiver: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  @IsEnum(PAYMENT_STATUS)
  status: PAYMENT_STATUS;
}
