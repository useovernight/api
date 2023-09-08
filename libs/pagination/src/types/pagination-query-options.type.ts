/**
 * Copyright (c) Overnight
 */

import type { PaginationOrder } from '../enums/pagination-order.enum'

interface UnspecifiedPaginationQueryOptions {
  limit: number
  order: PaginationOrder
  after: string | undefined
  before: string | undefined
}

interface NaturalPaginationQueryOptions {
  limit: number
  order: PaginationOrder
  after: undefined
  before: undefined
}

interface BeforePaginationQueryOptions {
  limit: number
  order: PaginationOrder
  after: string
  before: undefined
}

interface AfterPaginationQueryOptions {
  limit: number
  order: PaginationOrder
  after: undefined
  before: string
}

interface RangePaginationQueryOptions {
  limit: number
  order: PaginationOrder
  after: string
  before: string
}

type PaginationQueryOptions =
  | UnspecifiedPaginationQueryOptions
  | NaturalPaginationQueryOptions
  | BeforePaginationQueryOptions
  | AfterPaginationQueryOptions
  | RangePaginationQueryOptions

export type {
  PaginationQueryOptions,
  UnspecifiedPaginationQueryOptions,
  NaturalPaginationQueryOptions,
  BeforePaginationQueryOptions,
  AfterPaginationQueryOptions,
  RangePaginationQueryOptions
}
