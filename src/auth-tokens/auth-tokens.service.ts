/**
 * Copyright (c) Overnight
 */

import ms from 'ms'
import { LessThanOrEqual, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthToken } from './entities/auth-token.entity'
import { Account } from '../accounts/entities/account.entity'
import type { JwtApplicationPayload } from './types/jwt.type'

@Injectable()
class AuthTokensService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(AuthToken)
    private readonly authTokensRepository: Repository<AuthToken>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleRemoveExpiredAuthTokens(): Promise<void> {
    await this.authTokensRepository.delete({
      expiresAt: LessThanOrEqual(new Date().toISOString())
    })
  }

  async create(name: string, account: Account): Promise<[AuthToken, string]> {
    const expiresAt = this.getExpirationDate()

    const authToken = await this.authTokensRepository.save(
      this.authTokensRepository.create({
        name,
        owner: account,
        expiresAt: expiresAt.toISOString()
      })
    )
    const jwt = this.createJwt(authToken, expiresAt)

    return [authToken, jwt]
  }

  private createJwt(authToken: AuthToken, expiresAt: Date): string {
    const payload: JwtApplicationPayload = {
      jti: authToken.id,
      sub: authToken.owner.id
    }

    return this.jwtService.sign(payload, {
      expiresIn: ms(expiresAt.getTime() - Date.now())
    })
  }

  private getExpirationDate(): Date {
    const expiresIn = ms(
      this.configService.get<string>('JWT_OPTION_EXPIRES_IN') ?? '1h'
    )
    return new Date(Date.now() + expiresIn)
  }
}

export { AuthTokensService }
