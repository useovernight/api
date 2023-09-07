/**
 * Copyright (c) Overnight
 */

import { IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class LoginWithGoogleAccessTokenReqDto {
  @ApiProperty()
  @IsString()
  accessToken: string

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  authTokenName: string
}

export { LoginWithGoogleAccessTokenReqDto }
