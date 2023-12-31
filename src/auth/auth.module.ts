/**
 * Copyright (c) Overnight
 */

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleCredentials } from './entities/google-credentials.entity'
import { GoogleApiService } from './services/google-api.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { Account } from '../accounts/entities/account.entity'
import { AuthTokensModule } from '../auth-tokens/auth-tokens.module'
import { AuthToken } from '../auth-tokens/entities/auth-token.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, AuthToken, GoogleCredentials]),
    AuthTokensModule,
    HttpModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleApiService, JwtStrategy]
})
class AuthModule {}

export { AuthModule }
