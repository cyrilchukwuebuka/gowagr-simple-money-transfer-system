import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/entities/token.entity';
import { Balance } from 'src/balance/entities/balance.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BalanceService } from 'src/balance/balance.service';
import { BalanceModule } from 'src/balance/balance.module';

/**
 * Represents a module for handling user in the system.
 * @class
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Balance]),
    forwardRef(() => BalanceModule),
  ],
  controllers: [UserController],
  providers: [BalanceService, UserService, AuthService, JwtService],
  exports: [UserService],
})
export class UserModule {}
