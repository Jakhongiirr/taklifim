import { MigrationInterface, QueryRunner } from 'typeorm';

export class ViewCounts1792400000000 implements MigrationInterface {
  name = 'ViewCounts1792400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "viewCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TABLE "daily_visits" ("day" date NOT NULL, "visitors" integer NOT NULL DEFAULT '0', "invitationViews" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_daily_visits_day" PRIMARY KEY ("day"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "daily_visits"`);
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "viewCount"`);
  }
}
