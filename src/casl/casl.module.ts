/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { CaslAbilityFactory } from './casl-ability.factory'

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory]
})
class CaslModule {}

export { CaslModule }
