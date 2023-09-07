/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { AccountsController } from './accounts.controller'

@Module({
  controllers: [AccountsController]
})
class AccountsModule {}

export { AccountsModule }
