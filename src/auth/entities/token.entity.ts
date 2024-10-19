import { IsString } from 'class-validator';
import { BaseTable } from 'src/base/base.table';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'tokens' })
export class Token extends BaseTable {
  @Column({ type: 'varchar' })
  @IsString()
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
