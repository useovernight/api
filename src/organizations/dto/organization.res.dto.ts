/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { ObjectType } from '../../common/enums/object-type.enum'

class OrganizationResDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  uri: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  object: ObjectType
}

export { OrganizationResDto }
