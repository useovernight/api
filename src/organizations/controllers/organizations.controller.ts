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
  Post,
  UseGuards
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { CreateOrganizationReqDto } from '../dto/create-organization.req.dto'
import { GetOrganizationResDto } from '../dto/get-organization.res.dto'
import { UpdateOrganizationReqDto } from '../dto/update-organization.req.dto'
import { OrganizationsService } from '../services/organizations.service'
import { Account } from '../../accounts/entities/account.entity'
import { JwtAuthGuard } from '../../auth/guards/jwt.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ErrorResDto } from '../../common/dto/error.res.dto'

@Controller('/')
@ApiTags('Organizations')
@ApiBearerAuth()
class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post('/organizations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new organization'
  })
  @ApiCreatedResponse({
    description: 'Organization information',
    type: GetOrganizationResDto
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
  createOrganization(
    @CurrentUser() currentUser: Account,
    @Body() body: CreateOrganizationReqDto
  ): Promise<GetOrganizationResDto> {
    return this.organizationsService.create(body, currentUser)
  }

  @Get('/organizations/:id')
  @ApiOperation({
    summary: 'Get information about an organization'
  })
  @ApiOkResponse({
    description: 'Information about an organization',
    type: GetOrganizationResDto
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    type: ErrorResDto
  })
  getOrganization(@Param('id') id: string): Promise<GetOrganizationResDto> {
    return this.organizationsService.findById(id)
  }

  @Patch('/organizations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update information about an organization'
  })
  @ApiOkResponse({
    description: 'Updated information about an organization',
    type: GetOrganizationResDto
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
  updateOrganization(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string,
    @Body() body: UpdateOrganizationReqDto
  ): Promise<GetOrganizationResDto> {
    return this.organizationsService.updateById(id, body, currentUser)
  }

  @Delete('/organizations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete an organization'
  })
  @ApiNoContentResponse({
    description: 'Successfully deleted organization'
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
  async deleteOrganization(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string
  ): Promise<void> {
    await this.organizationsService.deleteById(id, currentUser)
  }
}

export { OrganizationsController }
