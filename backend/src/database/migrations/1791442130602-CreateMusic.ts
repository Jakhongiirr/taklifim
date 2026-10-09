import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMusic1791442130602 implements MigrationInterface {
  name = 'CreateMusic1791442130602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "music" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "artist" character varying(200), "fileId" uuid NOT NULL, "archivedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c92b010dd889692dd54286f75e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4975665eedb9ee72d94f593894" ON "music" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa27131db25cee694fafa7f4cd" ON "music" ("archivedAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "music" ADD CONSTRAINT "FK_4975665eedb9ee72d94f593894a" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "music" DROP CONSTRAINT "FK_4975665eedb9ee72d94f593894a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aa27131db25cee694fafa7f4cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4975665eedb9ee72d94f593894"`,
    );
    await queryRunner.query(`DROP TABLE "music"`);
  }
}
