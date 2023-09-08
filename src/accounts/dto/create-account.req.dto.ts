/**
 * Copyright (c) Overnight
 */

import { IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class CreateAccountReqDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  username: string

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(24)
  handle: string
}

export { CreateAccountReqDto }
