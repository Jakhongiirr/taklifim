import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaklifGuests1792252201333 implements MigrationInterface {
  name = 'CreateTaklifGuests1792252201333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "taklif_guests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taklifId" uuid NOT NULL, "name" character varying(60) NOT NULL, "token" character varying(8) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8f9eaccf906cf04a86b9e9ca39f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4d2481537a2cd016eee3d1275b" ON "taklif_guests" ("taklifId", "token") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_responses" ADD "guestId" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_79dbca51369fa790e06c4e46d0" ON "taklif_responses" ("guestId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_guests" ADD CONSTRAINT "FK_cbd398c23c62c46cbfe54b0f92d" FOREIGN KEY ("taklifId") REFERENCES "taklif"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_responses" ADD CONSTRAINT "FK_79dbca51369fa790e06c4e46d0b" FOREIGN KEY ("guestId") REFERENCES "taklif_guests"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif_responses" DROP CONSTRAINT "FK_79dbca51369fa790e06c4e46d0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_guests" DROP CONSTRAINT "FK_cbd398c23c62c46cbfe54b0f92d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79dbca51369fa790e06c4e46d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_responses" DROP COLUMN "guestId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d2481537a2cd016eee3d1275b"`,
    );
    await queryRunner.query(`DROP TABLE "taklif_guests"`);
  }
}
