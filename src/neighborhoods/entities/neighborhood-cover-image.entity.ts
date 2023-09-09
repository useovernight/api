/**
 * Copyright (c) Overnight
 */

import { Exclude, Expose } from 'class-transformer'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { ObjectType } from '../../common/enums/object-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class NeighborhoodCoverImage {
  @PrimaryColumn()
  id: string

  @Column()
  url: string

  @Column()
  width: number

  @Column()
  height: number

  @Column()
  @Exclude()
  key: string

  @Expose()
  get uri(): string {
    return `overnight:${this.object}:${this.id}`
  }

  @UpdateDateColumn({
    type: 'timestamptz',
    precision: 3
  })
  updatedAt: string

  @CreateDateColumn({
    type: 'timestamptz',
    precision: 3
  })
  createdAt: string

  object = ObjectType.Image

  @BeforeInsert()
  beforeInsert() {
    this.id = getSecureRandomString(24)
  }
}

export { NeighborhoodCoverImage }
