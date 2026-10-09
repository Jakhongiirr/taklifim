import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateThemes1791458389887 implements MigrationInterface {
  name = 'CreateThemes1791458389887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "themes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "themeId" character varying(50) NOT NULL, "archivedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ddbeaab913c18682e5c88155592" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fa521d157f61786b0909829eeb" ON "themes" ("themeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_465220b1b9bf6f7c58e6c4aefd" ON "themes" ("archivedAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_465220b1b9bf6f7c58e6c4aefd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fa521d157f61786b0909829eeb"`,
    );
    await queryRunner.query(`DROP TABLE "themes"`);
  }
}
