import { MigrationInterface, QueryRunner } from 'typeorm';

export class OptionalLocationUrl1791739871278 implements MigrationInterface {
  name = 'OptionalLocationUrl1791739871278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ALTER COLUMN "locationUrl" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Invitations saved without a map link would block NOT NULL.
    await queryRunner.query(
      `UPDATE "taklif" SET "locationUrl" = '' WHERE "locationUrl" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ALTER COLUMN "locationUrl" SET NOT NULL`,
    );
  }
}
