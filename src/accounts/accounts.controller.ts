/**
 * Copyright (c) Overnight
 */

import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { GetAccountResDto } from './dto/get-account.res.dto'
import { Account } from './entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'

@Controller('/')
@ApiTags('Accounts')
@ApiBearerAuth()
class AccountsController {
  @Get('/me')
  @UseGuards(JwtAuthGuard)
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
}

export { AccountsController }
