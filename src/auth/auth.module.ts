import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwt } from 'src/config/env.configuration';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token } from './entities/token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/user/user.service';
import { Balance } from 'src/balance/entities/balance.entity';


/**
 * Represents a module for handling authentication in the system.
 * @class
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Balance]),
    PassportModule,
    JwtModule.register(jwt),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
