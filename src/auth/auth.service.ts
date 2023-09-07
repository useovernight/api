/**
 * Copyright (c) Overnight
 */

import { Repository } from 'typeorm'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GoogleCredentials } from './entities/google-credentials.entity'
import { GoogleApiService } from './services/google-api.service'
import { Account } from '../accounts/entities/account.entity'
import { DefaultPermissions } from '../common/constants/permission.const'
import { DefaultSerializerGroups } from '../common/constants/serializer-group.const'
import { getSecureRandomString } from '../common/helpers/random.helper'

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(GoogleCredentials)
    private readonly googleCredentialsRepository: Repository<GoogleCredentials>,
    private readonly googleApiService: GoogleApiService
  ) {}

  async signupWithGoogleAccessToken(accessToken: string) {
    const person = await this.googleApiService.getPersonFromAccessToken(
      accessToken
    )

    const googleCredentials = await this.googleCredentialsRepository.findOneBy({
      googleId: person.id
    })

    if (googleCredentials) {
      throw new BadRequestException(
        'This Google account is already associated with an account.'
      )
    }

    const account = await this.accountsRepository.save(
      this.accountsRepository.create({
        username: person.name,
        handle: getSecureRandomString(16),
        avatar: person.avatar,
        email: person.email,
        permissions: DefaultPermissions,
        serializerGroups: DefaultSerializerGroups
      })
    )
    await this.googleCredentialsRepository.save(
      this.googleCredentialsRepository.create({
        googleId: person.id,
        account
      })
    )

    return account
  }
}

export { AuthService }
