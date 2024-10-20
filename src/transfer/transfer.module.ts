import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';

/**
 * Represents a module for handling transfer in the system.
 * @class
 */
@Module({
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
