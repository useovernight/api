/**
 * Copyright (c) Overnight
 */

import { Express } from 'express'
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import { NeighborhoodsService } from './neighborhoods.service'
import { CreateNeighborhoodReqDto } from './dto/create-neighborhood.req.dto'
import { GetNeighborhoodResDto } from './dto/get-neighborhood.res.dto'
import { GetNeighborhoodsQueryDto } from './dto/get-neighborhoods.query.res.dto'
import { GetNeighborhoodsResDto } from './dto/get-neighborhoods.res.dto'
import { UpdateNeighborhoodReqDto } from './dto/update-neighborhood.req.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { NeighborhoodCoverImageMaxSize } from '../common/constants/file-size.const'
import { SupportedImageMimeTypes } from '../common/constants/mime-type.const'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'
import { ObjectType } from '../common/enums/object-type.enum'
import { FileMimeTypeValidator } from '../common/pipes/validators/file-mime-type.validator'

@Controller('/')
@ApiTags('Neighborhoods')
@ApiBearerAuth()
class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Post('/neighborhoods')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cover'))
  @ApiOperation({
    summary: 'Create a new neighborhood'
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Neighborhood information',
    type: GetNeighborhoodResDto
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
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Content',
    type: ErrorResDto
  })
  createNeighborhood(
    @CurrentUser() currentUser: Account,
    @Body() body: CreateNeighborhoodReqDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new MaxFileSizeValidator({
            maxSize: NeighborhoodCoverImageMaxSize
          }),
          new FileMimeTypeValidator({
            mimeTypes: SupportedImageMimeTypes
          })
        ]
      })
    )
    file: Express.Multer.File
  ): Promise<GetNeighborhoodResDto> {
    return this.neighborhoodsService.create(body, file, currentUser)
  }

  @Get('/neighborhoods')
  @ApiOperation({
    summary: 'List neighborhoods'
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
    description: 'List of neighborhoods',
    type: GetNeighborhoodsResDto
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ErrorResDto
  })
  async listNeighborhoods(
    @Query() query: GetNeighborhoodsQueryDto
  ): Promise<GetNeighborhoodsResDto> {
    const { items, cursors } =
      await this.neighborhoodsService.listNeighborhoods(query)

    return {
      items,
      cursors,
      object: ObjectType.List
    }
  }

  @Get('/neighborhoods/:id')
  @ApiOperation({
    summary: 'Get information about a neighborhood'
  })
  @ApiOkResponse({
    description: 'Information about a neighborhood',
    type: GetNeighborhoodResDto
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    type: ErrorResDto
  })
  getNeighborhood(@Param('id') id: string): Promise<GetNeighborhoodResDto> {
    return this.neighborhoodsService.findById(id)
  }

  @Patch('/neighborhoods/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update information about a neighborhood'
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Updated information about a neighborhood',
    type: GetNeighborhoodResDto
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
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Content',
    type: ErrorResDto
  })
  updateNeighborhood(
    @CurrentUser() currentUser: Account,
    @Param('id') id: string,
    @Body() body: UpdateNeighborhoodReqDto
  ): Promise<GetNeighborhoodResDto> {
    return this.neighborhoodsService.updateById(id, body, currentUser)
  }
}

export { NeighborhoodsController }
