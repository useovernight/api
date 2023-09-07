/**
 * Copyright (c) Overnight
 */

import { StatusCodeClass } from '../enums/status-code-class.enum'

const getStatusCodeClass = (statusCode: number): StatusCodeClass => {
  const getFirstDigit = statusCode.toString().at(0)

  switch (getFirstDigit) {
    case '1': {
      return StatusCodeClass.Informational
    }
    case '2': {
      return StatusCodeClass.Successful
    }
    case '3': {
      return StatusCodeClass.Redirection
    }
    case '4': {
      return StatusCodeClass.ClientError
    }
    case '5': {
      return StatusCodeClass.ServerError
    }
    default: {
      return StatusCodeClass.Unknown
    }
  }
}

export { getStatusCodeClass }
