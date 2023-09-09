/**
 * Copyright (c) Overnight
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class AddOrganizationEntities1694295665337 implements MigrationInterface {
  name = 'AddOrganizationEntities1694295665337'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" character varying NOT NULL, "name" character varying NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "organization_image" ("id" character varying NOT NULL, "url" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "key" character varying NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "organizationId" character varying, CONSTRAINT "PK_09e72692b015f30ba80789b3523" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_image" ADD CONSTRAINT "FK_95f2a35c494ad9651f72a944f79" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_image" DROP CONSTRAINT "FK_95f2a35c494ad9651f72a944f79"`
    )
    await queryRunner.query(`DROP TABLE "organization_image"`)
    await queryRunner.query(`DROP TABLE "organization"`)
  }
}

export { AddOrganizationEntities1694295665337 }
