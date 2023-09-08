/**
 * Copyright (c) Overnight
 */

import { LowerCaseAlpha, Numeric } from './string.const'

const ForbiddenUsernameCharacters = ['\t', '\n', '\r']
const ForbiddenUsernameSubstrings = ['overnight']

const AllowedHandleCharacters = `${LowerCaseAlpha}${Numeric}+-_`
const ForbiddenHandleSubstrings = ['overnight']

export {
  AllowedHandleCharacters,
  ForbiddenHandleSubstrings,
  ForbiddenUsernameCharacters,
  ForbiddenUsernameSubstrings
}
