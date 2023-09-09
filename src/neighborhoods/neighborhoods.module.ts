/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentTransferModule } from '@useovernight/document-transfer'
import { NeighborhoodsController } from './neighborhoods.controller'
import { NeighborhoodsService } from './neighborhoods.service'
import { Neighborhood } from './entities/neighborhood.entity'
import { NeighborhoodCoverImage } from './entities/neighborhood-cover-image.entity'
import { CaslModule } from '../casl/casl.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Neighborhood, NeighborhoodCoverImage]),
    CaslModule,
    DocumentTransferModule
  ],
  controllers: [NeighborhoodsController],
  providers: [NeighborhoodsService]
})
class NeighborhoodsModule {}

export { NeighborhoodsModule }
