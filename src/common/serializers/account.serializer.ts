/**
 * Copyright (c) Overnight
 */

import { instanceToPlain } from 'class-transformer'
import { Serializer } from './serializer'
import { SerializerGroup } from '../enums/serializer-group.enum'
import type { AccountResDto } from '../../accounts/dto/account.res.dto'
import type { Account } from '../../accounts/entities/account.entity'

class AccountSerializer extends Serializer<AccountResDto> {
  serialize(
    data: AccountResDto,
    account: Account | undefined,
    groups: string[]
  ): Record<string, unknown> {
    if (account === undefined) {
      return instanceToPlain(data, { groups })
    }

    if (account.id !== data.id) {
      return instanceToPlain(data, { groups })
    }

    return instanceToPlain(data, {
      groups: [SerializerGroup.Owner, ...groups]
    })
  }
}

export { AccountSerializer }
