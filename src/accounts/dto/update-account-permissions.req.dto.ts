/**
 * Copyright (c) Overnight
 */

import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Permission } from '../../common/enums/permission.enum'

class UpdateAccountPermissionsReqDto {
  @ApiProperty()
  @IsEnum(Permission, {
    each: true
  })
  permissions: Permission[]
}

export { UpdateAccountPermissionsReqDto }
