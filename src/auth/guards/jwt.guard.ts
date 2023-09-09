/**
 * Copyright (c) Overnight
 */

import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {}

export { JwtAuthGuard }
