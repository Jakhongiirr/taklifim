import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaklifLetterText1792800000000 implements MigrationInterface {
  name = 'TaklifLetterText1792800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taklif" ADD "letterText" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "letterText"`);
  }
}
