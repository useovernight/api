/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
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
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: Number.parseInt(
          configService.get<string>('POSTGRES_PORT') ?? '5432'
        ),
        username: configService.get<string>('POSTGRES_USERNAME'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        // eslint-disable-next-line unicorn/prefer-module
        entities: [`${__dirname}/**/entities/*.entity.{js,ts}`],
        synchronize:
          configService.get<string>('POSTGRES_SYNCHRONIZE') === 'true'
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
class AppModule {}

export { AppModule }
