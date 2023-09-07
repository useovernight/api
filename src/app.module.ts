/**
 * Copyright (c) Overnight
 */

import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { AuthTokensModule } from './auth-tokens/auth-tokens.module'
import { AccountsModule } from './accounts/accounts.module'

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
    }),
    AccountsModule,
    AuthModule,
    AuthTokensModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true
        })
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
class AppModule {}

export { AppModule }
