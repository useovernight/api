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
import { Neighborhood } from '../neighborhoods/entities/neighborhood.entity'
import { Organization } from '../organizations/entities/organization.entity'
import type {
  AbilityClass,
  ExtractSubjectType,
  InferSubjects
} from '@casl/ability'

type Subjects = InferSubjects<
  typeof Account | typeof AuthToken | typeof Neighborhood | typeof Organization
>
type AppAbility = PureAbility<[CaslAction, Subjects]>

@Injectable()
class CaslAbilityFactory {
  createForAccount(account: Account): AppAbility {
    const { can, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>
    )
    const permissions = account.permissions

    /* Account */
    if (permissions.includes(Permission.UpdateAccounts)) {
      can(CaslAction.Update, Account)
    }

    if (permissions.includes(Permission.UpdateOwnAccount)) {
      can(CaslAction.Update, Account, { id: account.id })
    }

    if (permissions.includes(Permission.DeleteAccounts)) {
      can(CaslAction.Delete, Account)
    }

    if (permissions.includes(Permission.DeleteOwnAccount)) {
      can(CaslAction.Delete, Account, { id: account.id })
    }

    /* Auth Token */
    if (permissions.includes(Permission.ReadAuthTokens)) {
      can(CaslAction.Read, AuthToken)
    }

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

    /* Neighborhood */
    if (permissions.includes(Permission.CreateNeighborhoods)) {
      can(CaslAction.Create, Neighborhood)
    }

    if (permissions.includes(Permission.UpdateNeighborhoods)) {
      can(CaslAction.Update, Neighborhood)
    }

    if (permissions.includes(Permission.DeleteNeighborhoods)) {
      can(CaslAction.Delete, Neighborhood)
    }

    /* Organization */
    if (permissions.includes(Permission.CreateOrganizations)) {
      can(CaslAction.Create, Organization)
    }

    if (permissions.includes(Permission.UpdateOrganizations)) {
      can(CaslAction.Update, Organization)
    }

    if (permissions.includes(Permission.DeleteOrganizations)) {
      can(CaslAction.Delete, Organization)
    }

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: (conditions) => createQueryTester(conditions)
    })
  }
}

export { CaslAbilityFactory }
