/**
 * Copyright (c) Overnight
 */

import { Exclude, Expose } from 'class-transformer'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { OrganizationImage } from './organization-image.entity'
import { ObjectType } from '../../common/enums/object-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class Organization {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => OrganizationImage, (image) => image.organization)
  @Exclude()
  images: OrganizationImage[]

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

  object = ObjectType.Organization

  @BeforeInsert()
  beforeInsert() {
    this.id = getSecureRandomString(24)
  }
}

export { Organization }
