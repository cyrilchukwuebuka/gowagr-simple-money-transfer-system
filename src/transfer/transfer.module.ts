import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Transfer } from './entities/transfer.entity';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { User } from 'src/user/entities/user.entity';

/**
 * Represents a module for handling transfer in the system.
 * @class
 */
@Module({
  imports: [TypeOrmModule.forFeature([Transfer, User]), UserModule],
  controllers: [TransferController],
  providers: [TransferService, UserService],
})
export class TransferModule {}
