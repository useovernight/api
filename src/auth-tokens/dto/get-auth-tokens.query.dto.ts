/**
 * Copyright (c) Overnight
 */

import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationOrder } from '@useovernight/pagination'

class GetAuthTokensQueryDto {
  @ApiProperty({
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(0)
  @Max(100)
  limit = 20

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsEnum(PaginationOrder)
  order = PaginationOrder.Desc

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString()
  after: string

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString()
  before: string
}

export { GetAuthTokensQueryDto }
