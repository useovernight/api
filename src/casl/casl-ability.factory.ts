/**
 * Copyright (c) Overnight
 */

import { createQueryTester } from 'sift'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { Account } from '../accounts/entities/account.entity'
import { AuthToken } from '../auth-tokens/entities/auth-token.entity'
import { CaslAction } from '../common/enums/casl-action.enum'
import { Permission } from '../common/enums/permission.enum'
import type {
  AbilityClass,
  ExtractSubjectType,
  InferSubjects
} from '@casl/ability'

type Subjects = InferSubjects<typeof Account | typeof AuthToken>
type AppAbility = PureAbility<[CaslAction, Subjects]>

@Injectable()
class CaslAbilityFactory {
  createForAccount(account: Account): AppAbility {
    const { can, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>
    )
    const permissions = account.permissions

    /* Account */
    if (permissions.includes(Permission.UpdateAccounts))
      can(CaslAction.Update, Account)

    if (permissions.includes(Permission.UpdateOwnAccount))
      can(CaslAction.Update, Account, { id: account.id })

    if (permissions.includes(Permission.DeleteAccounts))
      can(CaslAction.Delete, Account)

    if (permissions.includes(Permission.DeleteOwnAccount))
      can(CaslAction.Delete, Account, { id: account.id })

    /* Auth Token */
    if (permissions.includes(Permission.ReadAuthTokens))
      can(CaslAction.Read, AuthToken)

    if (permissions.includes(Permission.ReadOwnAuthTokens)) {
      can(CaslAction.Read, AuthToken, {
        'owner.id': account.id
      })
    }

    if (permissions.includes(Permission.DeleteAuthTokens)) {
      can(CaslAction.Delete, AuthToken)
    }

    if (permissions.includes(Permission.DeleteOwnAuthTokens)) {
      can(CaslAction.Delete, AuthToken, {
        'owner.id': account.id
      })
    }

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: (conditions) => createQueryTester(conditions)
    })
  }
}

export { CaslAbilityFactory }
