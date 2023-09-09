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
  Post,
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
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import { NeighborhoodsService } from './neighborhoods.service'
import { CreateNeighborhoodReqDto } from './dto/create-neighborhood.req.dto'
import { GetNeighborhoodResDto } from './dto/get-neighborhood.res.dto'
import { Account } from '../accounts/entities/account.entity'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { NeighborhoodCoverImageMaxSize } from '../common/constants/file-size.const'
import { SupportedImageMimeTypes } from '../common/constants/mime-type.const'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ErrorResDto } from '../common/dto/error.res.dto'
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
}

export { NeighborhoodsController }
