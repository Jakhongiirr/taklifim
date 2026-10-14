import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventAtChangeCount1791900000000 implements MigrationInterface {
  name = 'EventAtChangeCount1791900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "eventAtChanges" integer NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP COLUMN "eventAtChanges"`,
    );
  }
}
