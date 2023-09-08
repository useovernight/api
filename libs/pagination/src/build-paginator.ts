/**
 * Copyright (c) Overnight
 */

import { BadRequestException } from '@nestjs/common'
import { AfterPaginator } from './paginators/after.paginator'
import { BeforePaginator } from './paginators/before.paginator'
import { NaturalPaginator } from './paginators/natural.paginator'
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import type { PaginationOptions } from './types/pagination-options.type'
import type {
  AfterPaginationQueryOptions,
  BeforePaginationQueryOptions,
  NaturalPaginationQueryOptions,
  PaginationQueryOptions,
  RangePaginationQueryOptions
} from './types/pagination-query-options.type'

const isAfterPaginationOptions = <Entity>(
  options: PaginationOptions<Entity, PaginationQueryOptions>
): options is PaginationOptions<Entity, AfterPaginationQueryOptions> =>
  options.query.before !== undefined && options.query.after === undefined

const isBeforePaginationOptions = <Entity>(
  options: PaginationOptions<Entity, PaginationQueryOptions>
): options is PaginationOptions<Entity, BeforePaginationQueryOptions> =>
  options.query.before === undefined && options.query.after !== undefined

const isRangePaginationOptions = <Entity>(
  options: PaginationOptions<Entity, PaginationQueryOptions>
): options is PaginationOptions<Entity, RangePaginationQueryOptions> =>
  options.query.before !== undefined && options.query.after !== undefined

const isNaturalPaginationOptions = <Entity>(
  options: PaginationOptions<Entity, PaginationQueryOptions>
): options is PaginationOptions<Entity, NaturalPaginationQueryOptions> =>
  options.query.before === undefined && options.query.after === undefined

const buildPaginator = <Entity extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: PaginationOptions<Entity, PaginationQueryOptions>
) => {
  if (isAfterPaginationOptions(options)) {
    return new AfterPaginator(queryBuilder, options)
  }

  if (isBeforePaginationOptions(options)) {
    return new BeforePaginator(queryBuilder, options)
  }

  if (isRangePaginationOptions(options)) {
    throw new BadRequestException(
      "The range mode operation utilizing both 'before' and 'after' cursors simultaneously is not supported. Please submit a request with either a 'before' or 'after' cursor only."
    )
  }

  if (isNaturalPaginationOptions(options)) {
    return new NaturalPaginator(queryBuilder, options)
  }

  throw new BadRequestException('No pagination mode was detected.')
}

export { buildPaginator }
