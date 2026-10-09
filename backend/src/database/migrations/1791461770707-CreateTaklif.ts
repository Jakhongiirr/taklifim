import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaklif1791461770707 implements MigrationInterface {
  name = 'CreateTaklif1791461770707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "taklif_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taklifId" uuid NOT NULL, "fileId" uuid NOT NULL, "position" smallint NOT NULL, CONSTRAINT "PK_9a23ebbce8b611a2171d0dfad4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_taklif_photos_fileId" ON "taklif_photos" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5288ebae2972b1766d6074ac26" ON "taklif_photos" ("taklifId", "position") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."taklif_status_enum" AS ENUM('draft', 'published', 'unpublished')`,
    );
    await queryRunner.query(
      `CREATE TABLE "taklif" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(16) NOT NULL, "userId" uuid NOT NULL, "status" "public"."taklif_status_enum" NOT NULL DEFAULT 'draft', "brideName" character varying(100) NOT NULL, "groomName" character varying(100) NOT NULL, "hostName" character varying(100) NOT NULL, "venueName" character varying(200) NOT NULL, "venueAddress" character varying(300) NOT NULL, "locationUrl" character varying(500) NOT NULL, "cardNumber" character varying(19), "phone" character varying(20), "musicId" uuid NOT NULL, "themeId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_74ad2ec593f7c7d7368f6c7abc0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_taklif_slug" ON "taklif" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57fde8105d77c089ae53ff34d2" ON "taklif" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0fc406122b251212b7e4f7c481" ON "taklif" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_photos" ADD CONSTRAINT "FK_db92aeb876dea18ea02c66b07bb" FOREIGN KEY ("taklifId") REFERENCES "taklif"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_photos" ADD CONSTRAINT "FK_4797eb978248a1285d58223ca20" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD CONSTRAINT "FK_57fde8105d77c089ae53ff34d28" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD CONSTRAINT "FK_41f8c7f90bbe2bfe52c036b670b" FOREIGN KEY ("musicId") REFERENCES "music"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD CONSTRAINT "FK_8798c4fa8f30ff118a0e8fb2996" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP CONSTRAINT "FK_8798c4fa8f30ff118a0e8fb2996"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP CONSTRAINT "FK_41f8c7f90bbe2bfe52c036b670b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP CONSTRAINT "FK_57fde8105d77c089ae53ff34d28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_photos" DROP CONSTRAINT "FK_4797eb978248a1285d58223ca20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_photos" DROP CONSTRAINT "FK_db92aeb876dea18ea02c66b07bb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0fc406122b251212b7e4f7c481"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_57fde8105d77c089ae53ff34d2"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_taklif_slug"`);
    await queryRunner.query(`DROP TABLE "taklif"`);
    await queryRunner.query(`DROP TYPE "public"."taklif_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5288ebae2972b1766d6074ac26"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_taklif_photos_fileId"`);
    await queryRunner.query(`DROP TABLE "taklif_photos"`);
  }
}
