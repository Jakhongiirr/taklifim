import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaklifOccasion1792600000000 implements MigrationInterface {
  name = 'TaklifOccasion1792600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "occasion" character varying(16) NOT NULL DEFAULT 'wedding'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "occasion"`);
  }
}
