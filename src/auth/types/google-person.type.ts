/**
 * Copyright (c) Overnight
 */

interface EmailAddress {
  metadata: {
    primary: boolean
  }
  value: string
}

interface Name {
  metadata: {
    primary: boolean
  }
  givenName: string
}

interface Photo {
  metadata: {
    primary: boolean
  }
  url: string
}

interface GooglePerson {
  resourceName: string
  emailAddresses: EmailAddress[]
  names: Name[]
  photos: Photo[]
}

export type { GooglePerson, EmailAddress, Name, Photo }
