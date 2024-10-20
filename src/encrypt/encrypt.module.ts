import { Module } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { EncryptController } from './encrypt.controller';

/**
 * Represents a module for handling transfer in the system.
 * @class
 */
@Module({
  controllers: [EncryptController],
  providers: [EncryptService],
  exports: [EncryptService],
})
export class EncryptModule {}
