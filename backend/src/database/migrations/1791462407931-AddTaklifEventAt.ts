import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaklifEventAt1791462407931 implements MigrationInterface {
  name = 'AddTaklifEventAt1791462407931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Existing rows get their creation time; edit them to the real date.
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "eventAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`UPDATE "taklif" SET "eventAt" = "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "taklif" ALTER COLUMN "eventAt" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "eventAt"`);
  }
}
