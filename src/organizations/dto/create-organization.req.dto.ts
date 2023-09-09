/**
 * Copyright (c) Overnight
 */

import { IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class CreateOrganizationReqDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  name: string
}

export { CreateOrganizationReqDto }
