/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'

class GetHandleAvailabilityResDto {
  @ApiProperty()
  availability: boolean
}

export { GetHandleAvailabilityResDto }
