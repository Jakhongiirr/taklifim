import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMusicPosition1792000000000 implements MigrationInterface {
  name = 'AddMusicPosition1792000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "music" ADD "position" integer NOT NULL DEFAULT 0`,
    );
    // Keep today's order (newest first) as the starting order.
    await queryRunner.query(
      `UPDATE "music" m SET "position" = o.rn - 1 FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) AS rn FROM "music") o WHERE o.id = m.id`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "music" DROP COLUMN "position"`);
  }
}
