/**
 * Copyright (c) Overnight
 */

import { Repository } from 'typeorm'
import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Organization } from '../entities/organization.entity'
import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
import { CaslAction } from '../../common/enums/casl-action.enum'
import type { CreateOrganizationReqDto } from '../dto/create-organization.req.dto'
import type { UpdateOrganizationReqDto } from '../dto/update-organization.req.dto'
import type { Account } from '../../accounts/entities/account.entity'

@Injectable()
class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findOneBy({ id })

    if (organization === null) {
      throw new NotFoundException()
    }

    return organization
  }

  async create(
    body: CreateOrganizationReqDto,
    initiator: Account
  ): Promise<Organization> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)
    const organization = this.organizationsRepository.create(body)

    if (ability.cannot(CaslAction.Create, organization)) {
      throw new ForbiddenException()
    }

    return this.organizationsRepository.save(organization)
  }

  async update(
    subject: Organization,
    body: UpdateOrganizationReqDto,
    initiator: Account
  ): Promise<Organization> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)

    if (ability.cannot(CaslAction.Update, subject)) {
      throw new ForbiddenException()
    }

    await this.organizationsRepository.save({
      ...subject,
      ...body
    })

    return this.findById(subject.id)
  }

  async updateById(
    id: string,
    body: UpdateOrganizationReqDto,
    initiator: Account
  ): Promise<Organization> {
    const subject = await this.findById(id)
    return this.update(subject, body, initiator)
  }

  async delete(subject: Organization, initiator: Account): Promise<void> {
    const ability = this.caslAbilityFactory.createForAccount(initiator)

    if (ability.cannot(CaslAction.Delete, subject)) {
      throw new ForbiddenException()
    }

    await this.organizationsRepository.remove(subject)
  }

  async deleteById(id: string, initiator: Account): Promise<void> {
    const subject = await this.findById(id)
    await this.delete(subject, initiator)
  }
}

export { OrganizationsService }
