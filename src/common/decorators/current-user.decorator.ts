/**
 * Copyright (c) Overnight
 */

import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'
import type { ExecutionContext } from '@nestjs/common'
import type { Account } from '../../accounts/entities/account.entity'

const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): Account => {
    void data

    const request = context.switchToHttp().getRequest<Request>()
    return request.user as Account
  }
)

export { CurrentUser }
