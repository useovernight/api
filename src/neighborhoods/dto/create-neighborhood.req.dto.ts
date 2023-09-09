/**
 * Copyright (c) Overnight
 */

import { IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class CreateNeighborhoodReqDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  name: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  city: string
}

export { CreateNeighborhoodReqDto }
