/**
 * Copyright (c) Overnight
 */

import { Repository } from 'typeorm'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageTransferService } from '@useovernight/document-transfer'
import { Neighborhood } from './entities/neighborhood.entity'
import { NeighborhoodCoverImage } from './entities/neighborhood-cover-image.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { PreferredNeighborhoodCoverImageDimensions } from '../common/constants/image-dimension.const'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { Express } from 'express'
import type { CreateNeighborhoodReqDto } from './dto/create-neighborhood.req.dto'
import type { Account } from '../accounts/entities/account.entity'

@Injectable()
class NeighborhoodsService {
  constructor(
    @InjectRepository(Neighborhood)
    private readonly neighborhoodsRepository: Repository<Neighborhood>,
    @InjectRepository(NeighborhoodCoverImage)
    private readonly neighborhoodCoverImagesRepository: Repository<NeighborhoodCoverImage>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly imageTransferService: ImageTransferService
  ) {}

  async create(
    body: CreateNeighborhoodReqDto,
    file: Express.Multer.File,
    initiator: Account
  ): Promise<Neighborhood> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)
    const neighborhood = this.neighborhoodsRepository.create(body)

    if (ability.cannot(CaslAction.Create, neighborhood)) {
      throw new ForbiddenException()
    }

    neighborhood.image = await this.createCoverImage(file)
    return this.neighborhoodsRepository.save(neighborhood)
  }

  private async createCoverImage(
    file: Express.Multer.File
  ): Promise<NeighborhoodCoverImage> {
    const [width, height] = PreferredNeighborhoodCoverImageDimensions
    const { url, key } = await this.imageTransferService.upload(file, [
      width,
      height
    ])

    return this.neighborhoodCoverImagesRepository.save(
      this.neighborhoodCoverImagesRepository.create({
        url,
        width,
        height,
        key
      })
    )
  }
}

export { NeighborhoodsService }
