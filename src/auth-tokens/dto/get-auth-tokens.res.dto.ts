/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { PaginationCursorsResDto } from '@useovernight/pagination'
import { AuthTokenResDto } from './auth-token.res.dto'
import { ObjectType } from '../../common/enums/object-type.enum'

class GetAuthTokensResDto {
  @ApiProperty({
    type: [AuthTokenResDto]
  })
  items: AuthTokenResDto[]

  @ApiProperty({
    type: PaginationCursorsResDto
  })
  cursors: PaginationCursorsResDto

  @ApiProperty()
  object: ObjectType
}

export { GetAuthTokensResDto }
