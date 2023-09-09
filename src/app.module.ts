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
import { DocumentTransferModule } from '@useovernight/document-transfer'
import { AccountsModule } from './accounts/accounts.module'
import { Account } from './accounts/entities/account.entity'
import { AuthModule } from './auth/auth.module'
import { GoogleCredentials } from './auth/entities/google-credentials.entity'
import { AuthTokensModule } from './auth-tokens/auth-tokens.module'
import { AuthToken } from './auth-tokens/entities/auth-token.entity'
import { CaslModule } from './casl/casl.module'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { NeighborhoodsModule } from './neighborhoods/neighborhoods.module'
import { Neighborhood } from './neighborhoods/entities/neighborhood.entity'
import { NeighborhoodCoverImage } from './neighborhoods/entities/neighborhood-cover-image.entity'
import { OrganizationsModule } from './organizations/organizations.module'
import { Organization } from './organizations/entities/organization.entity'
import { OrganizationImage } from './organizations/entities/organization-image.entity'

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
        entities: [
          Account,
          GoogleCredentials,
          AuthToken,
          Neighborhood,
          NeighborhoodCoverImage,
          Organization,
          OrganizationImage
        ],
        synchronize:
          configService.get<string>('POSTGRES_SYNCHRONIZE') === 'true'
      }),
      inject: [ConfigService]
    }),
    AccountsModule,
    AuthModule,
    AuthTokensModule,
    CaslModule,
    DocumentTransferModule,
    NeighborhoodsModule,
    OrganizationsModule
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
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
class AppModule {}

export { AppModule }
