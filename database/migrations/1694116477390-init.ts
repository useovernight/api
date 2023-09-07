/**
 * Copyright (c) Overnight
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class Init1694116477390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS postgis CASCADE')
  }
}

export { Init1694116477390 }
