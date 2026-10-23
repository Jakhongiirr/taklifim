import { MigrationInterface, QueryRunner } from 'typeorm';

/** Invitations in the plov design are a plov, whatever they said before. */
export class PlovOccasion1792900000000 implements MigrationInterface {
  name = 'PlovOccasion1792900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "taklif" SET "occasion" = 'plov' WHERE "themeId" IN (SELECT "id" FROM "themes" WHERE "themeId" = 'plov')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "taklif" SET "occasion" = 'wedding' WHERE "occasion" = 'plov'`,
    );
  }
}
