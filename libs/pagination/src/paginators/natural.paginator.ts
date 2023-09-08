/**
 * Copyright (c) Overnight
 */

import { SelectQueryBuilder } from 'typeorm'
import { createCursor } from '../helpers/cursor.helper'
import type { ObjectLiteral } from 'typeorm'
import type { Paginator } from './paginator'
import type {
  Key,
  PaginationOptions,
  Transformers
} from '../types/pagination-options.type'
import type { NaturalPaginationQueryOptions } from '../types/pagination-query-options.type'
import type { PagingResult } from '../types/paging-result.type'

class NaturalPaginator<Entity extends ObjectLiteral>
  implements Paginator<Entity>
{
  private readonly alias: string
  private readonly paginationKeys: Key<Entity>[]
  private readonly query: NaturalPaginationQueryOptions
  private readonly transformers: Partial<Transformers<Entity>>

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<Entity>,
    options: PaginationOptions<Entity, NaturalPaginationQueryOptions>
  ) {
    this.alias = options.alias
    this.paginationKeys = options.paginationKeys
    this.query = options.query
    this.transformers = options.transformers ?? {}
  }

  async paginate(): Promise<PagingResult<Entity>> {
    const paginatedQueryBuilder = this.appendPagingQuery()
    const entities = await paginatedQueryBuilder.getMany()
    const hasMore = entities.length > this.query.limit
    const items = hasMore ? entities.slice(0, -1) : entities

    const getAfterCursor = () => {
      if (!hasMore) {
        // eslint-disable-next-line unicorn/no-null
        return null
      }

      const last = items.at(-1)

      if (last === undefined) {
        // eslint-disable-next-line unicorn/no-null
        return null
      }

      return createCursor(last, this.paginationKeys, this.transformers)
    }

    return {
      items,
      cursors: {
        // eslint-disable-next-line unicorn/no-null
        before: null,
        after: getAfterCursor()
      }
    }
  }

  private appendPagingQuery(): SelectQueryBuilder<Entity> {
    const paginatedQueryBuilder = new SelectQueryBuilder<Entity>(
      this.queryBuilder
    )

    this.appendOrderByInstructions(paginatedQueryBuilder)
    paginatedQueryBuilder.take(this.query.limit + 1)

    return paginatedQueryBuilder
  }

  private appendOrderByInstructions(queryBuilder: SelectQueryBuilder<Entity>) {
    for (const paginationKey of this.paginationKeys) {
      queryBuilder.addOrderBy(
        `${this.alias}.${paginationKey.toString()}`,
        this.query.order
      )
    }
  }
}

export { NaturalPaginator }
