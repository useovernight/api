/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { ObjectType } from '../../common/enums/object-type.enum'
import type { Permission } from '../../common/enums/permission.enum'
import type { SerializerGroup } from '../../common/enums/serializer-group.enum'

class AccountResDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  username: string

  @ApiProperty()
  handle: string

  @ApiProperty()
  avatar: string

  @ApiProperty()
  email: string

  @ApiProperty()
  permissions: Permission[]

  @ApiProperty()
  serializerGroups: SerializerGroup[]

  @ApiProperty()
  uri: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  object: ObjectType
}

export { AccountResDto }
