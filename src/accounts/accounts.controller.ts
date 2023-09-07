/**
 * Copyright (c) Overnight
 */

import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AccountsService } from './accounts.service'
import { GetAccountResDto } from './dto/get-account.res.dto'
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
}

export { AccountsController }
