/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'

class ErrorResDto {
  @ApiProperty()
  status: 'failure'

  @ApiProperty()
  statusCode: number

  @ApiProperty()
  error: string

  @ApiProperty({
    type: String
  })
  message: string | string[]

  @ApiProperty()
  timestamp: string

  @ApiProperty()
  path: string

  @ApiProperty()
  method: string
}

export { ErrorResDto }
