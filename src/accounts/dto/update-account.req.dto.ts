/**
 * Copyright (c) Overnight
 */

import { PartialType } from '@nestjs/swagger'
import { CreateAccountReqDto } from './create-account.req.dto'

class UpdateAccountReqDto extends PartialType(CreateAccountReqDto) {}

export { UpdateAccountReqDto }
