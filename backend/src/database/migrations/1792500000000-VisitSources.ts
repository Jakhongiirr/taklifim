import { MigrationInterface, QueryRunner } from 'typeorm';

export class VisitSources1792500000000 implements MigrationInterface {
  name = 'VisitSources1792500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "daily_sources" ("day" date NOT NULL, "source" character varying(64) NOT NULL, "site" integer NOT NULL DEFAULT '0', "invitation" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_daily_sources_day_source" PRIMARY KEY ("day", "source"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "daily_sources"`);
  }
}
