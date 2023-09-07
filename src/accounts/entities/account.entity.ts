/**
 * Copyright (c) Overnight
 */

import { Expose } from 'class-transformer'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { ObjectType } from '../../common/enums/object-type.enum'
import { SerializerGroup } from '../../common/enums/serializer-group.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'
import type { Permission } from '../../common/enums/permission.enum'

@Entity()
class Account {
  @PrimaryColumn()
  id: string

  @Column()
  username: string

  @Column({
    unique: true
  })
  handle: string

  @Column()
  avatar: string

  @Column()
  @Expose({
    groups: [SerializerGroup.Owner, SerializerGroup.PersonalAccountInformation]
  })
  email: string

  @Column({
    type: 'simple-array'
  })
  @Expose({
    groups: [SerializerGroup.Owner, SerializerGroup.PersonalAccountInformation]
  })
  permissions: Permission[]

  @Column({
    type: 'simple-array'
  })
  @Expose({
    groups: [SerializerGroup.PersonalAccountInformation]
  })
  serializerGroups: SerializerGroup[]

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

  object = ObjectType.Account

  @BeforeInsert()
  beforeInsert() {
    this.id = getSecureRandomString(24)
  }
}

export { Account }
