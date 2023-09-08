/**
 * Copyright (c) Overnight
 */

import type { PaginationQueryOptions } from './pagination-query-options.type'

type Key<Entity> = keyof Entity

type Transformers<Entity> = {
  [K in keyof Entity]: (value: Entity[K]) => Entity[K]
}

interface PaginationParameters<Entity> {
  paginationKeys: Key<Entity>[]
  alias: string
}

type PaginationOptions<
  Entity,
  QueryOptions extends PaginationQueryOptions
> = PaginationParameters<Entity> & {
  query: QueryOptions
  transformers?: Partial<Transformers<Entity>>
}

export type { Key, PaginationParameters, PaginationOptions, Transformers }
