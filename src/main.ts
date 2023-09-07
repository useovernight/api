/**
 * Copyright (c) Overnight
 */

import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.enableCors()

  const logger = new Logger('Bootstrap')

  const appPort = configService.get<number>('APP_PORT') ?? 9000
  const environment = configService.get<string>('NODE_ENV')

  if (environment === undefined) {
    logger.error('The environment variable `NODE_ENV` is not defined')
    return app.close()
  }

  await app.listen(appPort)
  logger.log(`[ENV=${environment}] Application running on port ${appPort}`)
}

void bootstrap()
