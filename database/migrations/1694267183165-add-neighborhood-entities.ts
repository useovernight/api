/**
 * Copyright (c) Overnight
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class AddNeighborhoodEntities1694267183165 implements MigrationInterface {
  name = 'AddNeighborhoodEntities1694267183165'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "neighborhood_cover_image" ("id" character varying NOT NULL, "url" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "key" character varying NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6b13f0f579cb97d223118de95dc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "neighborhood" ("id" character varying NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "imageId" character varying, CONSTRAINT "REL_9229826a1c3ffd4c5fefc2f083" UNIQUE ("imageId"), CONSTRAINT "PK_97797961be30242a5170d17caec" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "neighborhood" ADD CONSTRAINT "FK_9229826a1c3ffd4c5fefc2f0831" FOREIGN KEY ("imageId") REFERENCES "neighborhood_cover_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "neighborhood" DROP CONSTRAINT "FK_9229826a1c3ffd4c5fefc2f0831"`
    )
    await queryRunner.query(`DROP TABLE "neighborhood"`)
    await queryRunner.query(`DROP TABLE "neighborhood_cover_image"`)
  }
}

export { AddNeighborhoodEntities1694267183165 }
