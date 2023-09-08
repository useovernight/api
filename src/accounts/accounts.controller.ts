/**
 * Copyright (c) Overnight
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AccountsService } from './accounts.service'
import { GetAccountResDto } from './dto/get-account.res.dto'
import { GetHandleAvailabilityResDto } from './dto/get-handle-availability.res.dto'
import { UpdateAccountReqDto } from './dto/update-account.req.dto'
import { UpdateAccountPermissionsReqDto } from './dto/update-account-permissions.req.dto'
import { Account } from './entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { AccountSerializer } from '../common/serializers/account.serializer'

@Controller('/')
@ApiTags('Accounts')
@ApiBearerAuth()
class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AccountSerializer)
  @ApiOperation({
    summary: 'Get detailed information about the current user'
  })
  @ApiOkResponse({
    description: 'Detailed information about the current user',
    type: GetAccountResDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResDto
  })
  getCurrentUserProfile(@CurrentUser() user: Account): GetAccountResDto {
    return user
  }

  @Get('/accounts/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(AccountSerializer)
  @ApiOperation({
    summary: 'Get profile information about a user'
  })
  @ApiOkResponse({
    description: 'Profile information',
    type: GetAccountResDto
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    type: ErrorResDto
  })
  getUserProfile(@Param('id') id: string): Promise<GetAccountResDto> {
    return this.accountsService.findById(id)
  }

  @Get('/handles/availability/:handle')
  @ApiOperation({
    summary: 'Get the availability of an handle'
  })
  @ApiOkResponse({
    description: 'The availability of the specified handle',
    type: GetHandleAvailabilityResDto
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ErrorResDto
  })
  async getHandleAvailability(
    @Param('handle') handle: string
  ): Promise<GetHandleAvailabilityResDto> {
    const availability =
      await this.accountsService.isHandleAvailableAndCorrectlyFormatted(handle)

    return {
      availability
    }
  }

  @Patch('/me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AccountSerializer)
  @ApiOperation({
    summary: 'Update profile information of the current user'
  })
  @ApiOkResponse({
    description: 'Updated profile information',
    type: GetAccountResDto
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
  updateCurrentUserProfile(
    @CurrentUser() currentUser: Account,
    @Body() body: UpdateAccountReqDto
  ): Promise<GetAccountResDto> {
    return this.accountsService.update(currentUser, body, currentUser)
  }

  @Patch('/accounts/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AccountSerializer)
  @ApiOperation({
    summary: 'Update profile information of a user'
  })
  @ApiOkResponse({
    description: 'Updated profile information',
    type: GetAccountResDto
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
  updateUserProfile(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string,
    @Body() body: UpdateAccountReqDto
  ): Promise<GetAccountResDto> {
    return this.accountsService.updateById(id, body, currentUser)
  }

  @Put('/accounts/:id/permissions')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AccountSerializer)
  @ApiOperation({
    summary: 'Update permissions of a user'
  })
  @ApiOkResponse({
    description: 'Updated profile information',
    type: GetAccountResDto
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
  updateUserPermissions(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string,
    @Body() body: UpdateAccountPermissionsReqDto
  ): Promise<Account> {
    const { permissions } = body
    return this.accountsService.putPermissionsById(id, permissions, currentUser)
  }

  @Delete('/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete profile of the current user'
  })
  @ApiNoContentResponse({
    description: 'Current user profile deleted'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: ErrorResDto
  })
  async deleteCurrentUserProfile(
    @CurrentUser() currentUser: Account
  ): Promise<void> {
    await this.accountsService.delete(currentUser, currentUser)
  }

  @Delete('/accounts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete profile of a user'
  })
  @ApiNoContentResponse({
    description: 'User profile deleted'
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
  async deleteUserProfile(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string
  ): Promise<void> {
    await this.accountsService.deleteById(id, currentUser)
  }
}

export { AccountsController }
