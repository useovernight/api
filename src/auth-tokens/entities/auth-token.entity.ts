/**
 * Copyright (c) Overnight
 */

import { Exclude, Expose } from 'class-transformer'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { Account } from '../../accounts/entities/account.entity'
import { ObjectType } from '../../common/enums/object-type.enum'
import { getSecureRandomString } from '../../common/helpers/random.helper'

@Entity()
class AuthToken {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Exclude()
  @ManyToOne(() => Account, {
    onDelete: 'CASCADE'
  })
  owner: Account

  @Column({
    type: 'timestamptz',
    precision: 3
  })
  lastActive: string

  @Column({
    type: 'timestamptz',
    precision: 3
  })
  expiresAt: string

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

  object = ObjectType.AuthToken

  @BeforeInsert()
  beforeInsert() {
    this.id = getSecureRandomString(24)
    this.lastActive = new Date().toISOString()
  }
}

export { AuthToken }
