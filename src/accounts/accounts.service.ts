/**
 * Copyright (c) Overnight
 */

import { Repository } from 'typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from './entities/account.entity'

@Injectable()
class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>
  ) {}

  async findById(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({ id })

    if (account === null) {
      throw new NotFoundException()
    }

    return account
  }
}

export { AccountsService }
