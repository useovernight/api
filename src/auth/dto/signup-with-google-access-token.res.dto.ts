/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { AccountResDto } from '../../accounts/dto/account.res.dto'

class SignupWithGoogleAccessTokenResDto {
  @ApiProperty({
    type: AccountResDto
  })
  account: AccountResDto

  @ApiProperty()
  accessToken: string
}

export { SignupWithGoogleAccessTokenResDto }
