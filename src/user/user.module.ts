import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/entities/token.entity';
import { Balance } from 'src/transfer/entities/balance.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * Represents a module for handling user in the system.
 * @class
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Balance])
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService],
  exports: [UserService],
})
export class UserModule {}
