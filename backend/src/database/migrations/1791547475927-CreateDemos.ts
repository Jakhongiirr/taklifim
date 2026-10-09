import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDemos1791547475927 implements MigrationInterface {
  name = 'CreateDemos1791547475927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "demos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "text" text NOT NULL, "demoUrl" character varying(500) NOT NULL, "imageId" uuid NOT NULL, "themeId" uuid NOT NULL, "archivedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a0918b73a3bd78c313e0e085f5c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_851c936a45771106467b691180" ON "demos" ("themeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53a4558b24be205b1365631d3b" ON "demos" ("archivedAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "demos" ADD CONSTRAINT "FK_2ab542c8c4a2b4786660cc50f16" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demos" ADD CONSTRAINT "FK_851c936a45771106467b691180a" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "demos" DROP CONSTRAINT "FK_851c936a45771106467b691180a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demos" DROP CONSTRAINT "FK_2ab542c8c4a2b4786660cc50f16"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53a4558b24be205b1365631d3b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_851c936a45771106467b691180"`,
    );
    await queryRunner.query(`DROP TABLE "demos"`);
  }
}
