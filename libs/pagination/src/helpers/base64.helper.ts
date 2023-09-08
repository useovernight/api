/**
 * Copyright (c) Overnight
 */

import { Buffer } from 'node:buffer'

const encode = (value: string) => Buffer.from(value).toString('base64')
const decode = (value: string) => Buffer.from(value, 'base64').toString()

export { encode, decode }
