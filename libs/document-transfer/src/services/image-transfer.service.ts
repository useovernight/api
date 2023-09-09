/**
 * Copyright (c) Overnight
 */

import sharp from 'sharp'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getRandomString } from '../../../../src/common/helpers/random.helper'
import type { Express } from 'express'
import type { DocumentResult } from '../types/document-result.type'

@Injectable()
class ImageTransferService {
  private readonly s3Region: string
  private readonly s3Bucket: string
  private readonly s3Client: S3Client

  constructor(private readonly configService: ConfigService) {
    this.s3Region = this.configService.get<string>('AWS_S3_REGION') ?? ''
    this.s3Bucket = this.configService.get<string>('AWS_S3_BUCKET') ?? ''
    this.s3Client = new S3Client({
      region: this.s3Region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? ''
      }
    })
  }

  async upload(
    file: Express.Multer.File,
    dimensions: [number, number]
  ): Promise<DocumentResult> {
    const [width, height] = dimensions
    const key = getRandomString(48)
    const url = `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${key}`

    const outputBuffer = await sharp(file.buffer)
      .resize(width, height, {
        fit: 'cover'
      })
      .jpeg({
        quality: 90
      })
      .toBuffer()

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.s3Bucket,
        Key: key,
        Body: outputBuffer,
        ContentType: 'image/jpeg'
      })
    )

    return {
      url,
      key
    }
  }

  async delete(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.s3Bucket,
        Key: key
      })
    )
  }
}

export { ImageTransferService }
