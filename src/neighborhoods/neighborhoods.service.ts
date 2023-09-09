/**
 * Copyright (c) Overnight
 */

import { Repository } from 'typeorm'
import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageTransferService } from '@useovernight/document-transfer'
import { buildPaginator } from '@useovernight/pagination'
import { Neighborhood } from './entities/neighborhood.entity'
import { NeighborhoodCoverImage } from './entities/neighborhood-cover-image.entity'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { PreferredNeighborhoodCoverImageDimensions } from '../common/constants/image-dimension.const'
import { CaslAction } from '../common/enums/casl-action.enum'
import type { Express } from 'express'
import type { PagingResult } from '@useovernight/pagination'
import type { CreateNeighborhoodReqDto } from './dto/create-neighborhood.req.dto'
import type { GetNeighborhoodsQueryDto } from './dto/get-neighborhoods.query.res.dto'
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

  async findById(id: string): Promise<Neighborhood> {
    const neighborhood = await this.neighborhoodsRepository.findOneBy({ id })

    if (neighborhood === null) {
      throw new NotFoundException()
    }

    return neighborhood
  }

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

  async listNeighborhoods(
    query: GetNeighborhoodsQueryDto
  ): Promise<PagingResult<Neighborhood>> {
    const queryBuilder = this.neighborhoodsRepository
      .createQueryBuilder('neighborhood')
      .leftJoinAndSelect('neighborhood.image', 'neighborhood-cover-image')

    const paginator = buildPaginator(queryBuilder, {
      paginationKeys: ['city', 'name', 'id'],
      alias: 'neighborhood',
      query
    })

    return paginator.paginate()
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
