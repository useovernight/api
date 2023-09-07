/**
 * Copyright (c) Overnight
 */

import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Account } from '../../accounts/entities/account.entity'

@Injectable()
class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T = Account>(
    error: Error | null,
    user: T | false
  ): T | undefined {
    if (error) {
      throw error
    }

    if (user === false) {
      return undefined
    }

    return user
  }
}

export { OptionalJwtAuthGuard }
