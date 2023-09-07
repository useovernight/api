/**
 * Copyright (c) Overnight
 */

import { Injectable, Logger } from '@nestjs/common'
import { getLogRequestMessage } from '../helpers/log.helper'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'

@Injectable()
class LoggingInterceptor<T> implements NestInterceptor<T, T> {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>()
    const message = getLogRequestMessage(request)

    this.logger.log(message)
    return next.handle()
  }
}

export { LoggingInterceptor }
