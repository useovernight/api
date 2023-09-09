/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { NeighborhoodCoverImageResDto } from './neighborhood-cover-image.res.dto'
import { ObjectType } from '../../common/enums/object-type.enum'

class NeighborhoodResDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  city: string

  @ApiProperty()
  image: NeighborhoodCoverImageResDto

  @ApiProperty()
  uri: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  object: ObjectType
}

export { NeighborhoodResDto }
