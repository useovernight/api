/**
 * Copyright (c) Overnight
 */

import { Brackets, SelectQueryBuilder } from 'typeorm'
import { PaginationOrder } from '../enums/pagination-order.enum'
import { createCursor } from '../helpers/cursor.helper'
import { decode } from '../helpers/base64.helper'
import type { ObjectLiteral } from 'typeorm'
import type { Paginator } from './paginator'
import type {
  Key,
  PaginationOptions,
  Transformers
} from '../types/pagination-options.type'
import type { BeforePaginationQueryOptions } from '../types/pagination-query-options.type'
import type { PagingResult } from '../types/paging-result.type'

class BeforePaginator<Entity extends ObjectLiteral>
  implements Paginator<Entity>
{
  private readonly alias: string
  private readonly paginationKeys: Key<Entity>[]
  private readonly query: BeforePaginationQueryOptions
  private readonly transformers: Partial<Transformers<Entity>>

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<Entity>,
    options: PaginationOptions<Entity, BeforePaginationQueryOptions>
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
    const items = (hasMore ? entities.slice(0, -1) : entities).reverse()

    const getBeforeCursor = () => {
      if (!hasMore) {
        // eslint-disable-next-line unicorn/no-null
        return null
      }

      const first = items.at(0)

      if (first === undefined) {
        // eslint-disable-next-line unicorn/no-null
        return null
      }

      return createCursor(first, this.paginationKeys, this.transformers)
    }

    const getAfterCursor = () => {
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
        before: getBeforeCursor(),
        after: getAfterCursor()
      }
    }
  }

  private appendPagingQuery(): SelectQueryBuilder<Entity> {
    const paginatedQueryBuilder = new SelectQueryBuilder<Entity>(
      this.queryBuilder
    )

    this.appendWhereConditions(paginatedQueryBuilder)
    this.appendOrderByInstructions(paginatedQueryBuilder)
    paginatedQueryBuilder.take(this.query.limit + 1)

    return paginatedQueryBuilder
  }

  private appendWhereConditions(queryBuilder: SelectQueryBuilder<Entity>) {
    const cursor = JSON.parse(decode(this.query.after)) as Partial<Entity>
    const operator = this.query.order === PaginationOrder.Asc ? '<' : '>'
    let query = ''

    queryBuilder.andWhere(
      new Brackets((where) => {
        for (const [key, value] of Object.entries(cursor)) {
          where.orWhere(`${query}${this.alias}.${key} ${operator} :${key}`, {
            [key]: value
          })
          query = `${query}${this.alias}.${key} = :${key} AND `
        }
      })
    )
  }

  private appendOrderByInstructions(queryBuilder: SelectQueryBuilder<Entity>) {
    const order = this.query.order === PaginationOrder.Asc ? 'DESC' : 'ASC'

    for (const paginationKey of this.paginationKeys) {
      queryBuilder.addOrderBy(
        `${this.alias}.${paginationKey.toString()}`,
        order
      )
    }
  }
}

export { BeforePaginator }
