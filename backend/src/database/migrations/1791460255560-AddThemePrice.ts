import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThemePrice1791460255560 implements MigrationInterface {
  name = 'AddThemePrice1791460255560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Existing themes start at 0; the default only backfills them.
    await queryRunner.query(
      `ALTER TABLE "themes" ADD "price" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "themes" ALTER COLUMN "price" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "themes" DROP COLUMN "price"`);
  }
}
