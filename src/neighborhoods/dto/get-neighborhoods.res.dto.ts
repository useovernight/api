/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { PaginationCursorsResDto } from '@useovernight/pagination'
import { NeighborhoodResDto } from './neighborhood.res.dto'
import { ObjectType } from '../../common/enums/object-type.enum'

class GetNeighborhoodsResDto {
  @ApiProperty({
    type: [NeighborhoodResDto]
  })
  items: NeighborhoodResDto[]

  @ApiProperty({
    type: PaginationCursorsResDto
  })
  cursors: PaginationCursorsResDto

  @ApiProperty()
  object: ObjectType
}

export { GetNeighborhoodsResDto }
