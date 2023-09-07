/**
 * Copyright (c) Overnight
 */

import type { MigrationInterface, QueryRunner } from 'typeorm'

class AddAccountAndAuthEntities1694120003195 implements MigrationInterface {
  name = 'AddAccountAndAuthEntities1694120003195'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" character varying NOT NULL, "username" character varying NOT NULL, "handle" character varying NOT NULL, "avatar" character varying NOT NULL, "email" character varying NOT NULL, "permissions" text NOT NULL, "serializerGroups" text NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_734bbcf136a53616581ed7489c1" UNIQUE ("handle"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "google_credentials" ("id" character varying NOT NULL, "googleId" character varying NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" character varying, CONSTRAINT "REL_787fb7d4a7726c6d119593a93c" UNIQUE ("accountId"), CONSTRAINT "PK_7a6d9466fd05f8c23d7642a7b24" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "auth_token" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lastActive" TIMESTAMP(3) WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" character varying, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "google_credentials" ADD CONSTRAINT "FK_787fb7d4a7726c6d119593a93c3" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "auth_token" ADD CONSTRAINT "FK_1ca2aa6f99ace1bd1d9a5e90d6d" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_token" DROP CONSTRAINT "FK_1ca2aa6f99ace1bd1d9a5e90d6d"`
    )
    await queryRunner.query(
      `ALTER TABLE "google_credentials" DROP CONSTRAINT "FK_787fb7d4a7726c6d119593a93c3"`
    )
    await queryRunner.query(`DROP TABLE "auth_token"`)
    await queryRunner.query(`DROP TABLE "google_credentials"`)
    await queryRunner.query(`DROP TABLE "account"`)
  }
}

export { AddAccountAndAuthEntities1694120003195 }
