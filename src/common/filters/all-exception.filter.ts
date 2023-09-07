/**
 * Copyright (c) Overnight
 */

import { Catch, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { getLogErrorMessage } from '../helpers/log.helper'
import type { Request } from 'express'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { ErrorResDto } from '../dto/error.res.dto'

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const context = host.switchToHttp()
    const request = context.getRequest<Request>()

    const message = getLogErrorMessage(
      request,
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    const body: ErrorResDto = {
      status: 'failure',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: context.getRequest<Request>().url,
      method: context.getRequest<Request>().method
    }

    this.logger.error(message)
    if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message)
    }

    httpAdapter.reply(
      context.getResponse(),
      body,
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

export { AllExceptionsFilter }
