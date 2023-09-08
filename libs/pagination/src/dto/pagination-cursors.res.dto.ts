/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'

class PaginationCursorsResDto {
  @ApiProperty({
    type: String,
    nullable: true
  })
  before: string | null

  @ApiProperty({
    type: String,
    nullable: true
  })
  after: string | null
}

export { PaginationCursorsResDto }
