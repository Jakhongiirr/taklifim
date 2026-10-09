import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaklifLockedEventAt1791640000000 implements MigrationInterface {
  name = 'AddTaklifLockedEventAt1791640000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "lockedEventAt" TIMESTAMP WITH TIME ZONE`,
    );
    // Invitations published before this column existed count from today's date.
    await queryRunner.query(
      `UPDATE "taklif" SET "lockedEventAt" = "eventAt" WHERE "status" <> 'draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "lockedEventAt"`);
  }
}
