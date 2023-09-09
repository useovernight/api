/**
 * Copyright (c) Overnight
 */

import { Module } from '@nestjs/common'
import { ImageTransferService } from './services/image-transfer.service'

@Module({
  providers: [ImageTransferService],
  exports: [ImageTransferService]
})
class DocumentTransferModule {}

export { DocumentTransferModule }
