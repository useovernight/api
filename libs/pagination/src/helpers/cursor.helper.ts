/**
 * Copyright (c) Overnight
 */

import { encode } from './base64.helper'
import type { Transformers, Key } from '../types/pagination-options.type'

const defaultTransformer = <T>(value: T) => value

const createCursor = <Entity>(
  entity: Entity,
  paginationKeys: Key<Entity>[],
  transformers: Partial<Transformers<Entity>>
): string => {
  const cursor: Partial<Entity> = {}

  for (const paginationKey of paginationKeys) {
    const value = entity[paginationKey]
    const transformer = transformers[paginationKey] ?? defaultTransformer

    cursor[paginationKey] = transformer(value)
  }

  return encode(JSON.stringify(cursor))
}

export { createCursor }
