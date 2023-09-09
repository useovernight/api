/**
 * Copyright (c) Overnight
 */

import ms from 'ms'
import { LessThanOrEqual, Repository } from 'typeorm'
import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import {
  buildPaginator,
  transformDateToPostgresTimestamp
} from '@useovernight/pagination'
import { AuthToken } from './entities/auth-token.entity'
import { Account } from '../accounts/entities/account.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { PagingResult } from '@useovernight/pagination'
import type { GetAuthTokensQueryDto } from './dto/get-auth-tokens.query.dto'
import type { JwtApplicationPayload } from './types/jwt.type'

@Injectable()
class AuthTokensService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(AuthToken)
    private readonly authTokensRepository: Repository<AuthToken>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
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

  async list(
    owner: Account,
    query: GetAuthTokensQueryDto,
    initiator: Account
  ): Promise<PagingResult<AuthToken>> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)
    const queryBuilder = this.authTokensRepository
      .createQueryBuilder('auth_token')
      .where('auth_token.owner.id = :ownerId', { ownerId: owner.id })
      .leftJoinAndSelect('auth_token.owner', 'account')

    const paginator = buildPaginator(queryBuilder, {
      alias: 'auth_token',
      paginationKeys: ['lastActive', 'id'],
      query: {
        after: query.after,
        before: query.before,
        limit: query.limit,
        order: query.order
      },
      transformers: {
        lastActive: (value) => transformDateToPostgresTimestamp(new Date(value))
      }
    })

    const { items, cursors } = await paginator.paginate()
    const authTokens = items.filter((authToken) =>
      ability.can(CaslAction.Read, authToken)
    )

    if (items.length > 0 && authTokens.length === 0) {
      throw new ForbiddenException()
    }

    return {
      items: authTokens,
      cursors
    }
  }

  async listFromOwnerId(
    ownerId: string,
    query: GetAuthTokensQueryDto,
    initiator: Account
  ): Promise<PagingResult<AuthToken>> {
    const owner = await this.accountsRepository.findOneBy({ id: ownerId })

    if (owner === null) {
      throw new NotFoundException()
    }

    return this.list(owner, query, initiator)
  }

  async delete(subject: AuthToken, initiator: Account): Promise<void> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)

    if (ability.cannot(CaslAction.Delete, subject)) {
      throw new ForbiddenException()
    }

    await this.authTokensRepository.remove(subject)
  }

  async deleteById(authTokenId: string, initiator: Account): Promise<void> {
    const authToken = await this.authTokensRepository.findOne({
      where: {
        id: authTokenId
      },
      relations: ['owner']
    })

    if (authToken === null) {
      throw new NotFoundException()
    }

    await this.delete(authToken, initiator)
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
