import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaklifCustomMusic1792300000000 implements MigrationInterface {
  name = 'TaklifCustomMusic1792300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "customMusicFileId" uuid`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_taklif_customMusicFileId" ON "taklif" ("customMusicFileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD CONSTRAINT "FK_cf0f3e4c2a44e3a3c9b160020da" FOREIGN KEY ("customMusicFileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP CONSTRAINT "FK_cf0f3e4c2a44e3a3c9b160020da"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_taklif_customMusicFileId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP COLUMN "customMusicFileId"`,
    );
  }
}
