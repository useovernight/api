/**
 * Copyright (c) Overnight
 */

import { Permission } from '../enums/permission.enum'

const DefaultPermissions = [
  Permission.UpdateOwnAccount,
  Permission.DeleteOwnAccount,
  Permission.ReadOwnAuthTokens,
  Permission.DeleteOwnAuthTokens
]

export { DefaultPermissions }
