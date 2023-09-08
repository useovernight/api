/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { Account } from './entities/account.entity'
import { CaslModule } from '../casl/casl.module'

@Module({
  imports: [TypeOrmModule.forFeature([Account]), CaslModule],
  controllers: [AccountsController],
  providers: [AccountsService]
})
class AccountsModule {}

export { AccountsModule }
