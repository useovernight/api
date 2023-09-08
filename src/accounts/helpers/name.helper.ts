/**
 * Copyright (c) Overnight
 */

import {
  AllowedHandleCharacters,
  ForbiddenHandleSubstrings,
  ForbiddenUsernameCharacters,
  ForbiddenUsernameSubstrings
} from '../../common/constants/name.const'

const validateUsername = (username: string): string[] => {
  const errors = []

  if (username !== username.trim()) {
    errors.push('Usernames must neither start nor end with a space.')
  }

  if (username.length === 0) {
    errors.push('The username must consist of at least one character.')
  }

  if (username.length > 32) {
    errors.push('The username cannot exceed 32 characters in length.')
  }

  for (const substring of ForbiddenUsernameSubstrings)
    if (username.toLowerCase().includes(substring))
      errors.push(`The username cannot contain the ${substring} substring.`)

  for (const characters of ForbiddenUsernameCharacters)
    if (username.includes(characters))
      errors.push(
        'The username cannot contain special characters such as line breaks or tabs.'
      )

  return errors
}

const validateHandle = (handle: string): string[] => {
  const errors = []

  if (handle !== handle.trim()) {
    errors.push('Handles must neither start nor end with a space.')
  }

  if (handle.length < 2) {
    errors.push('The handle must consist of at least two characters.')
  }

  if (handle.length > 24) {
    errors.push('The handle cannot exceed 24 characters in length.')
  }

  for (const substring of ForbiddenHandleSubstrings)
    if (handle.toLowerCase().includes(substring))
      errors.push(`The handle cannot contain the ${substring} substring.`)

  const isEveryCharactersValid = [...handle].every((character) =>
    AllowedHandleCharacters.includes(character)
  )

  if (!isEveryCharactersValid) {
    errors.push(
      'The handle contains invalid characters. It may only include lower case characters, digits, hyphens, underscores, or plus signs.'
    )
  }

  return errors
}

export { validateUsername, validateHandle }
