import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/auth/entities/token.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * Represents a module for handling user in the system.
 * @class
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
