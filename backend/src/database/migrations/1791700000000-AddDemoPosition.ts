import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDemoPosition1791700000000 implements MigrationInterface {
  name = 'AddDemoPosition1791700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "demos" ADD "position" integer NOT NULL DEFAULT 0`,
    );
    // Keep today's order (newest first) as the starting order.
    await queryRunner.query(
      `UPDATE "demos" d SET "position" = o.rn - 1 FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) AS rn FROM "demos") o WHERE o.id = d.id`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demos" DROP COLUMN "position"`);
  }
}
