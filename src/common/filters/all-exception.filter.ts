/**
 * Copyright (c) Overnight
 */

import { Catch, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import type { Request } from 'express'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { ErrorResDto } from '../dto/error.res.dto'

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const context = host.switchToHttp()

    const body: ErrorResDto = {
      status: 'failure',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: context.getRequest<Request>().url,
      method: context.getRequest<Request>().method
    }

    httpAdapter.reply(
      context.getResponse(),
      body,
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

export { AllExceptionsFilter }
