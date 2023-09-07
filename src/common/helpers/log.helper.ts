/**
 * Copyright (c) Overnight
 */

import type { Request } from 'express'
import type { Account } from '../../accounts/entities/account.entity'

type SearchParameter = [string, string]

const getSearchParameters = (request: Request): SearchParameter[] => {
  const { path, url } = request
  const queryString = url.slice(path.length + 1)
  const urlSearchParameters = new URLSearchParams(queryString)

  return Array.from(urlSearchParameters, ([key, value]) => [key, value])
}

const getLogRequestMessage = (request: Request): string => {
  const account = request.user as Account | undefined
  const { method, path } = request

  const prefix = account === undefined ? '' : `${account.id}:`
  const searchParameters = getSearchParameters(request).map(
    ([key, value]) => `${key}=${value}`
  )

  const segments = [prefix, method, path, ...searchParameters].filter(
    (value) => value.length > 0
  )

  return segments.join(' ')
}

const getLogErrorMessage = (request: Request, statusCode: number): string => {
  const account = request.user as Account | undefined
  const { method, path } = request

  const prefix = account === undefined ? '' : `${account.id}:`
  const searchParameters = getSearchParameters(request).map(
    ([key, value]) => `${key}=${value}`
  )

  const segments = [
    prefix,
    statusCode.toString(),
    method,
    path,
    ...searchParameters
  ].filter((value) => value.length > 0)

  return segments.join(' ')
}

export { getLogRequestMessage, getLogErrorMessage }
