/**
 * Copyright (c) Overnight
 */

import process from 'node:process'
import { DataSource } from 'typeorm'

const TypeormDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number.parseInt(process.env.POSTGRES_PORT ?? '5432'),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
  synchronize: false
})

export { TypeormDataSource }
