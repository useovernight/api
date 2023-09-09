/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { ObjectType } from '../../common/enums/object-type.enum'

class NeighborhoodCoverImageResDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  url: string

  @ApiProperty()
  width: number

  @ApiProperty()
  height: number

  @ApiProperty()
  uri: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  object: ObjectType
}

export { NeighborhoodCoverImageResDto }
