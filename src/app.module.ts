/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? ''}.local`,
        '.env.local',
        `.env.${process.env.NODE_ENV ?? ''}`,
        '.env'
      ],
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
class AppModule {}

export { AppModule }
