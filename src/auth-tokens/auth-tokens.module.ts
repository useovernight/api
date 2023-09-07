/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthTokensService } from './auth-tokens.service'
import { AuthToken } from './entities/auth-token.entity'
import { Account } from '../accounts/entities/account.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, AuthToken]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthTokensService],
  exports: [AuthTokensService]
})
class AuthTokensModule {}

export { AuthTokensModule }
