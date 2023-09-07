/**
 * Copyright (c) Overnight
 */

import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.enableCors()

  const logger = new Logger('Bootstrap')
  const documentConfig = new DocumentBuilder()
    .setTitle('Overnight API')
    .setDescription('The API that runs the Overnight platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const appPort = configService.get<number>('APP_PORT') ?? 9000
  const environment = configService.get<string>('NODE_ENV')

  if (environment === undefined) {
    logger.error('The environment variable `NODE_ENV` is not defined')
    return app.close()
  }

  if (configService.get<string>('SWAGGER_DOC_VISIBILITY') === 'true') {
    const swaggerDocument = SwaggerModule.createDocument(app, documentConfig)
    SwaggerModule.setup('/swagger', app, swaggerDocument)
  }

  await app.listen(appPort)
  logger.log(`[ENV=${environment}] Application running on port ${appPort}`)
}

void bootstrap()
