import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Balance } from './entities/balance.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

/**
 * Represents a module for handling balance in the system.
 * @class
 */
@Module({
  imports: [TypeOrmModule.forFeature([Balance, User]), forwardRef(() => UserModule)],
  controllers: [BalanceController],
  providers: [BalanceService, UserService],
  exports: [BalanceService],
})
export class BalanceModule {}
