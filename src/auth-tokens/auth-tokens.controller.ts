/**
 * Copyright (c) Overnight
 */

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AuthTokensService } from './auth-tokens.service'
import { GetAuthTokensQueryDto } from './dto/get-auth-tokens.query.dto'
import { GetAuthTokensResDto } from './dto/get-auth-tokens.res.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { ObjectType } from '../common/enums/object-type.enum'

@Controller('/')
@ApiTags('Auth Tokens')
@ApiBearerAuth()
class AuthTokensController {
  constructor(private readonly authTokensService: AuthTokensService) {}

  @Get('/me/auth-tokens')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get auth tokens owned by the current user'
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'order',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'after',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'before',
    type: String,
    required: false
  })
  @ApiOkResponse({
    description: 'Auth tokens owned by the current user',
    type: GetAuthTokensResDto
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ErrorResDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: ErrorResDto
  })
  async listCurrentUserAuthTokens(
    @CurrentUser() currentUser: Account,
    @Query() query: GetAuthTokensQueryDto
  ): Promise<GetAuthTokensResDto> {
    const { items, cursors } = await this.authTokensService.list(
      currentUser,
      query,
      currentUser
    )

    return {
      items,
      cursors,
      object: ObjectType.List
    }
  }

  @Get('/accounts/:accountId/auth-tokens')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get auth tokens owned by a user'
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'order',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'after',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'before',
    type: String,
    required: false
  })
  @ApiOkResponse({
    description: 'Auth tokens owned by a user',
    type: GetAuthTokensResDto
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ErrorResDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: ErrorResDto
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    type: ErrorResDto
  })
  async listUserAuthTokens(
    @CurrentUser() currentUser: Account,
    @Query() query: GetAuthTokensQueryDto,
    @Param('accountId') accountId: string
  ): Promise<GetAuthTokensResDto> {
    const { items, cursors } = await this.authTokensService.listFromOwnerId(
      accountId,
      query,
      currentUser
    )

    return {
      items,
      cursors,
      object: ObjectType.List
    }
  }

  @Delete('/auth-tokens/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete auth token by id'
  })
  @ApiNoContentResponse({
    description: 'Delete an auth token by id'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: ErrorResDto
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    type: ErrorResDto
  })
  async deleteById(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string
  ): Promise<void> {
    await this.authTokensService.deleteById(id, currentUser)
  }
}

export { AuthTokensController }
