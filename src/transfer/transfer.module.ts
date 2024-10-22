import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Transfer } from './entities/transfer.entity';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { Balance } from 'src/balance/entities/balance.entity';

/**
 * Represents a module for handling transfer in the system.
 * @class
 */
@Module({
  imports: [TypeOrmModule.forFeature([Transfer, User, Balance]), UserModule],
  controllers: [TransferController],
  providers: [TransferService, UserService, BalanceService],
})
export class TransferModule {}
