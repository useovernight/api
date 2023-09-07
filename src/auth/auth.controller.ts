/**
 * Copyright (c) Overnight
 */

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginWithGoogleAccessTokenResDto } from './dto/login-with-google-access-token.res.dto'
import { LoginWithGoogleAccessTokenReqDto } from './dto/login-with-google-access-token.req.dto'
import { SignupWithGoogleAccessTokenReqDto } from './dto/signup-with-google-access-token.req.dto'
import { SignupWithGoogleAccessTokenResDto } from './dto/signup-with-google-access-token.res.dto'
import { AuthTokensService } from '../auth-tokens/auth-tokens.service'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { SerializerGroup } from '../common/enums/serializer-group.enum'

@Controller('/auth')
@ApiTags('Auth')
class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokensService: AuthTokensService
  ) {}

  @Post('/signup/google/access-token')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [SerializerGroup.Owner] })
  @ApiOperation({
    summary: 'Sign up with a Google access token'
  })
  @ApiOkResponse({
    description: 'Successfully signed up',
    type: SignupWithGoogleAccessTokenResDto
  })
  @ApiBadRequestResponse({
    description: 'Unable to sign up',
    type: ErrorResDto
  })
  async signupWithGoogleAccessToken(
    @Body() body: SignupWithGoogleAccessTokenReqDto
  ): Promise<SignupWithGoogleAccessTokenResDto> {
    const { accessToken: googleAccessToken, authTokenName } = body

    const account = await this.authService.signupWithGoogleAccessToken(
      googleAccessToken
    )
    const [, accessToken] = await this.authTokensService.create(
      authTokenName,
      account
    )

    return {
      account,
      accessToken
    }
  }

  @Post('/login/google/access-token')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [SerializerGroup.Owner] })
  @ApiOperation({
    summary: 'Login with a Google access token'
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: LoginWithGoogleAccessTokenResDto
  })
  @ApiBadRequestResponse({
    description: 'Unable to login',
    type: ErrorResDto
  })
  async loginWithGoogleAccessToken(
    @Body() body: LoginWithGoogleAccessTokenReqDto
  ): Promise<LoginWithGoogleAccessTokenResDto> {
    const { accessToken: googleAccessToken, authTokenName } = body

    const account = await this.authService.loginWithGoogleAccessToken(
      googleAccessToken
    )
    const [, accessToken] = await this.authTokensService.create(
      authTokenName,
      account
    )

    return {
      account,
      accessToken
    }
  }
}

export { AuthController }
