/**
 * Copyright (c) Overnight
 */

import { PartialType } from '@nestjs/swagger'
import { CreateNeighborhoodReqDto } from './create-neighborhood.req.dto'

class UpdateNeighborhoodReqDto extends PartialType(CreateNeighborhoodReqDto) {}

export { UpdateNeighborhoodReqDto }
