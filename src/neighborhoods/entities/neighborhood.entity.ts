/**
 * Copyright (c) Overnight
 */

import { Expose } from 'class-transformer'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { NeighborhoodCoverImage } from './neighborhood-cover-image.entity'
import { ObjectType } from '../../common/enums/object-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class Neighborhood {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  city: string

  @OneToOne(() => NeighborhoodCoverImage, {
    eager: true
  })
  @JoinColumn()
  image: NeighborhoodCoverImage

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

  object = ObjectType.Neighborhood

  @BeforeInsert()
  beforeInsert() {
    this.id = getSecureRandomString(24)
  }
}

export { Neighborhood }
