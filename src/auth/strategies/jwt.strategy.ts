/**
 * Copyright (c) Overnight
 */

import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from '../../accounts/entities/account.entity'
import { AuthToken } from '../../auth-tokens/entities/auth-token.entity'
import type { JwtPayload } from '../../auth-tokens/types/jwt.type'

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayload): Promise<Account | null> {
    const account = await this.accountRepository.findOneBy({ id: payload.sub })
    const authToken = await this.authTokenRepository.findOneBy({
      id: payload.jti
    })

    if (account === null || authToken === null)
      // eslint-disable-next-line unicorn/no-null
      return null

    authToken.lastActive = new Date().toISOString()
    await this.authTokenRepository.save(authToken)

    return account
  }
}

export { JwtStrategy }
