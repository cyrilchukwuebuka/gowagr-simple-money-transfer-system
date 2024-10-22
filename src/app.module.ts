import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/env.configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransferModule } from './transfer/transfer.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { BalanceModule } from './balance/balance.module';

/**
 * Represents the entry module in the system.
 * @class
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env'],
      cache: true,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    // CacheModule.register({
    //   isGlobal: true,
    // }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UserModule,
    TransferModule,
    EncryptModule,
    BalanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})

export class AppModule {}
