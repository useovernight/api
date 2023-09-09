/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrganizationsController } from './controllers/organizations.controller'
import { Organization } from './entities/organization.entity'
import { OrganizationsService } from './services/organizations.service'
import { CaslModule } from '../casl/casl.module'

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), CaslModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService]
})
class OrganizationsModule {}

export { OrganizationsModule }
