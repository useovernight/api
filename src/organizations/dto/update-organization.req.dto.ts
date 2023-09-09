/**
 * Copyright (c) Overnight
 */

import { PartialType } from '@nestjs/swagger'
import { CreateOrganizationReqDto } from './create-organization.req.dto'

class UpdateOrganizationReqDto extends PartialType(CreateOrganizationReqDto) {}

export { UpdateOrganizationReqDto }
