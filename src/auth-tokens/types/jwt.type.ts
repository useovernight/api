/**
 * Copyright (c) Overnight
 */

interface JwtApplicationPayload {
  jti: string
  sub: string
}

interface JwtPayload extends JwtApplicationPayload {
  iat: string
  exp: string
}

export type { JwtApplicationPayload, JwtPayload }
