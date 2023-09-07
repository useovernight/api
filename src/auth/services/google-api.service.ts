/**
 * Copyright (c) Overnight
 */

import { catchError, lastValueFrom, map } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import {
  getPrimaryEmailAddress,
  getPrimaryName,
  getPrimaryPhoto
} from '../helpers/google.helper'
import type { GooglePerson } from '../types/google-person.type'
import type { Person } from '../types/person.type'

@Injectable()
class GoogleApiService {
  constructor(private readonly httpService: HttpService) {}

  async getPersonFromAccessToken(accessToken: string): Promise<Person> {
    const fields = ['emailAddresses', 'names', 'photos']

    const url = new URL('https://people.googleapis.com/v1/people/me')
    url.searchParams.set('personFields', fields.join(','))

    const headers = {
      Authorization: `Bearer ${accessToken}`
    }

    const observable = this.httpService
      .get<GooglePerson>(url.href, {
        headers
      })
      .pipe(
        catchError(() => {
          throw new BadRequestException('Unable to sign up with Google.')
        }),
        map((response): Person => {
          const emailAddress = getPrimaryEmailAddress(
            response.data.emailAddresses
          )
          const name = getPrimaryName(response.data.names)
          const photo = getPrimaryPhoto(response.data.photos)

          if (
            emailAddress === undefined ||
            name === undefined ||
            photo === undefined
          ) {
            throw new BadRequestException('Unable to sign up with Google.')
          }

          return {
            id: response.data.resourceName,
            email: emailAddress.value,
            name: name.givenName,
            avatar: photo.url
          }
        })
      )

    return lastValueFrom(observable)
  }
}

export { GoogleApiService }
