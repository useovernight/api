/**
 * Copyright (c) Overnight
 */

enum Permission {
  UpdateAccounts = 'Permission.UpdateAccounts',
  UpdateOwnAccount = 'Permission.UpdateOwnAccount',
  UpdateAccountPermissions = 'Permission.UpdateAccountPermissions',
  DeleteAccounts = 'Permission.DeleteAccounts',
  DeleteOwnAccount = 'Permission.DeleteOwnAccount',
  ReadAuthTokens = 'Permission.ReadAuthTokens',
  ReadOwnAuthTokens = 'Permission.ReadOwnAuthTokens',
  DeleteAuthTokens = 'Permission.DeleteAuthTokens',
  DeleteOwnAuthTokens = 'Permission.DeleteOwnAuthTokens',
  CreateNeighborhoods = 'Permission.CreateNeighborhoods',
  UpdateNeighborhoods = 'Permission.UpdateNeighborhoods',
  DeleteNeighborhoods = 'Permission.DeleteNeighborhoods',
  CreateOrganizations = 'Permission.CreateOrganizations',
  UpdateOrganizations = 'Permission.UpdateOrganizations',
  DeleteOrganizations = 'Permission.DeleteOrganizations'
}

export { Permission }
