/**
 * Copyright (c) Overnight
 */

import { map } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  ClassSerializerContextOptions
} from '@nestjs/common'
import type { Account } from '../../accounts/entities/account.entity'

@Injectable()
abstract class Serializer<T, R = Record<string, unknown>>
  implements NestInterceptor<T, R>
{
  protected constructor(private reflector: Reflector) {}

  abstract serialize(data: T, account: Account | undefined, groups: string[]): R

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    const request = context.switchToHttp().getRequest<Request>()
    const currentUser = request.user as Account | undefined
    const serializerOptions = this.reflector.get<
      ClassSerializerContextOptions | undefined
    >(CLASS_SERIALIZER_OPTIONS, context.getHandler())

    const userSerializerGroups = currentUser?.serializerGroups ?? []
    const metadataSerializerGroups = serializerOptions?.groups ?? []
    const groups = [...userSerializerGroups, ...metadataSerializerGroups]

    return next
      .handle()
      .pipe(map((response) => this.serialize(response, currentUser, groups)))
  }
}

export { Serializer }
