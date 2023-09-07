/**
 * Copyright (c) Overnight
 */

import { ApiProperty } from '@nestjs/swagger'
import { AccountResDto } from '../../accounts/dto/account.res.dto'

class LoginWithGoogleAccessTokenResDto {
  @ApiProperty({
    type: AccountResDto
  })
  account: AccountResDto

  @ApiProperty()
  accessToken: string
}

export { LoginWithGoogleAccessTokenResDto }
