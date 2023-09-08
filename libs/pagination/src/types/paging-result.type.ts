/**
 * Copyright (c) Overnight
 */

interface PagingResult<Entity> {
  items: Entity[]
  cursors: {
    before: string | null
    after: string | null
  }
}

export type { PagingResult }
