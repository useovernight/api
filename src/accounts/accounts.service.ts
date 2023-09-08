/**
 * Copyright (c) Overnight
 */

import { Repository } from 'typeorm'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from './entities/account.entity'
import { validateHandle, validateUsername } from './helpers/name.helper'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import type { UpdateAccountReqDto } from './dto/update-account.req.dto'

@Injectable()
class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  async findById(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({ id })

    if (account === null) {
      throw new NotFoundException()
    }

    return account
  }

  async update(
    subject: Account,
    body: UpdateAccountReqDto,
    initiator: Account
  ): Promise<Account> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)

    if (ability.cannot(CaslAction.Update, subject)) {
      throw new ForbiddenException()
    }

    let nameErrors: string[] = []

    if (body.username !== undefined) {
      nameErrors = [...nameErrors, ...validateUsername(body.username)]
    }

    if (body.handle !== undefined) {
      nameErrors = [...nameErrors, ...validateHandle(body.handle)]
    }

    if (nameErrors.length > 0) {
      throw new BadRequestException(nameErrors)
    }

    if (body.handle !== undefined && subject.handle !== body.handle) {
      const isHandleAvailable = await this.isHandleAvailable(body.handle)

      if (!isHandleAvailable) {
        throw new BadRequestException(
          'This handle is already in use by another account.'
        )
      }
    }

    await this.accountsRepository.save({
      ...subject,
      ...body
    })

    return this.findById(subject.id)
  }

  async updateById(
    id: string,
    body: UpdateAccountReqDto,
    initiator: Account
  ): Promise<Account> {
    const subject = await this.findById(id)
    return this.update(subject, body, initiator)
  }

  async putPermissions(
    subject: Account,
    permissions: Permission[],
    initiator: Account
  ): Promise<Account> {
    if (!initiator.permissions.includes(Permission.UpdateAccountPermissions)) {
      throw new ForbiddenException()
    }

    await this.accountsRepository.save({
      ...subject,
      permissions
    })

    return this.findById(subject.id)
  }

  async putPermissionsById(
    id: string,
    permissions: Permission[],
    initiator: Account
  ): Promise<Account> {
    const subject = await this.findById(id)
    return this.putPermissions(subject, permissions, initiator)
  }

  async delete(subject: Account, initiator: Account): Promise<void> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)

    if (ability.cannot(CaslAction.Delete, subject)) {
      throw new ForbiddenException()
    }

    await this.accountsRepository.remove(subject)
  }

  async deleteById(id: string, initiator: Account): Promise<void> {
    const subject = await this.findById(id)
    return this.delete(subject, initiator)
  }

  async isHandleAvailableAndCorrectlyFormatted(
    handle: string
  ): Promise<boolean> {
    const errors = validateHandle(handle)

    if (errors.length > 0) {
      throw new BadRequestException(errors)
    }

    return this.isHandleAvailable(handle)
  }

  private async isHandleAvailable(handle: string): Promise<boolean> {
    return (await this.accountsRepository.findOneBy({ handle })) === null
  }
}

export { AccountsService }
