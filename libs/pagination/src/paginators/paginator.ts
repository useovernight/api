/**
 * Copyright (c) Overnight
 */

import type { PagingResult } from '../types/paging-result.type'

interface Paginator<Entity> {
  paginate(): Promise<PagingResult<Entity>>
}

export type { Paginator }
