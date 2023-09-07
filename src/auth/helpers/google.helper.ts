/**
 * Copyright (c) Overnight
 */

import type { EmailAddress, Name, Photo } from '../types/google-person.type'

const getPrimaryEmailAddress = (
  emailAddresses: EmailAddress[]
): EmailAddress | undefined =>
  emailAddresses.find((emailAddress) => emailAddress.metadata.primary)

const getPrimaryName = (names: Name[]): Name | undefined =>
  names.find((name) => name.metadata.primary)

const getPrimaryPhoto = (photos: Photo[]): Photo | undefined =>
  photos.find((photo) => photo.metadata.primary)

export { getPrimaryEmailAddress, getPrimaryName, getPrimaryPhoto }
